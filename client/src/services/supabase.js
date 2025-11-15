// Supabase Client Configuration for Frontend
// Handles authentication and direct database queries from client

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.error('Make sure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are set in .env');
} else if (!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) {
  console.warn('⚠️ Using legacy VITE_SUPABASE_ANON_KEY; migrate to VITE_SUPABASE_PUBLISHABLE_KEY.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// ============================================================================
// AUTHENTICATION HELPERS
// ============================================================================

/**
 * Sign up with email and password
 */
export const signUp = async (email, password, userData = {}) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData // Additional user metadata
    }
  });
  
  if (error) throw error;
  return data;
};

/**
 * Sign in with email and password
 */
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  return data;
};

/**
 * Sign out
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

/**
 * Get current user session
 */
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
};

/**
 * Get current user
 */
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

/**
 * Listen for auth state changes
 */
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback);
};

/**
 * Reset password (sends email)
 */
export const resetPassword = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
};

/**
 * Update user password
 */
export const updatePassword = async (newPassword) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });
  if (error) throw error;
};

// ============================================================================
// DATABASE HELPERS (if needed for direct queries)
// ============================================================================

/**
 * Get current user's access token for API calls
 */
export const getAccessToken = async () => {
  const session = await getSession();
  return session?.access_token;
};

/**
 * Make authenticated API call
 * (Helper for calling your Express API)
 */
export const apiCall = async (endpoint, options = {}) => {
  const token = await getAccessToken();
  
  const apiUrl = import.meta.env.VITE_APP_URL?.replace('5173', '3001') || 'http://localhost:3001';
  
  const response = await fetch(`${apiUrl}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `Request failed with status ${response.status}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

// ============================================================================
// REAL-TIME SUBSCRIPTIONS
// ============================================================================

/**
 * Subscribe to new messages
 */
export const subscribeToMessages = (userId, callback) => {
  return supabase
    .channel('messages')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${userId}`
      },
      callback
    )
    .subscribe();
};

/**
 * Subscribe to connection requests
 */
export const subscribeToConnections = (userId, callback) => {
  return supabase
    .channel('connections')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'connections',
        filter: `receiver_id=eq.${userId}`
      },
      callback
    )
    .subscribe();
};

/**
 * Subscribe to event updates
 */
export const subscribeToEvents = (callback) => {
  return supabase
    .channel('events')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'events'
      },
      callback
    )
    .subscribe();
};

export default supabase;
