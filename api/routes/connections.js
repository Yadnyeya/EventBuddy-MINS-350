// Connections API Routes - Handles buddy matching and connections
// Maps to User Stories: US07, US08

import express from 'express';
import { requireAuth } from '../config/supabase.js';
import * as connectionsController from '../controllers/connectionsController.js';

const router = express.Router();

// All connection routes require authentication
router.use(requireAuth);

// ============================================================================
// CONNECTION MANAGEMENT
// ============================================================================

// GET /api/connections - Get user's connections (all statuses)
// Query params: status (pending, accepted, rejected)
router.get('/', connectionsController.getMyConnections);

// POST /api/connections - Send connection request
// Body: { receiver_id }
router.post('/', connectionsController.sendConnectionRequest);

// PUT /api/connections/:id - Update connection (accept/reject)
// Body: { status: 'accepted' | 'rejected' }
router.put('/:id', connectionsController.updateConnection);

// DELETE /api/connections/:id - Delete connection (unmatch)
router.delete('/:id', connectionsController.deleteConnection);

// GET /api/connections/pending/received - Get pending requests received
router.get('/pending/received', connectionsController.getPendingReceived);

// GET /api/connections/pending/sent - Get pending requests sent
router.get('/pending/sent', connectionsController.getPendingSent);

// ============================================================================
// MATCHING ALGORITHM
// ============================================================================

// GET /api/connections/matches/suggestions - Get buddy match suggestions
// Smart matching based on interests, personality, events
router.get('/matches/suggestions', connectionsController.getMatchSuggestions);

export default router;
