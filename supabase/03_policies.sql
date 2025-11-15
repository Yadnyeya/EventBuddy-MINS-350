-- EventBuddy Row Level Security (RLS) Policies
-- Prototype 2 - Security Policies
-- Controls who can read/write data based on authentication and ownership

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PROFILES POLICIES
-- ============================================================================

-- Anyone can view profiles (for buddy matching and connections)
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can delete their own profile
CREATE POLICY "Users can delete own profile"
  ON profiles FOR DELETE
  USING (auth.uid() = id);

-- ============================================================================
-- INTERESTS POLICIES
-- ============================================================================

-- Everyone can view interests
CREATE POLICY "Interests are viewable by everyone"
  ON interests FOR SELECT
  USING (true);

-- Authenticated users can add interests (for future admin feature)
CREATE POLICY "Authenticated users can insert interests"
  ON interests FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ============================================================================
-- PROFILE_INTERESTS POLICIES
-- ============================================================================

-- Everyone can view profile interests (for matching)
CREATE POLICY "Profile interests are viewable by everyone"
  ON profile_interests FOR SELECT
  USING (true);

-- Users can manage their own interests
CREATE POLICY "Users can manage own profile interests"
  ON profile_interests FOR ALL
  USING (auth.uid() = profile_id);

-- ============================================================================
-- EVENTS POLICIES
-- ============================================================================

-- Published events are viewable by everyone
CREATE POLICY "Published events are viewable by everyone"
  ON events FOR SELECT
  USING (status = 'published' OR host_id = auth.uid());

-- Authenticated users can create events
CREATE POLICY "Authenticated users can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = host_id);

-- Event hosts can update their own events
CREATE POLICY "Hosts can update own events"
  ON events FOR UPDATE
  USING (auth.uid() = host_id);

-- Event hosts can delete their own events
CREATE POLICY "Hosts can delete own events"
  ON events FOR DELETE
  USING (auth.uid() = host_id);

-- ============================================================================
-- EVENT_SAVES POLICIES
-- ============================================================================

-- Users can view their own saved events
CREATE POLICY "Users can view own saved events"
  ON event_saves FOR SELECT
  USING (auth.uid() = user_id);

-- Users can save events
CREATE POLICY "Users can save events"
  ON event_saves FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can unsave events
CREATE POLICY "Users can unsave events"
  ON event_saves FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- EVENT_RATINGS POLICIES
-- ============================================================================

-- Ratings are viewable by everyone (for event quality display)
CREATE POLICY "Event ratings are viewable by everyone"
  ON event_ratings FOR SELECT
  USING (true);

-- Users can rate events they've attended
CREATE POLICY "Users can rate events"
  ON event_ratings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own ratings
CREATE POLICY "Users can update own ratings"
  ON event_ratings FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own ratings
CREATE POLICY "Users can delete own ratings"
  ON event_ratings FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- CONNECTIONS POLICIES
-- ============================================================================

-- Users can view connections they're part of
CREATE POLICY "Users can view own connections"
  ON connections FOR SELECT
  USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

-- Users can send connection requests
CREATE POLICY "Users can send connection requests"
  ON connections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = requester_id);

-- Users can update connections they're part of (accept/reject/unmatch)
CREATE POLICY "Users can update own connections"
  ON connections FOR UPDATE
  USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

-- Users can delete connections they're part of
CREATE POLICY "Users can delete own connections"
  ON connections FOR DELETE
  USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

-- ============================================================================
-- MESSAGES POLICIES
-- ============================================================================

-- Users can view messages sent to or from them
CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Users can send messages
CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

-- Users can update messages they received (mark as read)
CREATE POLICY "Users can update received messages"
  ON messages FOR UPDATE
  USING (auth.uid() = receiver_id);

-- Users can delete messages they sent
CREATE POLICY "Users can delete sent messages"
  ON messages FOR DELETE
  USING (auth.uid() = sender_id);

-- ============================================================================
-- BLOCKS POLICIES
-- ============================================================================

-- Users can view their own blocks
CREATE POLICY "Users can view own blocks"
  ON blocks FOR SELECT
  USING (auth.uid() = blocker_id);

-- Users can block other users
CREATE POLICY "Users can block others"
  ON blocks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = blocker_id);

-- Users can unblock (delete block)
CREATE POLICY "Users can unblock"
  ON blocks FOR DELETE
  USING (auth.uid() = blocker_id);

-- ============================================================================
-- REPORTS POLICIES
-- ============================================================================

-- Users can view reports they submitted
CREATE POLICY "Users can view own reports"
  ON reports FOR SELECT
  USING (auth.uid() = reporter_id);

-- Users can submit reports
CREATE POLICY "Users can submit reports"
  ON reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

-- Admins can view all reports (future feature - for now commented out)
-- CREATE POLICY "Admins can view all reports"
--   ON reports FOR SELECT
--   TO authenticated
--   USING (
--     EXISTS (
--       SELECT 1 FROM profiles
--       WHERE id = auth.uid() AND role = 'admin'
--     )
--   );

-- ============================================================================
-- ADDITIONAL SECURITY FUNCTIONS
-- ============================================================================

-- Function to check if user is blocked
CREATE OR REPLACE FUNCTION is_user_blocked(target_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM blocks
    WHERE (blocker_id = auth.uid() AND blocked_id = target_user_id)
       OR (blocker_id = target_user_id AND blocked_id = auth.uid())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if users have an active connection
CREATE OR REPLACE FUNCTION are_users_connected(user1_id UUID, user2_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM connections
    WHERE status = 'accepted'
      AND ((requester_id = user1_id AND receiver_id = user2_id)
        OR (requester_id = user2_id AND receiver_id = user1_id))
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
