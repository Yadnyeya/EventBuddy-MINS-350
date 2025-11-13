// Attend Controller - Event attendance and rating operations
// Handles check-ins, attendance tracking, and event ratings

import { supabaseAdmin } from '../config/supabase.js';

// ============================================================================
// CHECK IN TO EVENT (PROTECTED)
// ============================================================================
export const checkInToEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { event_id } = req.body;

    if (!event_id) {
      return res.status(400).json({ error: 'event_id is required' });
    }

    // Check if event exists
    const { data: event } = await req.supabase
      .from('events')
      .select('event_id, title')
      .eq('event_id', event_id)
      .single();

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if already checked in
    const { data: existing } = await req.supabase
      .from('attend')
      .select('attend_id')
      .eq('student_id', userId)
      .eq('event_id', event_id)
      .single();

    if (existing) {
      return res.status(400).json({ error: 'Already checked into this event' });
    }

    // Get current attendance count
    const { count } = await req.supabase
      .from('attend')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', event_id);

    // Create attendance record
    const attendData = {
      student_id: userId,
      event_id,
      timestamp_start: new Date().toISOString(),
      count_attendees: (count || 0) + 1
    };

    const { data, error } = await req.supabase
      .from('attend')
      .insert([attendData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Check in error:', error);
    res.status(500).json({ error: 'Failed to check in' });
  }
};

// ============================================================================
// CHECK OUT OF EVENT (PROTECTED)
// ============================================================================
export const checkOutOfEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { event_id } = req.body;

    if (!event_id) {
      return res.status(400).json({ error: 'event_id is required' });
    }

    const { data, error } = await req.supabase
      .from('attend')
      .update({ timestamp_end: new Date().toISOString() })
      .eq('student_id', userId)
      .eq('event_id', event_id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'No check-in record found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Check out error:', error);
    res.status(500).json({ error: 'Failed to check out' });
  }
};

// ============================================================================
// GET MY ATTENDANCE HISTORY (PROTECTED)
// ============================================================================
export const getMyAttendance = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await req.supabase
      .from('attend')
      .select(`
        *,
        event:events (
          event_id,
          title,
          description,
          location,
          date_and_time,
          event_type
        )
      `)
      .eq('student_id', userId)
      .order('timestamp_start', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ error: 'Failed to fetch attendance history' });
  }
};

// ============================================================================
// RATE EVENT / ADD SHARED EXPERIENCE (PROTECTED)
// ============================================================================
export const rateEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { attend_id } = req.params;
    const { rating, shared_experience, names_of_students } = req.body;

    // Validation
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if attendance record exists and belongs to user
    const { data: attendance } = await req.supabase
      .from('attend')
      .select('student_id')
      .eq('attend_id', attend_id)
      .single();

    if (!attendance) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    if (attendance.student_id !== userId) {
      return res.status(403).json({ error: 'Can only rate your own attendance' });
    }

    // Update rating and/or shared experience
    const updateData = {};
    if (rating) updateData.rating = rating;
    if (shared_experience) updateData.shared_experience = shared_experience;
    if (names_of_students) updateData.names_of_students = names_of_students;

    const { data, error } = await req.supabase
      .from('attend')
      .update(updateData)
      .eq('attend_id', attend_id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Rate event error:', error);
    res.status(500).json({ error: 'Failed to rate event' });
  }
};

// ============================================================================
// GET EVENT ATTENDANCE (PUBLIC for event host)
// ============================================================================
export const getEventAttendance = async (req, res) => {
  try {
    const { event_id } = req.params;
    const userId = req.user?.id;

    // Check if event exists and if user is the host
    const { data: event } = await supabaseAdmin
      .from('events')
      .select('student_id')
      .eq('event_id', event_id)
      .single();

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Only host can see attendance details
    if (userId && event.student_id === userId) {
      // Full details for host
      const { data, error } = await supabaseAdmin
        .from('attend')
        .select(`
          *,
          student:student!student_id (
            student_id,
            email,
            year
          )
        `)
        .eq('event_id', event_id)
        .order('timestamp_start', { ascending: false });

      if (error) throw error;

      // Calculate stats
      const totalAttendees = data.length;
      const avgRating = data.filter(a => a.rating).length > 0
        ? data.filter(a => a.rating).reduce((sum, a) => sum + (a.rating || 0), 0) / 
          data.filter(a => a.rating).length
        : 0;

      res.json({
        attendance: data,
        stats: {
          total: totalAttendees,
          average_rating: avgRating.toFixed(1),
          rated_count: data.filter(a => a.rating).length
        }
      });
    } else {
      // Just count for non-hosts
      const { count, error } = await supabaseAdmin
        .from('attend')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', event_id);

      if (error) throw error;

      res.json({ count });
    }
  } catch (error) {
    console.error('Get event attendance error:', error);
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
};

// ============================================================================
// GET EVENT RATINGS (PUBLIC)
// ============================================================================
export const getEventRatings = async (req, res) => {
  try {
    const { event_id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('attend')
      .select(`
        attend_id,
        rating,
        shared_experience,
        timestamp_start,
        student:student!student_id (
          student_id,
          email
        )
      `)
      .eq('event_id', event_id)
      .not('rating', 'is', null)
      .order('timestamp_start', { ascending: false });

    if (error) throw error;

    // Calculate average
    const avgRating = data.length > 0
      ? data.reduce((sum, a) => sum + a.rating, 0) / data.length
      : 0;

    res.json({
      ratings: data,
      average: avgRating.toFixed(1),
      count: data.length
    });
  } catch (error) {
    console.error('Get ratings error:', error);
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
};
