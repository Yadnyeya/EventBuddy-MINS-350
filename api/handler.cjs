// Lambda Handler for EventBuddy API (CommonJS version)
// Wraps Express app for AWS Lambda deployment with Secrets Manager integration

const serverless = require('serverless-http');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Trust proxy - required for AWS Lambda behind API Gateway
app.set('trust proxy', true);

// ============================================================================
// LOAD SECRETS FROM AWS SECRETS MANAGER
// ============================================================================

let secretsLoaded = false;

async function loadSecrets() {
  if (secretsLoaded) return;
  
  // Skip loading secrets if running locally (serverless offline)
  if (process.env.IS_OFFLINE || process.env.NODE_ENV === 'development') {
    console.log('🔧 Running locally - using .env file');
    secretsLoaded = true;
    return;
  }

  try {
    const client = new SecretsManagerClient({ region: 'us-east-1' });
    const command = new GetSecretValueCommand({
      SecretId: 'eventbuddy/api/prod'
    });
    
    const response = await client.send(command);
    const secrets = JSON.parse(response.SecretString);
    
    // Set environment variables from secrets
    Object.keys(secrets).forEach(key => {
      process.env[key] = secrets[key];
    });
    
    console.log('✅ Secrets loaded from AWS Secrets Manager');
    secretsLoaded = true;
  } catch (error) {
    console.error('❌ Error loading secrets:', error);
    throw error;
  }
}

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS - Allow requests from Amplify domain and localhost
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://main.d29j968x1tbi08.amplifyapp.com', // Your deployed frontend
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed
    const isAllowed = allowedOrigins.includes(origin) || /\.amplifyapp\.com$/.test(origin);
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting - API Gateway already provides throttling, so we can be more lenient here
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  // Skip rate limiting validation errors in Lambda environment
  validate: { xForwardedForHeader: false, trustProxy: false }
});

app.use('/api/', limiter);

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ============================================================================
// ROUTES (Simple versions for Lambda)
// ============================================================================

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    supabaseConnected: !!process.env.VITE_SUPABASE_URL
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'EventBuddy API Server - Lambda',
    version: '2.0.0',
    endpoints: {
      health: '/health',
      events: '/api/events',
      students: '/api/students',
      attend: '/api/attend'
    }
  });
});

// Import and use routers
// Routes use ES modules, so we'll dynamically import them
let routesConfigured = false;

async function configureRoutes() {
  if (routesConfigured) return;
  
  try {
    // First, add a simple inline route to test if routing works at all
    console.log('🔧 Adding inline test route...');
    app.get('/api/inline-test', (req, res) => {
      res.json({ message: 'Inline route works!', timestamp: new Date().toISOString() });
    });
    console.log('✅ Inline test route added');
    
    // Create a simple manual router to test sub-router mounting
    console.log('🔧 Creating test router...');
    const testRouter = express.Router();
    testRouter.get('/', (req, res) => {
      res.json({ message: 'Test router works!' });
    });
    testRouter.get('/list', (req, res) => {
      res.json({ events: ['event1', 'event2', 'event3'] });
    });
    app.use('/api/test-router', testRouter);
    console.log('✅ Test router mounted');
    
    console.log('🔧 Starting dynamic imports...');
    
    // Dynamically import ES module routes
    const eventsModule = await import('./routes/events.js');
    const studentsModule = await import('./routes/students.js');
    const attendModule = await import('./routes/attend.js');
    const profilesModule = await import('./routes/profiles.js');
    const connectionsModule = await import('./routes/connections.js');
    const messagesModule = await import('./routes/messages.js');
    
    // Extract default exports
    const eventsRouter = eventsModule.default;
    const studentsRouter = studentsModule.default;
    const attendRouter = attendModule.default;
    const profilesRouter = profilesModule.default;
    const connectionsRouter = connectionsModule.default;
    const messagesRouter = messagesModule.default;
    
    console.log('📦 Modules loaded:', {
      events: typeof eventsRouter,
      students: typeof studentsRouter,
      attend: typeof attendRouter,
      profiles: typeof profilesRouter,
      connections: typeof connectionsRouter,
      messages: typeof messagesRouter
    });
    
    console.log('🔍 Events router details:', {
      isFunction: typeof eventsRouter === 'function',
      hasStack: eventsRouter && eventsRouter.stack !== undefined,
      constructorName: eventsRouter && eventsRouter.constructor && eventsRouter.constructor.name
    });
    
    app.use('/api/events', eventsRouter);
    app.use('/api/students', studentsRouter);
    app.use('/api/attend', attendRouter);
    app.use('/api/profiles', profilesRouter);
    app.use('/api/connections', connectionsRouter);
    app.use('/api/messages', messagesRouter);
    
    // Simple test route to verify mounting works
    app.get('/api/events-test', (req, res) => {
      res.json({ message: 'Direct route works!' });
    });
    
    // Log registered routes
    console.log('📍 Registered routes:', app._router.stack
      .filter(r => r.route)
      .map(r => ({ path: r.route.path, methods: Object.keys(r.route.methods) }))
    );
    
    // Log middleware/router mounts
    console.log('🔌 Mounted middleware:', app._router.stack
      .filter(r => r.name === 'router')
      .map(r => ({ regexp: r.regexp.toString(), name: r.name }))
    );
    
    routesConfigured = true;
    console.log('✅ Routes configured successfully');
  } catch (error) {
    console.error('❌ Error configuring routes:', error);
    throw error;
  }
}

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    timestamp: new Date().toISOString()
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: err.message || 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// ============================================================================
// LAMBDA HANDLER EXPORT
// ============================================================================

let handler = null;

// Initialize handler on cold start
async function initializeHandler() {
  if (handler) return handler;
  
  try {
    // Load secrets and configure routes
    console.log('🚀 Initializing handler - loading secrets...');
    await loadSecrets();
    console.log('🚀 Initializing handler - configuring routes...');
    await configureRoutes();
    console.log('🚀 Initializing handler - creating serverless wrapper...');
    
    // Create serverless handler AFTER routes are configured
    handler = serverless(app);
    console.log('✅ Lambda handler initialized');
    console.log('📊 Total middleware/routes:', app._router.stack.length);
    
    return handler;
  } catch (error) {
    console.error('❌ Error initializing handler:', error);
    throw error;
  }
}

// Wrap Express app with serverless-http
module.exports.handler = async (event, context) => {
  try {
    const serverlessHandler = await initializeHandler();
    return await serverlessHandler(event, context);
  } catch (error) {
    console.error('Lambda handler error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error', message: error.message })
    };
  }
};
