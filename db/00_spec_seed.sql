-- EventBuddy Seed Data
-- Sample data for testing
-- Run after 00_spec_schema.sql

-- ============================================================================
-- SAMPLE STUDENTS
-- ============================================================================
INSERT INTO student (student_id, email, is_verified, year) VALUES
  ('11111111-1111-1111-1111-111111111111', 'john.doe@university.edu', TRUE, 'Junior'),
  ('22222222-2222-2222-2222-222222222222', 'jane.smith@university.edu', TRUE, 'Sophomore'),
  ('33333333-3333-3333-3333-333333333333', 'mike.johnson@university.edu', TRUE, 'Senior'),
  ('44444444-4444-4444-4444-444444444444', 'sarah.williams@university.edu', FALSE, 'Freshman');

-- ============================================================================
-- SAMPLE INTERESTS
-- ============================================================================
INSERT INTO interest (student_id, interest_name) VALUES
  -- John's interests
  ('11111111-1111-1111-1111-111111111111', 'Basketball'),
  ('11111111-1111-1111-1111-111111111111', 'Coding'),
  ('11111111-1111-1111-1111-111111111111', 'Music'),
  
  -- Jane's interests
  ('22222222-2222-2222-2222-222222222222', 'Photography'),
  ('22222222-2222-2222-2222-222222222222', 'Music'),
  ('22222222-2222-2222-2222-222222222222', 'Art'),
  
  -- Mike's interests
  ('33333333-3333-3333-3333-333333333333', 'Basketball'),
  ('33333333-3333-3333-3333-333333333333', 'Gaming'),
  ('33333333-3333-3333-3333-333333333333', 'Coding'),
  
  -- Sarah's interests
  ('44444444-4444-4444-4444-444444444444', 'Art'),
  ('44444444-4444-4444-4444-444444444444', 'Reading'),
  ('44444444-4444-4444-4444-444444444444', 'Photography');

-- ============================================================================
-- SAMPLE EVENTS
-- ============================================================================
INSERT INTO events (event_id, student_id, title, description, location, date_and_time, event_type, attendance) VALUES
  (
    '55555555-5555-5555-5555-555555555555',
    '11111111-1111-1111-1111-111111111111',
    'Study Group - Computer Science',
    'Weekly study session for CS majors. Bring your laptops and questions!',
    'Library Room 204',
    NOW() + INTERVAL '2 days',
    'Club Meeting',
    0
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    '22222222-2222-2222-2222-222222222222',
    'Photography Walk',
    'Join us for a photography walk around campus. All skill levels welcome!',
    'Campus Quad',
    NOW() + INTERVAL '3 days',
    'Event',
    0
  ),
  (
    '77777777-7777-7777-7777-777777777777',
    '33333333-3333-3333-3333-333333333333',
    'Campus Activities Fair',
    'Discover clubs and organizations. Free food and giveaways!',
    'Student Union Hall',
    NOW() + INTERVAL '5 days',
    'Fair',
    0
  ),
  (
    '88888888-8888-8888-8888-888888888888',
    '11111111-1111-1111-1111-111111111111',
    'Intramural Basketball Tournament',
    'Sign up your team for the semester tournament. Prizes for winners!',
    'Recreation Center',
    NOW() + INTERVAL '7 days',
    'Event',
    0
  );

-- ============================================================================
-- SAMPLE ATTENDANCE RECORDS (Past Event)
-- ============================================================================
-- Insert a past event first
INSERT INTO events (event_id, student_id, title, description, location, date_and_time, event_type, attendance) VALUES
  (
    '99999999-9999-9999-9999-999999999999',
    '22222222-2222-2222-2222-222222222222',
    'Welcome Back Party',
    'Semester kickoff party with music and refreshments',
    'Student Center',
    NOW() - INTERVAL '5 days',
    'Event',
    3
  );

-- Sample attendance records
INSERT INTO attend (student_id, event_id, shared_experience, rating, names_of_students, count_attendees, timestamp_start, timestamp_end) VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    '99999999-9999-9999-9999-999999999999',
    'Great party! Met lots of new people and the music was awesome.',
    5,
    ARRAY['John Doe', 'Mike Johnson', 'Sarah Williams'],
    3,
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days' + INTERVAL '2 hours'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    '99999999-9999-9999-9999-999999999999',
    'Fun event, would attend again!',
    4,
    ARRAY['John Doe', 'Mike Johnson', 'Sarah Williams'],
    3,
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days' + INTERVAL '2 hours'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    '99999999-9999-9999-9999-999999999999',
    'Good way to meet people at the start of semester',
    4,
    ARRAY['John Doe', 'Mike Johnson', 'Sarah Williams'],
    3,
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days' + INTERVAL '2 hours'
  );

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- Check data was inserted
SELECT 'Students:' as table_name, COUNT(*) as count FROM student
UNION ALL
SELECT 'Interests:', COUNT(*) FROM interest
UNION ALL
SELECT 'Events:', COUNT(*) FROM events
UNION ALL
SELECT 'Attendance Records:', COUNT(*) FROM attend;
