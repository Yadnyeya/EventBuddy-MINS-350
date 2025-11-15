// Connections API Service - Buddy connections and matching endpoints

import { apiCall } from './supabase';

/**
 * Fetch all active connections for the authenticated user.
 */
export const getConnections = async (status) => {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  const query = params.toString();

  return apiCall(`/api/connections${query ? `?${query}` : ''}`);
};

/**
 * Fetch pending connection requests the user has received.
 */
export const getPendingReceived = async () => {
  return apiCall('/api/connections/pending/received');
};

/**
 * Fetch pending connection requests the user has sent.
 */
export const getPendingSent = async () => {
  return apiCall('/api/connections/pending/sent');
};

/**
 * Request a new connection with another student.
 */
export const sendConnectionRequest = async (receiverId) => {
  return apiCall('/api/connections', {
    method: 'POST',
    body: JSON.stringify({ receiver_id: receiverId })
  });
};

/**
 * Accept a pending connection by id.
 */
export const acceptConnection = async (connectionId) => {
  return apiCall(`/api/connections/${connectionId}`, {
    method: 'PUT',
    body: JSON.stringify({ status: 'accepted' })
  });
};

/**
 * Reject a pending connection by id.
 */
export const rejectConnection = async (connectionId) => {
  return apiCall(`/api/connections/${connectionId}`, {
    method: 'PUT',
    body: JSON.stringify({ status: 'rejected' })
  });
};

/**
 * Remove an existing connection.
 */
export const deleteConnection = async (connectionId) => {
  return apiCall(`/api/connections/${connectionId}`, {
    method: 'DELETE'
  });
};

/**
 * Fetch match suggestions calculated by the backend.
 */
export const getMatchSuggestions = async () => {
  return apiCall('/api/connections/matches/suggestions');
};
