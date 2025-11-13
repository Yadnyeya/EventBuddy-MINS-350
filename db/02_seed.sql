-- EventBuddy Seed Data
-- Prototype 2 - Test Data
-- Creates realistic sample data for development and testing

-- Note: Replace these UUIDs with actual user IDs after Supabase Auth creates the users
-- For testing, you'll need to create these users in Supabase Auth first

-- ============================================================================
-- SEED INTERESTS (Common student interests)
-- ============================================================================
INSERT INTO interests (name, category) VALUES
  ('Technology', 'Academic'),
  ('Music', 'Arts'),
  ('Sports', 'Recreation'),
  ('Reading', 'Arts'),
  ('Photography', 'Arts'),
  ('Coding', 'Academic'),
  ('Gaming', 'Recreation'),
  ('Travel', 'Lifestyle'),
  ('Cooking', 'Lifestyle'),
  ('Fitness', 'Recreation'),
  ('Art', 'Arts'),
  ('Business', 'Academic'),
  ('Volunteering', 'Social'),
  ('Movies', 'Entertainment'),
  ('Hiking', 'Recreation');

-- ============================================================================
-- SEED PROFILES
-- Note: You'll need to create these users in Supabase Auth first
-- Then replace the UUID values below with the actual auth.users IDs
-- ============================================================================

-- Sample Profile 1: Alex Chen (Introverted Computer Science Student)
-- INSERT INTO profiles (id, username, full_name, bio, major, academic_year, personality_type, avatar_url) VALUES
-- ('USER_UUID_1', 'alex_chen', 'Alex Chen', 
--  'CS major who loves coding and indie games. Looking to meet other tech enthusiasts!', 
--  'Computer Science', 'Junior', 'Introverted', 
--  'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex');

-- Sample Profile 2: Emma Martinez (Extroverted Business Student)
-- INSERT INTO profiles (id, username, full_name, bio, major, academic_year, personality_type, avatar_url) VALUES
-- ('USER_UUID_2', 'emma_m', 'Emma Martinez', 
--  'Business major passionate about entrepreneurship and networking. Let''s connect!', 
--  'Business Administration', 'Senior', 'Extroverted', 
--  'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma');

