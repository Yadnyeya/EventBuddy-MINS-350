-- EventBuddy Row Level Security Policies
-- Run after 00_spec_schema.sql and 00_spec_seed.sql

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================
ALTER TABLE student ENABLE ROW LEVEL SECURITY;
ALTER TABLE interest ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE attend ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STUDENT TABLE POLICIES
-- ============================================================================

-- Anyone can view verified students
CREATE POLICY "Public students are viewable by everyone"
  ON student FOR SELECT
  USING (is_verified = TRUE);

-- Students can view their own profile even if not verified
CREATE POLICY "Students can view own profile"
  ON student FOR SELECT
  USING (auth.uid() = student_id);

-- Students can update their own profile
CREATE POLICY "Students can update own profile"
  ON student FOR UPDATE
  USING (auth.uid() = student_id);

-- Students can insert their own profile (during signup)
CREATE POLICY "Students can insert own profile"
  ON student FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- ============================================================================
-- INTEREST TABLE POLICIES
-- ============================================================================

-- Anyone can view all interests
CREATE POLICY "Interests are viewable by everyone"
  ON interest FOR SELECT
  USING (TRUE);

-- Students can insert their own interests
CREATE POLICY "Students can insert own interests"
  ON interest FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- Students can update their own interests
CREATE POLICY "Students can update own interests"
  ON interest FOR UPDATE
  USING (auth.uid() = student_id);

-- Students can delete their own interests
CREATE POLICY "Students can delete own interests"
  ON interest FOR DELETE
  USING (auth.uid() = student_id);

-- ============================================================================
-- EVENTS TABLE POLICIES
-- ============================================================================

-- Anyone can view published events
CREATE POLICY "Events are viewable by everyone"
  ON events FOR SELECT
  USING (TRUE);

-- Authenticated users can create events
CREATE POLICY "Authenticated users can create events"
  ON events FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- Event creators can update their own events
CREATE POLICY "Event creators can update own events"
  ON events FOR UPDATE
  USING (auth.uid() = student_id);

-- Event creators can delete their own events
CREATE POLICY "Event creators can delete own events"
  ON events FOR DELETE
  USING (auth.uid() = student_id);

-- ============================================================================
-- ATTEND TABLE POLICIES
-- ============================================================================

-- Students can view their own attendance records
CREATE POLICY "Students can view own attendance"
  ON attend FOR SELECT
  USING (auth.uid() = student_id);

-- Event hosts can view attendance for their events
CREATE POLICY "Event hosts can view event attendance"
  ON attend FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.event_id = attend.event_id
      AND events.student_id = auth.uid()
    )
  );

-- Students can insert their own attendance
CREATE POLICY "Students can insert own attendance"
  ON attend FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- Students can update their own attendance records
CREATE POLICY "Students can update own attendance"
  ON attend FOR UPDATE
  USING (auth.uid() = student_id);

-- Students can delete their own attendance records
CREATE POLICY "Students can delete own attendance"
  ON attend FOR DELETE
  USING (auth.uid() = student_id);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to check if a student is verified
CREATE OR REPLACE FUNCTION is_student_verified(check_student_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM student
    WHERE student_id = check_student_id
    AND is_verified = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get event attendance count
CREATE OR REPLACE FUNCTION get_event_attendance(check_event_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*) FROM attend
    WHERE event_id = check_event_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update event attendance count (trigger)
CREATE OR REPLACE FUNCTION update_event_attendance()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE events
    SET attendance = attendance + 1
    WHERE event_id = NEW.event_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE events
    SET attendance = attendance - 1
    WHERE event_id = OLD.event_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update event attendance
CREATE TRIGGER update_event_attendance_trigger
  AFTER INSERT OR DELETE ON attend
  FOR EACH ROW
  EXECUTE FUNCTION update_event_attendance();

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant usage on schema to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant access to tables for authenticated users
GRANT ALL ON student TO authenticated;
GRANT ALL ON interest TO authenticated;
GRANT ALL ON events TO authenticated;
GRANT ALL ON attend TO authenticated;

-- Grant access to sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON POLICY "Public students are viewable by everyone" ON student IS 
  'Allow anyone to view verified student profiles';

COMMENT ON POLICY "Events are viewable by everyone" ON events IS 
  'All events are publicly viewable for discovery';

COMMENT ON FUNCTION update_event_attendance() IS 
  'Automatically updates event attendance count when students check in/out';
