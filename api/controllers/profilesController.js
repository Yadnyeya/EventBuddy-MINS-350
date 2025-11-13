// Profiles Controller - Business logic for user profile operations

import { supabaseAdmin } from '../config/supabase.js';

// ============================================================================
// GET PROFILE BY ID (PUBLIC)
// ============================================================================
export const getProfileById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select(`
        *,
        interests:profile_interests (
          interest:interests (
            id,
            name,
            category
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Profile not found' });

    res.json(data);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// ============================================================================
// GET MY PROFILE (PROTECTED)
// ============================================================================
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await req.supabase
      .from('profiles')
      .select(`
        *,
        interests:profile_interests (
          interest:interests (
            id,
            name,
            category
          )
        )
      `)
      .eq('id', userId)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Profile not found' });

    res.json(data);
  } catch (error) {
    console.error('Get my profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// ============================================================================
// CREATE PROFILE (PROTECTED)
// ============================================================================
export const createProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const email = req.user.email;
    
    const profileData = {
      id: userId,
      email,
      ...req.body
    };

    const { data, error } = await req.supabase
      .from('profiles')
      .insert([profileData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Create profile error:', error);
    res.status(500).json({ error: 'Failed to create profile' });
  }
};

// ============================================================================
// UPDATE PROFILE (PROTECTED)
// ============================================================================
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

  // Don't allow updating id or email
  const updateData = { ...req.body };
  delete updateData.id;
  delete updateData.email;

    const { data, error } = await req.supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// ============================================================================
// DELETE PROFILE (PROTECTED)
// ============================================================================
export const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { error } = await req.supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) throw error;

    res.status(204).send();
  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({ error: 'Failed to delete profile' });
  }
};

// ============================================================================
// SEARCH PROFILES (PUBLIC)
// ============================================================================
export const searchProfiles = async (req, res) => {
  try {
    const {
      search,
      interests,
      personality,
      major,
      limit = 20,
      offset = 0
    } = req.query;

    let query = supabaseAdmin
      .from('profiles')
      .select(`
        *,
        interests:profile_interests (
          interest:interests (
            id,
            name,
            category
          )
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply filters
    if (search) {
      query = query.or(`username.ilike.%${search}%,full_name.ilike.%${search}%,bio.ilike.%${search}%`);
    }
    if (personality) query = query.eq('personality_type', personality);
    if (major) query = query.ilike('major', `%${major}%`);

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    // Filter by interests if provided
    let filteredData = data;
    if (interests) {
      const interestArray = interests.split(',');
      filteredData = data.filter(profile => {
        const profileInterests = profile.interests.map(pi => pi.interest.name);
        return interestArray.some(interest => profileInterests.includes(interest));
      });
    }

    res.json({
      profiles: filteredData,
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Search profiles error:', error);
    res.status(500).json({ error: 'Failed to search profiles' });
  }
};

// ============================================================================
// GET PROFILE INTERESTS (PUBLIC)
// ============================================================================
export const getProfileInterests = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('profile_interests')
      .select(`
        interest:interests (
          id,
          name,
          category
        )
      `)
      .eq('profile_id', id);

    if (error) throw error;

    res.json(data.map(pi => pi.interest));
  } catch (error) {
    console.error('Get interests error:', error);
    res.status(500).json({ error: 'Failed to fetch interests' });
  }
};

// ============================================================================
// UPDATE INTERESTS (PROTECTED)
// ============================================================================
export const updateInterests = async (req, res) => {
  try {
    const userId = req.user.id;
    const { interest_ids } = req.body;

    if (!Array.isArray(interest_ids)) {
      return res.status(400).json({ error: 'interest_ids must be an array' });
    }

    // Delete existing interests
    await req.supabase
      .from('profile_interests')
      .delete()
      .eq('profile_id', userId);

    // Insert new interests
    const inserts = interest_ids.map(interestId => ({
      profile_id: userId,
      interest_id: interestId
    }));

    const { data, error } = await req.supabase
      .from('profile_interests')
      .insert(inserts)
      .select(`
        interest:interests (
          id,
          name,
          category
        )
      `);

    if (error) throw error;

    res.json(data.map(pi => pi.interest));
  } catch (error) {
    console.error('Update interests error:', error);
    res.status(500).json({ error: 'Failed to update interests' });
  }
};

// ============================================================================
// BLOCK USER (PROTECTED)
// ============================================================================
export const blockUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: blockedId } = req.params;

    if (userId === blockedId) {
      return res.status(400).json({ error: 'Cannot block yourself' });
    }

    const { data, error } = await req.supabase
      .from('blocks')
      .insert([{
        blocker_id: userId,
        blocked_id: blockedId
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Block user error:', error);
    res.status(500).json({ error: 'Failed to block user' });
  }
};

// ============================================================================
// UNBLOCK USER (PROTECTED)
// ============================================================================
export const unblockUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: blockedId } = req.params;

    const { error } = await req.supabase
      .from('blocks')
      .delete()
      .eq('blocker_id', userId)
      .eq('blocked_id', blockedId);

    if (error) throw error;

    res.status(204).send();
  } catch (error) {
    console.error('Unblock user error:', error);
    res.status(500).json({ error: 'Failed to unblock user' });
  }
};

// ============================================================================
// REPORT USER (PROTECTED)
// ============================================================================
export const reportUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: reportedId } = req.params;
    const { reason, description } = req.body;

    if (userId === reportedId) {
      return res.status(400).json({ error: 'Cannot report yourself' });
    }

    if (!reason) {
      return res.status(400).json({ error: 'Reason is required' });
    }

    const { data, error } = await req.supabase
      .from('reports')
      .insert([{
        reporter_id: userId,
        reported_id: reportedId,
        report_type: 'user',
        reason,
        description
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Report user error:', error);
    res.status(500).json({ error: 'Failed to report user' });
  }
};
