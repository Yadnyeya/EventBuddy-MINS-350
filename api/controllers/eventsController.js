// Events Controller - Business logic for event operations
// Implements CRUD operations and event-specific features
// Updated for Specification 2 schema (student, interest, events, attend tables)

import { supabaseAdmin } from '../config/supabase.js';

// ============================================================================
// GET ALL EVENTS (PUBLIC)
// ============================================================================
export const getAllEvents = async (req, res) => {
  try {
    const {
      event_type,
      startDate,
      endDate,
      search,
      limit = 20,
      offset = 0
    } = req.query;

    let query = supabaseAdmin
      .from('events')
      .select(`
        *,
        host:student!student_id (
          student_id,
          email,
          year
        )
      `)
      .order('date_and_time', { ascending: true });

    // Apply filters
    if (event_type) query = query.eq('event_type', event_type);
    if (startDate) query = query.gte('date_and_time', startDate);
    if (endDate) query = query.lte('date_and_time', endDate);
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    res.json({
      events: data,
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

// ============================================================================
// GET EVENT BY ID (PUBLIC)
// ============================================================================
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('events')
      .select(`
        *,
        host:student!student_id (
          student_id,
          email,
          year
        )
      `)
      .eq('event_id', id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Event not found' });

    res.json(data);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
};

// ============================================================================
// CREATE EVENT (PROTECTED)
// ============================================================================
export const createEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, location, date_and_time, event_type } = req.body;

    // Validation
    if (!title || !date_and_time || !event_type) {
      return res.status(400).json({ 
        error: 'Missing required fields: title, date_and_time, event_type' 
      });
    }

    if (!['Event', 'Club Meeting', 'Fair'].includes(event_type)) {
      return res.status(400).json({ 
        error: 'Invalid event_type. Must be: Event, Club Meeting, or Fair' 
      });
    }

    const eventData = {
      title,
      description,
      location,
      date_and_time,
      event_type,
      student_id: userId,
      attendance: 0
    };

    const { data, error } = await req.supabase
      .from('events')
      .insert([eventData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
};

// ============================================================================
// UPDATE EVENT (PROTECTED - HOST ONLY)
// ============================================================================
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if user is the host
    const { data: event } = await req.supabase
      .from('events')
      .select('student_id')
      .eq('event_id', id)
      .single();

    if (!event) return res.status(404).json({ error: 'Event not found' });
    if (event.student_id !== userId) {
      return res.status(403).json({ error: 'Only event host can update this event' });
    }

    const { title, description, location, date_and_time, event_type } = req.body;
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (location) updateData.location = location;
    if (date_and_time) updateData.date_and_time = date_and_time;
    if (event_type) {
      if (!['Event', 'Club Meeting', 'Fair'].includes(event_type)) {
        return res.status(400).json({ error: 'Invalid event_type' });
      }
      updateData.event_type = event_type;
    }

    const { data, error } = await req.supabase
      .from('events')
      .update(updateData)
      .eq('event_id', id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
};

// ============================================================================
// DELETE EVENT (PROTECTED - HOST ONLY)
// ============================================================================
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { error } = await req.supabase
      .from('events')
      .delete()
      .eq('event_id', id)
      .eq('student_id', userId);

    if (error) throw error;

    res.status(204).send();
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
};

// ============================================================================
// GET MY CREATED EVENTS (PROTECTED)
// ============================================================================
export const getMyEvents = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await req.supabase
      .from('events')
      .select('*')
      .eq('student_id', userId)
      .order('date_and_time', { ascending: true });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Get my events error:', error);
    res.status(500).json({ error: 'Failed to fetch your events' });
  }
};
