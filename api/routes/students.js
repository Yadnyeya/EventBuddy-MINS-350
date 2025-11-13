// Students Routes - Student profile and interest endpoints
// Maps HTTP routes to controller functions

import express from 'express';
import {
  getAllStudents,
  getStudentById,
  getMyProfile,
  upsertProfile,
  updateMyProfile,
  deleteMyProfile,
  getStudentInterests,
  addInterest,
  deleteInterest,
  searchByInterest
} from '../controllers/studentsController.js';
import { authenticateUser } from '../config/supabase.js';

const router = express.Router();

// Public routes
router.get('/', getAllStudents);
router.get('/search', searchByInterest);
router.get('/:id', getStudentById);
router.get('/:id/interests', getStudentInterests);

// Protected routes
router.get('/me/profile', authenticateUser, getMyProfile);
router.post('/me/profile', authenticateUser, upsertProfile);
router.put('/me/profile', authenticateUser, updateMyProfile);
router.delete('/me/profile', authenticateUser, deleteMyProfile);
router.post('/me/interests', authenticateUser, addInterest);
router.delete('/me/interests/:interest_id', authenticateUser, deleteInterest);

export default router;