-- Sample Profile 3: Jordan Lee (Ambivert Engineering Student)
-- INSERT INTO profiles (id, username, full_name, bio, major, academic_year, personality_type, avatar_url) VALUES
-- ('USER_UUID_3', 'jordan_lee', 'Jordan Lee', 
--  'Engineering student who enjoys both quiet study sessions and social events.', 
--  'Mechanical Engineering', 'Sophomore', 'Ambivert', 
--  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan');

-- Sample Profile 4: Sophia Patel (Introverted Arts Student)
-- INSERT INTO profiles (id, username, full_name, bio, major, academic_year, personality_type, avatar_url) VALUES
-- ('USER_UUID_4', 'sophia_p', 'Sophia Patel', 
--  'Art major who loves photography and quiet cafes. Open to meeting creative minds!', 
--  'Fine Arts', 'Freshman', 'Introverted', 
--  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia');

-- Sample Profile 5: Marcus Johnson (Extroverted Psychology Student)
-- INSERT INTO profiles (id, username, full_name, bio, major, academic_year, personality_type, avatar_url) VALUES
-- ('USER_UUID_5', 'marcus_j', 'Marcus Johnson', 
--  'Psychology major and student government member. Love organizing events and meeting new people!', 
--  'Psychology', 'Senior', 'Extroverted', 
--  'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus');

-- ============================================================================
-- SEED PROFILE_INTERESTS
-- Links profiles to their interests
-- ============================================================================

-- Alex Chen's interests: Technology, Coding, Gaming
-- INSERT INTO profile_interests (profile_id, interest_id) 
-- SELECT 'USER_UUID_1', id FROM interests WHERE name IN ('Technology', 'Coding', 'Gaming');

-- Emma Martinez's interests: Business, Volunteering, Travel
-- INSERT INTO profile_interests (profile_id, interest_id)
-- SELECT 'USER_UUID_2', id FROM interests WHERE name IN ('Business', 'Volunteering', 'Travel');

-- Jordan Lee's interests: Sports, Fitness, Technology
-- INSERT INTO profile_interests (profile_id, interest_id)
-- SELECT 'USER_UUID_3', id FROM interests WHERE name IN ('Sports', 'Fitness', 'Technology');

-- Sophia Patel's interests: Art, Photography, Reading
-- INSERT INTO profile_interests (profile_id, interest_id)
-- SELECT 'USER_UUID_4', id FROM interests WHERE name IN ('Art', 'Photography', 'Reading');

-- Marcus Johnson's interests: Volunteering, Music, Sports
-- INSERT INTO profile_interests (profile_id, interest_id)
-- SELECT 'USER_UUID_5', id FROM interests WHERE name IN ('Volunteering', 'Music', 'Sports');

-- ============================================================================
-- SEED EVENTS
-- Sample campus events, club meetings, and fairs
-- ============================================================================

-- Event 1: Tech Workshop
-- INSERT INTO events (title, description, event_type, start_date, end_date, location, capacity, category, status, host_id) VALUES
-- ('Intro to Web Development Workshop', 
--  'Learn the basics of HTML, CSS, and JavaScript in this beginner-friendly workshop!',
--  'Club Meeting',
--  NOW() + INTERVAL '3 days',
--  NOW() + INTERVAL '3 days 2 hours',
--  'Computer Science Building, Room 201',
--  30,
--  'Technology',
--  'published',
--  'USER_UUID_1');

-- Event 2: Career Fair
-- INSERT INTO events (title, description, event_type, start_date, end_date, location, capacity, category, status, host_id) VALUES
-- ('Fall Career Fair 2025',
--  'Meet with top employers and explore internship and full-time opportunities!',
--  'Fair',
--  NOW() + INTERVAL '1 week',
--  NOW() + INTERVAL '1 week 6 hours',
--  'Student Union, Main Hall',
--  500,
--  'Career',
--  'published',
--  'USER_UUID_2');

-- Event 3: Study Group
-- INSERT INTO events (title, description, event_type, start_date, end_date, location, capacity, category, status, host_id) VALUES
-- ('Engineering Study Group',
--  'Weekly study session for engineering students. All majors welcome!',
--  'Club Meeting',
--  NOW() + INTERVAL '2 days',
--  NOW() + INTERVAL '2 days 3 hours',
--  'Engineering Library, Study Room 3',
--  15,
--  'Academic',
--  'published',
--  'USER_UUID_3');

-- Event 4: Art Exhibition
-- INSERT INTO events (title, description, event_type, start_date, end_date, location, capacity, category, status, host_id) VALUES
-- ('Student Art Exhibition Opening',
--  'Celebrate creativity! Opening night of our semester art exhibition featuring student works.',
--  'Event',
--  NOW() + INTERVAL '5 days',
--  NOW() + INTERVAL '5 days 4 hours',
--  'Arts Center, Main Gallery',
--  100,
--  'Arts',
--  'published',
--  'USER_UUID_4');

-- Event 5: Wellness Workshop
-- INSERT INTO events (title, description, event_type, start_date, end_date, location, capacity, category, status, host_id) VALUES
-- ('Mindfulness & Stress Management',
--  'Learn practical techniques for managing stress and improving mental well-being.',
--  'Event',
--  NOW() + INTERVAL '4 days',
--  NOW() + INTERVAL '4 days 1.5 hours',
--  'Wellness Center, Room A',
--  25,
--  'Wellness',
--  'published',
--  'USER_UUID_5');

-- ============================================================================
-- INSTRUCTIONS FOR USE
-- ============================================================================
-- 1. First, create user accounts in Supabase Auth dashboard or via your app
-- 2. Copy the UUID from auth.users for each test user
-- 3. Replace 'USER_UUID_1', 'USER_UUID_2', etc. with actual UUIDs
-- 4. Uncomment all INSERT statements
-- 5. Run this script in Supabase SQL Editor
-- ============================================================================
