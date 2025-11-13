// Messages API Routes - Handles messaging between connected users
// Maps to User Story: US09

import express from 'express';
import { requireAuth } from '../config/supabase.js';
import * as messagesController from '../controllers/messagesController.js';

const router = express.Router();

// All message routes require authentication
router.use(requireAuth);

// ============================================================================
// MESSAGING
// ============================================================================

// GET /api/messages - Get user's messages (inbox + sent)
// Query params: conversation_with, limit, offset
router.get('/', messagesController.getMyMessages);

// GET /api/messages/conversations - Get list of conversations
router.get('/conversations', messagesController.getConversations);

// GET /api/messages/conversation/:userId - Get messages with specific user
router.get('/conversation/:userId', messagesController.getConversationWith);

// POST /api/messages - Send a message
// Body: { receiver_id, content }
router.post('/', messagesController.sendMessage);

// PUT /api/messages/:id/read - Mark message as read
router.put('/:id/read', messagesController.markAsRead);

// DELETE /api/messages/:id - Delete a message
router.delete('/:id', messagesController.deleteMessage);

// GET /api/messages/unread/count - Get count of unread messages
router.get('/unread/count', messagesController.getUnreadCount);

export default router;
