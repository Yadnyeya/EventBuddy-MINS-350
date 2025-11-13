// Students API Service - Frontend wrapper for students endpoints

import { apiCall } from './supabase';

/**
 * Get all verified students
 */
export const getAllStudents = async (limit = 20, offset = 0) => {
  const params = new URLSearchParams({ limit, offset });
  return apiCall(`/api/students?${params.toString()}`);
};

/**
 * Get student by ID
 */
export const getStudentById = async (studentId) => {
  return apiCall(`/api/students/${studentId}`);
};

/**
 * Search students by interest
 */
export const searchByInterest = async (interest, limit = 20) => {
  const params = new URLSearchParams({ interest, limit });
  return apiCall(`/api/students/search?${params.toString()}`);
};

/**
 * Get current user's profile
 */
export const getMyProfile = async () => {
  return apiCall('/api/students/me/profile');
};

/**
 * Create or update my profile (upsert)
 */
export const upsertProfile = async (profileData) => {
  return apiCall('/api/students/me/profile', {
    method: 'POST',
    body: JSON.stringify(profileData)
  });
};

/**
 * Update my profile
 */
export const updateMyProfile = async (profileData) => {
  return apiCall('/api/students/me/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  });
};

/**
 * Delete my profile
 */
export const deleteMyProfile = async () => {
  return apiCall('/api/students/me/profile', {
    method: 'DELETE'
  });
};

/**
 * Add an interest to my profile
 */
export const addInterest = async (interestName) => {
  return apiCall('/api/students/me/interests', {
    method: 'POST',
    body: JSON.stringify({ interest_name: interestName })
  });
};

/**
 * Remove an interest from my profile
 */
export const deleteInterest = async (interestId) => {
  return apiCall(`/api/students/me/interests/${interestId}`, {
    method: 'DELETE'
  });
};

/**
 * Get student's interests
 */
export const getStudentInterests = async (studentId) => {
  return apiCall(`/api/students/${studentId}/interests`);
};
