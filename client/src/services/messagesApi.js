// Messages API Service - Lightweight wrapper around messaging endpoints

import { apiCall } from './supabase';

/**
 * Fetch recent conversations for the authenticated user.
 */
export const getConversations = async () => {
  return apiCall('/api/messages/conversations');
};

/**
 * Fetch messages with a specific user.
 */
export const getConversationWith = async (userId) => {
  return apiCall(`/api/messages/conversation/${userId}`);
};

/**
 * Send a message to another user (requires an existing connection).
 */
export const sendMessage = async ({ receiverId, content }) => {
  return apiCall('/api/messages', {
    method: 'POST',
    body: JSON.stringify({ receiver_id: receiverId, content })
  });
};

/**
 * Mark a message as read.
 */
export const markAsRead = async (messageId) => {
  return apiCall(`/api/messages/${messageId}/read`, {
    method: 'PUT'
  });
};
