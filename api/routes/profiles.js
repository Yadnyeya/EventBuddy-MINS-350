// Profiles API Routes - Handles user profile operations
// Maps to User Stories: US01, US02, US03

import express from 'express';
import { requireAuth } from '../config/supabase.js';
import * as profilesController from '../controllers/profilesController.js';

const router = express.Router();

// ============================================================================
// PUBLIC ROUTES
// ============================================================================

// GET /api/profiles/:id - Get profile by ID
router.get('/:id', profilesController.getProfileById);

// GET /api/profiles - Search/browse profiles
// Query params: search, interests, personality, major, limit, offset
router.get('/', profilesController.searchProfiles);

// ============================================================================
// PROTECTED ROUTES
// ============================================================================

// GET /api/profiles/me/profile - Get current user's profile
router.get('/me/profile', requireAuth, profilesController.getMyProfile);

// POST /api/profiles - Create profile (first-time setup)
router.post('/', requireAuth, profilesController.createProfile);

// PUT /api/profiles/me - Update own profile
router.put('/me', requireAuth, profilesController.updateProfile);

// DELETE /api/profiles/me - Delete own profile
router.delete('/me', requireAuth, profilesController.deleteProfile);

// GET /api/profiles/:id/interests - Get user's interests
router.get('/:id/interests', profilesController.getProfileInterests);

// PUT /api/profiles/me/interests - Update own interests
router.put('/me/interests', requireAuth, profilesController.updateInterests);

// POST /api/profiles/:id/block - Block a user
router.post('/:id/block', requireAuth, profilesController.blockUser);

// DELETE /api/profiles/:id/block - Unblock a user
router.delete('/:id/block', requireAuth, profilesController.unblockUser);

// POST /api/profiles/:id/report - Report a user
router.post('/:id/report', requireAuth, profilesController.reportUser);

export default router;
