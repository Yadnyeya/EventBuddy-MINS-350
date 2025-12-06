// Simplified Lambda Handler - Inline routes to test if serverless-http works
const serverless = require('serverless-http');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
app.set('trust proxy', true);

// Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Root
app.get('/', (req, res) => {
  res.json({ message: 'EventBuddy API - Simplified Handler', version: '3.0.0' });
});

// Simple test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test route works!' });
});

// Events route - will be populated after secrets load
let supabaseAdmin = null;

app.get('/api/events', async (req, res) => {
  if (!supabaseAdmin) {
    return res.status(503).json({ error: 'Supabase not initialized' });
  }
  
  try {
    const { data, error } = await supabaseAdmin
      .from('events')
      .select('*')
      .limit(20);
    
    if (error) throw error;
    res.json({ events: data });  // Wrap in object for frontend
  } catch (error) {
    console.error('Events error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Students route
app.get('/api/students', async (req, res) => {
  if (!supabaseAdmin) {
    return res.status(503).json({ error: 'Supabase not initialized' });
  }
  
  try {
    const { search } = req.query;
    let query = supabaseAdmin.from('student').select('*');
    
    if (search) {
      query = query.or(`email.ilike.%${search}%,year.eq.${search}`);
    }
    
    const { data, error } = await query.limit(20);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Students error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get my profile
app.get('/api/students/me/profile', async (req, res) => {
  if (!supabaseAdmin) {
    return res.status(503).json({ error: 'Supabase not initialized' });
  }
  
  try {
    // Get user ID from Supabase auth header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Extract JWT token and get user
    const token = authHeader.replace('Bearer ', '');
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    // Get profile
    const { data, error } = await supabaseAdmin
      .from('student')
      .select('*')
      .eq('student_id', user.id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    res.json(data || null);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create/update my profile
app.post('/api/students/me/profile', async (req, res) => {
  if (!supabaseAdmin) {
    return res.status(503).json({ error: 'Supabase not initialized' });
  }
  
  try {
    // Get user ID from Supabase auth header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    // Upsert profile
    const { data, error } = await supabaseAdmin
      .from('student')
      .upsert({
        student_id: user.id,
        email: req.body.email || user.email,
        year: req.body.year,
        is_verified: req.body.is_verified !== undefined ? req.body.is_verified : true
      }, {
        onConflict: 'student_id'
      })
      .select()
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Upsert profile error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add interest
app.post('/api/students/me/interests', async (req, res) => {
  if (!supabaseAdmin) {
    return res.status(503).json({ error: 'Supabase not initialized' });
  }
  
  try {
    // Get user ID
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    // Add interest
    const { data, error } = await supabaseAdmin
      .from('interest')
      .insert({
        student_id: user.id,
        interest_name: req.body.interest || req.body.interest_name
      })
      .select()
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Add interest error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.path });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

// Create the serverless handler once
const handler = serverless(app);

// Load secrets and initialize Supabase
let initialized = false;

async function initializeSupabase() {
  if (initialized) return;
  
  try {
    const client = new SecretsManagerClient({ region: 'us-east-1' });
    const response = await client.send(new GetSecretValueCommand({
      SecretId: 'eventbuddy/api/prod'
    }));
    
    const secrets = JSON.parse(response.SecretString);
    Object.keys(secrets).forEach(key => {
      process.env[key] = secrets[key];
    });
    
    // Now import and initialize Supabase
    const { createClient } = require('@supabase/supabase-js');
    supabaseAdmin = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SECRET_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
    
    initialized = true;
    console.log('✅ Supabase initialized');
  } catch (error) {
    console.error('❌ Initialization error:', error);
    throw error;
  }
}

// Export handler that initializes on first call
module.exports.handler = async (event, context) => {
  try {
    await initializeSupabase();
    return await handler(event, context);
  } catch (error) {
    console.error('Lambda error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
