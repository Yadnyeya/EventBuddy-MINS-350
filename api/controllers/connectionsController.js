// Connections Controller - Business logic for buddy matching

import { supabaseAdmin } from '../config/supabase.js';

// ============================================================================
// GET MY CONNECTIONS (PROTECTED)
// ============================================================================
export const getMyConnections = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    let query = req.supabase
      .from('connections')
      .select(`
        *,
        requester:profiles!requester_id (
          id,
          username,
          full_name,
          avatar_url,
          personality_type
        ),
        receiver:profiles!receiver_id (
          id,
          username,
          full_name,
          avatar_url,
          personality_type
        )
      `)
      .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);

    const { data, error } = await query;

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Get connections error:', error);
    res.status(500).json({ error: 'Failed to fetch connections' });
  }
};

// ============================================================================
// SEND CONNECTION REQUEST (PROTECTED)
// ============================================================================
export const sendConnectionRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { receiver_id } = req.body;

    if (!receiver_id) {
      return res.status(400).json({ error: 'receiver_id is required' });
    }

    if (userId === receiver_id) {
      return res.status(400).json({ error: 'Cannot connect with yourself' });
    }

    // Check for existing connection
    const { data: existing } = await req.supabase
      .from('connections')
      .select('id')
      .or(`and(requester_id.eq.${userId},receiver_id.eq.${receiver_id}),and(requester_id.eq.${receiver_id},receiver_id.eq.${userId})`)
      .single();

    if (existing) {
      return res.status(400).json({ error: 'Connection already exists' });
    }

    // Check if blocked
    const { data: blocked } = await req.supabase
      .from('blocks')
      .select('id')
      .or(`and(blocker_id.eq.${userId},blocked_id.eq.${receiver_id}),and(blocker_id.eq.${receiver_id},blocked_id.eq.${userId})`)
      .single();

    if (blocked) {
      return res.status(403).json({ error: 'Cannot connect with this user' });
    }

    const { data, error } = await req.supabase
      .from('connections')
      .insert([{
        requester_id: userId,
        receiver_id: receiver_id,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Send connection error:', error);
    res.status(500).json({ error: 'Failed to send connection request' });
  }
};

// ============================================================================
// UPDATE CONNECTION (ACCEPT/REJECT) (PROTECTED)
// ============================================================================
export const updateConnection = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Use accepted or rejected' });
    }

    // Check if user is the receiver
    const { data: connection } = await req.supabase
      .from('connections')
      .select('receiver_id')
      .eq('id', id)
      .single();

    if (!connection) {
      return res.status(404).json({ error: 'Connection not found' });
    }

    if (connection.receiver_id !== userId) {
      return res.status(403).json({ error: 'Only receiver can accept/reject connection' });
    }

    const { data, error } = await req.supabase
      .from('connections')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Update connection error:', error);
    res.status(500).json({ error: 'Failed to update connection' });
  }
};

// ============================================================================
// DELETE CONNECTION (UNMATCH) (PROTECTED)
// ============================================================================
export const deleteConnection = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const { error } = await req.supabase
      .from('connections')
      .delete()
      .eq('id', id)
      .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`);

    if (error) throw error;

    res.status(204).send();
  } catch (error) {
    console.error('Delete connection error:', error);
    res.status(500).json({ error: 'Failed to delete connection' });
  }
};

// ============================================================================
// GET PENDING RECEIVED (PROTECTED)
// ============================================================================
export const getPendingReceived = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await req.supabase
      .from('connections')
      .select(`
        *,
        requester:profiles!requester_id (
          id,
          username,
          full_name,
          avatar_url,
          bio,
          personality_type,
          interests:profile_interests (
            interest:interests (
              id,
              name,
              category
            )
          )
        )
      `)
      .eq('receiver_id', userId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Get pending received error:', error);
    res.status(500).json({ error: 'Failed to fetch pending requests' });
  }
};

// ============================================================================
// GET PENDING SENT (PROTECTED)
// ============================================================================
export const getPendingSent = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await req.supabase
      .from('connections')
      .select(`
        *,
        receiver:profiles!receiver_id (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('requester_id', userId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Get pending sent error:', error);
    res.status(500).json({ error: 'Failed to fetch sent requests' });
  }
};

// ============================================================================
// GET MATCH SUGGESTIONS (PROTECTED)
// ============================================================================
export const getMatchSuggestions = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get current user's profile with interests
    const { data: currentUser } = await req.supabase
      .from('profiles')
      .select(`
        personality_type,
        major,
        interests:profile_interests (
          interest_id
        )
      `)
      .eq('id', userId)
      .single();

    if (!currentUser) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const userInterestIds = currentUser.interests.map(pi => pi.interest_id);

    // Get all profiles except current user, blocked users, and existing connections
    const { data: profiles, error } = await supabaseAdmin
      .from('profiles')
      .select(`
        id,
        username,
        full_name,
        avatar_url,
        bio,
        personality_type,
        major,
        interests:profile_interests (
          interest_id,
          interest:interests (
            id,
            name,
            category
          )
        )
      `)
      .neq('id', userId);

    if (error) throw error;

    // Get blocked users
    const { data: blocks } = await req.supabase
      .from('blocks')
      .select('blocked_id, blocker_id')
      .or(`blocker_id.eq.${userId},blocked_id.eq.${userId}`);

    const blockedIds = new Set([
      ...blocks.map(b => b.blocked_id),
      ...blocks.map(b => b.blocker_id)
    ]);

    // Get existing connections
    const { data: connections } = await req.supabase
      .from('connections')
      .select('requester_id, receiver_id')
      .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`);

    const connectedIds = new Set([
      ...connections.map(c => c.requester_id),
      ...connections.map(c => c.receiver_id)
    ]);

    // Calculate match scores
    const matches = profiles
      .filter(profile => !blockedIds.has(profile.id) && !connectedIds.has(profile.id))
      .map(profile => {
        let score = 0;
        
        // Interest matching (up to 50 points)
        const profileInterestIds = profile.interests.map(pi => pi.interest_id);
        const commonInterests = userInterestIds.filter(id => profileInterestIds.includes(id));
        score += Math.min(commonInterests.length * 10, 50);

        // Personality type match (30 points)
        // Introverts match well with other introverts, extroverts with extroverts
        if (currentUser.personality_type && profile.personality_type) {
          if (currentUser.personality_type === profile.personality_type) {
            score += 30;
          } else if (
            (currentUser.personality_type === 'ambivert' || profile.personality_type === 'ambivert')
          ) {
            score += 15; // Ambiverts are flexible
          }
        }

        // Major match (20 points)
        if (currentUser.major && profile.major && currentUser.major === profile.major) {
          score += 20;
        }

        return {
          ...profile,
          matchScore: score,
          commonInterests: profile.interests.filter(pi => 
            userInterestIds.includes(pi.interest_id)
          ).map(pi => pi.interest)
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10); // Top 10 matches

    res.json(matches);
  } catch (error) {
    console.error('Get match suggestions error:', error);
    res.status(500).json({ error: 'Failed to get match suggestions' });
  }
};
