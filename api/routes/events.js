// Events API Routes - Handles event CRUD operations
// Updated for Specification 2 schema

import express from 'express';
import { authenticateUser } from '../config/supabase.js';
import * as eventsController from '../controllers/eventsController.js';

const router = express.Router();

// ============================================================================
// PUBLIC ROUTES (No authentication required)
// ============================================================================

// GET /api/events - Get all events (with filters)
// Query params: event_type, startDate, endDate, search, limit, offset
router.get('/', eventsController.getAllEvents);

// GET /api/events/:id - Get event details by ID
router.get('/:id', eventsController.getEventById);

// ============================================================================
// PROTECTED ROUTES (Authentication required)
// ============================================================================

// POST /api/events - Create new event
router.post('/', authenticateUser, eventsController.createEvent);

// PUT /api/events/:id - Update event (host only)
router.put('/:id', authenticateUser, eventsController.updateEvent);

// DELETE /api/events/:id - Delete event (host only)
router.delete('/:id', authenticateUser, eventsController.deleteEvent);

// GET /api/events/my - Get my created events
router.get('/my/created', authenticateUser, eventsController.getMyEvents);

export default router;
