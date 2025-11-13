// Events API Service - Frontend wrapper for events endpoints

import { apiCall } from './supabase';

/**
 * Get all events with optional filters
 */
export const getAllEvents = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.event_type) params.append('event_type', filters.event_type);
  if (filters.limit) params.append('limit', filters.limit);
  if (filters.offset) params.append('offset', filters.offset);

  const query = params.toString();
  return apiCall(`/api/events${query ? `?${query}` : ''}`);
};

/**
 * Get event by ID
 */
export const getEventById = async (eventId) => {
  return apiCall(`/api/events/${eventId}`);
};

/**
 * Create new event
 */
export const createEvent = async (eventData) => {
  return apiCall('/api/events', {
    method: 'POST',
    body: JSON.stringify(eventData)
  });
};

/**
 * Update event
 */
export const updateEvent = async (eventId, eventData) => {
  return apiCall(`/api/events/${eventId}`, {
    method: 'PUT',
    body: JSON.stringify(eventData)
  });
};

/**
 * Delete event
 */
export const deleteEvent = async (eventId) => {
  return apiCall(`/api/events/${eventId}`, {
    method: 'DELETE'
  });
};

/**
 * Get my created events
 */
export const getMyEvents = async () => {
  return apiCall('/api/events/my/created');
};
