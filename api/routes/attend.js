// Attend Routes - Event attendance and rating endpoints
// Maps HTTP routes to controller functions

import express from 'express';
import {
  checkInToEvent,
  checkOutOfEvent,
  getMyAttendance,
  rateEvent,
  getEventAttendance,
  getEventRatings
} from '../controllers/attendController.js';
import { authenticateUser } from '../config/supabase.js';

const router = express.Router();

// All attendance routes require authentication
router.post('/checkin', authenticateUser, checkInToEvent);
router.post('/checkout', authenticateUser, checkOutOfEvent);
router.get('/my', authenticateUser, getMyAttendance);
router.put('/:attend_id/rate', authenticateUser, rateEvent);

// Event attendance (public read, but details only for host)
router.get('/event/:event_id', getEventAttendance);
router.get('/event/:event_id/ratings', getEventRatings);

export default router;
