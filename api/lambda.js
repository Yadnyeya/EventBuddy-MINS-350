// Lambda Handler for EventBuddy API
// Wraps Express app for AWS Lambda deployment with Secrets Manager integration

const serverless = require('serverless-http');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import routes
import eventsRouter from './routes/events.js';
import studentsRouter from './routes/students.js';
import attendRouter from './routes/attend.js';

const app = express();

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
  /\.amplifyapp\.com$/ // Allow all Amplify domains
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return allowed === origin;
    })) {
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

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ============================================================================
// ROUTES
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

// API routes
app.use('/api/events', eventsRouter);
app.use('/api/students', studentsRouter);
app.use('/api/attend', attendRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'EventBuddy API Server',
    version: '2.0.0',
    endpoints: {
      health: '/health',
      events: '/api/events',
      students: '/api/students',
      attend: '/api/attend'
    }
  });
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

// Wrap Express app with serverless-http and load secrets before each invocation
export const handler = async (event, context) => {
  // Load secrets on cold start
  await loadSecrets();
  
  // Create serverless handler
  const serverlessHandler = serverless(app);
  
  // Invoke the handler
  return serverlessHandler(event, context);
};

// Export app for local development
export default app;
