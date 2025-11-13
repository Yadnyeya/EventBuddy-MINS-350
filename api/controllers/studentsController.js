// Students Controller - Student profile and interest operations
// Handles student profiles and interests (renamed from profilesController)

import { supabaseAdmin } from '../config/supabase.js';

// ============================================================================
// GET ALL STUDENTS (PUBLIC - only verified)
// ============================================================================
export const getAllStudents = async (req, res) => {
  try {
    const { year, search, limit = 20, offset = 0 } = req.query;

    let query = supabaseAdmin
      .from('student')
      .select('*')
      .eq('is_verified', true)
      .order('email', { ascending: true });

    // Apply filters
    if (year) query = query.eq('year', year);
    if (search) {
      query = query.ilike('email', `%${search}%`);
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    res.json({
      students: data,
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

// ============================================================================
// GET STUDENT BY ID (PUBLIC if verified)
// ============================================================================
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('student')
      .select(`
        *,
        interests:interest (
          interest_id,
          interest_name
        )
      `)
      .eq('student_id', id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Student not found' });

    // If not verified, only show to self
    if (!data.is_verified && req.user?.id !== id) {
      return res.status(403).json({ error: 'Profile not public' });
    }

    res.json(data);
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
};

// ============================================================================
// GET MY PROFILE (PROTECTED)
// ============================================================================
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await req.supabase
      .from('student')
      .select(`
        *,
        interests:interest (
          interest_id,
          interest_name
        )
      `)
      .eq('student_id', userId)
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
// CREATE/UPDATE STUDENT PROFILE (PROTECTED)
// ============================================================================
export const upsertProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { email, year, profile_id } = req.body;

    // Validation
    if (year && !['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'].includes(year)) {
      return res.status(400).json({ 
        error: 'Invalid year. Must be: Freshman, Sophomore, Junior, Senior, or Graduate' 
      });
    }

    const profileData = {
      student_id: userId,
      email: email || req.user.email,
      year: year || null,
      profile_id: profile_id || null,
      is_verified: false // Email verification would be handled separately
    };

    const { data, error } = await req.supabase
      .from('student')
      .upsert([profileData], { onConflict: 'student_id' })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Upsert profile error:', error);
    res.status(500).json({ error: 'Failed to create/update profile' });
  }
};

// ============================================================================
// UPDATE MY PROFILE (PROTECTED)
// ============================================================================
export const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { email, year, profile_id } = req.body;

    const updateData = {};
    if (email) updateData.email = email;
    if (year) {
      if (!['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'].includes(year)) {
        return res.status(400).json({ error: 'Invalid year' });
      }
      updateData.year = year;
    }
    if (profile_id !== undefined) updateData.profile_id = profile_id;

    const { data, error } = await req.supabase
      .from('student')
      .update(updateData)
      .eq('student_id', userId)
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
// DELETE MY PROFILE (PROTECTED)
// ============================================================================
export const deleteMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { error } = await req.supabase
      .from('student')
      .delete()
      .eq('student_id', userId);

    if (error) throw error;

    res.status(204).send();
  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({ error: 'Failed to delete profile' });
  }
};

// ============================================================================
// GET STUDENT INTERESTS (PUBLIC if verified)
// ============================================================================
export const getStudentInterests = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('interest')
      .select('*')
      .eq('student_id', id);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Get interests error:', error);
    res.status(500).json({ error: 'Failed to fetch interests' });
  }
};

// ============================================================================
// ADD INTEREST (PROTECTED)
// ============================================================================
export const addInterest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { interest_name } = req.body;

    if (!interest_name || interest_name.trim().length === 0) {
      return res.status(400).json({ error: 'interest_name is required' });
    }

    // Check if already exists
    const { data: existing } = await req.supabase
      .from('interest')
      .select('interest_id')
      .eq('student_id', userId)
      .eq('interest_name', interest_name.trim())
      .single();

    if (existing) {
      return res.status(400).json({ error: 'Interest already added' });
    }

    const { data, error } = await req.supabase
      .from('interest')
      .insert([{
        student_id: userId,
        interest_name: interest_name.trim()
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Add interest error:', error);
    res.status(500).json({ error: 'Failed to add interest' });
  }
};

// ============================================================================
// DELETE INTEREST (PROTECTED)
// ============================================================================
export const deleteInterest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { interest_id } = req.params;

    const { error } = await req.supabase
      .from('interest')
      .delete()
      .eq('interest_id', interest_id)
      .eq('student_id', userId);

    if (error) throw error;

    res.status(204).send();
  } catch (error) {
    console.error('Delete interest error:', error);
    res.status(500).json({ error: 'Failed to delete interest' });
  }
};

// ============================================================================
// SEARCH STUDENTS BY INTEREST (PUBLIC)
// ============================================================================
export const searchByInterest = async (req, res) => {
  try {
    const interest_name = req.query.interest_name || req.query.interest;
    const limit = parseInt(req.query.limit) || 20;

    if (!interest_name) {
      return res.status(400).json({ error: 'interest or interest_name query param required' });
    }

    // Find students with matching interest
    const { data, error } = await supabaseAdmin
      .from('interest')
      .select(`
        student_id,
        interest_name,
        student:student!student_id (
          student_id,
          email,
          year,
          is_verified
        )
      `)
      .ilike('interest_name', `%${interest_name}%`)
      .limit(limit);

    if (error) throw error;

    // Filter only verified students
    const verified = data.filter(item => item.student?.is_verified);

    res.json(verified);
  } catch (error) {
    console.error('Search by interest error:', error);
    res.status(500).json({ error: 'Failed to search students' });
  }
};
