// Supabase Configuration for API Server
// Creates Supabase client for server-side operations

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_KEY; // Secret key for admin operations

if (!supabaseUrl || !supabaseSecretKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.error('Required: VITE_SUPABASE_URL and SUPABASE_SECRET_KEY');
  process.exit(1);
}

if (!process.env.SUPABASE_SECRET_KEY) {
  console.warn('⚠️ Using legacy SUPABASE_SERVICE_KEY; migrate to SUPABASE_SECRET_KEY.');
}

// Create Supabase admin client (bypasses RLS for admin operations)
export const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Create Supabase client with user context (respects RLS)
export const createUserSupabaseClient = (accessToken) => {
  return createClient(
    supabaseUrl,
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    }
  );
};

// Middleware to verify user authentication
export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.substring(7);
    
    // Verify token with Supabase
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    
    // Attach user to request
    req.user = user;
    req.supabase = createUserSupabaseClient(token);
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Backwards compatibility alias
export const requireAuth = authenticateUser;

console.log('✅ Supabase client configured');
