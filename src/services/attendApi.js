// Attendance API Service - Frontend wrapper for attendance endpoints

import { apiCall } from './supabase';

/**
 * Check in to an event
 */
export const checkInToEvent = async (eventId, namesOfStudents = []) => {
  return apiCall('/api/attend/checkin', {
    method: 'POST',
    body: JSON.stringify({
      event_id: eventId,
      names_of_students: namesOfStudents
    })
  });
};

/**
 * Check out from an event
 */
export const checkOutOfEvent = async (attendId) => {
  return apiCall('/api/attend/checkout', {
    method: 'POST',
    body: JSON.stringify({ attend_id: attendId })
  });
};

/**
 * Get my attendance history
 */
export const getMyAttendance = async () => {
  return apiCall('/api/attend/my');
};

/**
 * Rate an attended event
 */
export const rateEvent = async (attendId, rating, sharedExperience = '') => {
  return apiCall(`/api/attend/${attendId}/rate`, {
    method: 'PUT',
    body: JSON.stringify({
      rating,
      shared_experience: sharedExperience
    })
  });
};

/**
 * Get attendance details for an event
 */
export const getEventAttendance = async (eventId) => {
  return apiCall(`/api/attend/event/${eventId}`);
};

/**
 * Get ratings for an event (public)
 */
export const getEventRatings = async (eventId) => {
  return apiCall(`/api/attend/event/${eventId}/ratings`);
};
