// Messages Controller - Business logic for messaging

// ============================================================================
// GET MY MESSAGES (PROTECTED)
// ============================================================================
export const getMyMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversation_with, limit = 50, offset = 0 } = req.query;

    let query = req.supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!sender_id (
          id,
          username,
          full_name,
          avatar_url
        ),
        receiver:profiles!receiver_id (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (conversation_with) {
      query = query.or(`and(sender_id.eq.${userId},receiver_id.eq.${conversation_with}),and(sender_id.eq.${conversation_with},receiver_id.eq.${userId})`);
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// ============================================================================
// GET CONVERSATIONS (PROTECTED)
// ============================================================================
export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all messages involving the user
    const { data: messages, error } = await req.supabase
      .from('messages')
      .select(`
        id,
        sender_id,
        receiver_id,
        content,
        is_read,
        created_at,
        sender:profiles!sender_id (
          id,
          username,
          full_name,
          avatar_url
        ),
        receiver:profiles!receiver_id (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Group messages by conversation partner
    const conversationsMap = new Map();

    messages.forEach(msg => {
      const partnerId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id;
      
      if (!conversationsMap.has(partnerId)) {
        conversationsMap.set(partnerId, {
          partner: msg.sender_id === userId ? msg.receiver : msg.sender,
          lastMessage: msg,
          unreadCount: 0
        });
      }

      // Count unread messages from partner
      if (msg.receiver_id === userId && !msg.is_read) {
        conversationsMap.get(partnerId).unreadCount++;
      }
    });

    const conversations = Array.from(conversationsMap.values())
      .sort((a, b) => new Date(b.lastMessage.created_at) - new Date(a.lastMessage.created_at));

    res.json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};

// ============================================================================
// GET CONVERSATION WITH USER (PROTECTED)
// ============================================================================
export const getConversationWith = async (req, res) => {
  try {
    const userId = req.user.id;
    const { userId: partnerId } = req.params;

    const { data, error } = await req.supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!sender_id (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${userId})`)
      .order('created_at', { ascending: true });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
};

// ============================================================================
// SEND MESSAGE (PROTECTED)
// ============================================================================
export const sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { receiver_id, content } = req.body;

    if (!receiver_id || !content) {
      return res.status(400).json({ error: 'receiver_id and content are required' });
    }

    if (userId === receiver_id) {
      return res.status(400).json({ error: 'Cannot send message to yourself' });
    }

    // Check if users are connected
    const { data: connection } = await req.supabase
      .from('connections')
      .select('id')
      .eq('status', 'accepted')
      .or(`and(requester_id.eq.${userId},receiver_id.eq.${receiver_id}),and(requester_id.eq.${receiver_id},receiver_id.eq.${userId})`)
      .single();

    if (!connection) {
      return res.status(403).json({ error: 'Can only message connected users' });
    }

    // Check if blocked
    const { data: blocked } = await req.supabase
      .from('blocks')
      .select('id')
      .or(`and(blocker_id.eq.${userId},blocked_id.eq.${receiver_id}),and(blocker_id.eq.${receiver_id},blocked_id.eq.${userId})`)
      .single();

    if (blocked) {
      return res.status(403).json({ error: 'Cannot message this user' });
    }

    const { data, error } = await req.supabase
      .from('messages')
      .insert([{
        sender_id: userId,
        receiver_id,
        content
      }])
      .select(`
        *,
        sender:profiles!sender_id (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// ============================================================================
// MARK AS READ (PROTECTED)
// ============================================================================
export const markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Only receiver can mark as read
    const { data, error } = await req.supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', id)
      .eq('receiver_id', userId)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Message not found' });

    res.json(data);
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
};

// ============================================================================
// DELETE MESSAGE (PROTECTED)
// ============================================================================
export const deleteMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Only sender can delete
    const { error } = await req.supabase
      .from('messages')
      .delete()
      .eq('id', id)
      .eq('sender_id', userId);

    if (error) throw error;

    res.status(204).send();
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
};

// ============================================================================
// GET UNREAD COUNT (PROTECTED)
// ============================================================================
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const { count, error } = await req.supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('receiver_id', userId)
      .eq('is_read', false);

    if (error) throw error;

    res.json({ unreadCount: count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Failed to get unread count' });
  }
};
