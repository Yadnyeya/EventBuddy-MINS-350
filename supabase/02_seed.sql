-- EventBuddy Seed Data
-- Prototype 2 - Test Data
-- Creates realistic sample data for development and testing

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
  ('Hiking', 'Recreation')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- SEED USERS, PROFILES, AND RELATED DATA
-- Uses auth.admin.create_user to provision accounts and capture their UUIDs
-- ============================================================================
DO $$
DECLARE
  alex UUID;
  emma UUID;
  jordan UUID;
  sophia UUID;
  marcus UUID;
  conn_alex_emma UUID;
  conn_jordan_sophia UUID;
  conn_emma_marcus UUID;
  conn_alex_jordan UUID;
  event_web UUID;
  event_career UUID;
  event_study UUID;
  event_art UUID;
  event_wellness UUID;
BEGIN
  -- Create users if they do not already exist
  SELECT id INTO alex FROM auth.users WHERE email = 'alex.chen@example.com';
  IF alex IS NULL THEN
    SELECT id INTO alex
    FROM auth.admin.create_user(
      email => 'alex.chen@example.com',
      password => 'Password123!',
      email_confirm => true,
      user_metadata => jsonb_build_object('full_name', 'Alex Chen')
    );
  END IF;

  SELECT id INTO emma FROM auth.users WHERE email = 'emma.martinez@example.com';
  IF emma IS NULL THEN
    SELECT id INTO emma
    FROM auth.admin.create_user(
      email => 'emma.martinez@example.com',
      password => 'Password123!',
      email_confirm => true,
      user_metadata => jsonb_build_object('full_name', 'Emma Martinez')
    );
  END IF;

  SELECT id INTO jordan FROM auth.users WHERE email = 'jordan.lee@example.com';
  IF jordan IS NULL THEN
    SELECT id INTO jordan
    FROM auth.admin.create_user(
      email => 'jordan.lee@example.com',
      password => 'Password123!',
      email_confirm => true,
      user_metadata => jsonb_build_object('full_name', 'Jordan Lee')
    );
  END IF;

  SELECT id INTO sophia FROM auth.users WHERE email = 'sophia.patel@example.com';
  IF sophia IS NULL THEN
    SELECT id INTO sophia
    FROM auth.admin.create_user(
      email => 'sophia.patel@example.com',
      password => 'Password123!',
      email_confirm => true,
      user_metadata => jsonb_build_object('full_name', 'Sophia Patel')
    );
  END IF;

  SELECT id INTO marcus FROM auth.users WHERE email = 'marcus.johnson@example.com';
  IF marcus IS NULL THEN
    SELECT id INTO marcus
    FROM auth.admin.create_user(
      email => 'marcus.johnson@example.com',
      password => 'Password123!',
      email_confirm => true,
      user_metadata => jsonb_build_object('full_name', 'Marcus Johnson')
    );
  END IF;

  -- Insert profiles for each user
  INSERT INTO profiles (id, username, full_name, bio, major, academic_year, personality_type, avatar_url)
  VALUES
    (alex, 'alex_chen', 'Alex Chen',
      'CS major who loves coding and indie games. Looking to meet other tech enthusiasts!',
      'Computer Science', 'Junior', 'Introverted',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'),
    (emma, 'emma_m', 'Emma Martinez',
      'Business major passionate about entrepreneurship and networking. Let''s connect!',
      'Business Administration', 'Senior', 'Extroverted',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma'),
    (jordan, 'jordan_lee', 'Jordan Lee',
      'Engineering student who enjoys both quiet study sessions and social events.',
      'Mechanical Engineering', 'Sophomore', 'Ambivert',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan'),
    (sophia, 'sophia_p', 'Sophia Patel',
      'Art major who loves photography and quiet cafes. Open to meeting creative minds!',
      'Fine Arts', 'Freshman', 'Introverted',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia'),
    (marcus, 'marcus_j', 'Marcus Johnson',
      'Psychology major and student government member. Love organizing events and meeting new people!',
      'Psychology', 'Senior', 'Extroverted',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus')
  ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    full_name = EXCLUDED.full_name,
    bio = EXCLUDED.bio,
    major = EXCLUDED.major,
    academic_year = EXCLUDED.academic_year,
    personality_type = EXCLUDED.personality_type,
    avatar_url = EXCLUDED.avatar_url;

  -- Attach interests to profiles
  INSERT INTO profile_interests (profile_id, interest_id)
    SELECT alex, id FROM interests WHERE name IN ('Technology', 'Coding', 'Gaming')
  ON CONFLICT DO NOTHING;

  INSERT INTO profile_interests (profile_id, interest_id)
    SELECT emma, id FROM interests WHERE name IN ('Business', 'Volunteering', 'Travel')
  ON CONFLICT DO NOTHING;

  INSERT INTO profile_interests (profile_id, interest_id)
    SELECT jordan, id FROM interests WHERE name IN ('Sports', 'Fitness', 'Technology')
  ON CONFLICT DO NOTHING;

  INSERT INTO profile_interests (profile_id, interest_id)
    SELECT sophia, id FROM interests WHERE name IN ('Art', 'Photography', 'Reading')
  ON CONFLICT DO NOTHING;

  INSERT INTO profile_interests (profile_id, interest_id)
    SELECT marcus, id FROM interests WHERE name IN ('Volunteering', 'Music', 'Sports')
  ON CONFLICT DO NOTHING;

  -- Insert sample events
  -- Insert or fetch events for each host
  SELECT id INTO event_web FROM events WHERE title = 'Intro to Web Development Workshop';
  IF event_web IS NULL THEN
    INSERT INTO events (title, description, event_type, start_date, end_date, location, capacity, category, status, host_id)
    VALUES (
      'Intro to Web Development Workshop',
      'Learn the basics of HTML, CSS, and JavaScript in this beginner-friendly workshop!',
      'Club Meeting',
      NOW() + INTERVAL '3 days',
      NOW() + INTERVAL '3 days 2 hours',
      'Computer Science Building, Room 201',
      30,
      'Technology',
      'published',
      alex
    ) RETURNING id INTO event_web;
  END IF;

  SELECT id INTO event_career FROM events WHERE title = 'Fall Career Fair 2025';
  IF event_career IS NULL THEN
    INSERT INTO events (title, description, event_type, start_date, end_date, location, capacity, category, status, host_id)
    VALUES (
      'Fall Career Fair 2025',
      'Meet with top employers and explore internship and full-time opportunities!',
      'Fair',
      NOW() + INTERVAL '1 week',
      NOW() + INTERVAL '1 week 6 hours',
      'Student Union, Main Hall',
      500,
      'Career',
      'published',
      emma
    ) RETURNING id INTO event_career;
  END IF;

  SELECT id INTO event_study FROM events WHERE title = 'Engineering Study Group';
  IF event_study IS NULL THEN
    INSERT INTO events (title, description, event_type, start_date, end_date, location, capacity, category, status, host_id)
    VALUES (
      'Engineering Study Group',
      'Weekly study session for engineering students. All majors welcome!',
      'Club Meeting',
      NOW() + INTERVAL '2 days',
      NOW() + INTERVAL '2 days 3 hours',
      'Engineering Library, Study Room 3',
      15,
      'Academic',
      'published',
      jordan
    ) RETURNING id INTO event_study;
  END IF;

  SELECT id INTO event_art FROM events WHERE title = 'Student Art Exhibition Opening';
  IF event_art IS NULL THEN
    INSERT INTO events (title, description, event_type, start_date, end_date, location, capacity, category, status, host_id)
    VALUES (
      'Student Art Exhibition Opening',
      'Celebrate creativity! Opening night of our semester art exhibition featuring student works.',
      'Event',
      NOW() + INTERVAL '5 days',
      NOW() + INTERVAL '5 days 4 hours',
      'Arts Center, Main Gallery',
      100,
      'Arts',
      'published',
      sophia
    ) RETURNING id INTO event_art;
  END IF;

  SELECT id INTO event_wellness FROM events WHERE title = 'Mindfulness & Stress Management';
  IF event_wellness IS NULL THEN
    INSERT INTO events (title, description, event_type, start_date, end_date, location, capacity, category, status, host_id)
    VALUES (
      'Mindfulness & Stress Management',
      'Learn practical techniques for managing stress and improving mental well-being.',
      'Event',
      NOW() + INTERVAL '4 days',
      NOW() + INTERVAL '4 days 1.5 hours',
      'Wellness Center, Room A',
      25,
      'Wellness',
      'published',
      marcus
    ) RETURNING id INTO event_wellness;
  END IF;

  -- Event saves and ratings
  INSERT INTO event_saves (event_id, user_id)
  VALUES
    (event_web, emma),
    (event_career, jordan),
    (event_study, alex),
    (event_art, marcus)
  ON CONFLICT DO NOTHING;

  INSERT INTO event_ratings (event_id, user_id, rating, comment)
  VALUES
    (event_web, alex, 4, 'Awesome intro material and friendly mentors!'),
    (event_career, emma, 3, 'Great employers, but lines were long.'),
    (event_study, jordan, 4, 'Productive session with collaborative peers.'),
    (event_art, sophia, 4, 'Loved the energy and feedback on my work.'),
    (event_wellness, marcus, 3, 'Helpful tips, could use more interactive time.')
  ON CONFLICT DO NOTHING;

  -- Connections between students (fetch if already present)
  SELECT id INTO conn_alex_emma FROM connections
    WHERE requester_id = alex AND receiver_id = emma;
  IF conn_alex_emma IS NULL THEN
    INSERT INTO connections (requester_id, receiver_id, status)
    VALUES (alex, emma, 'accepted')
    RETURNING id INTO conn_alex_emma;
  END IF;

  SELECT id INTO conn_emma_marcus FROM connections
    WHERE requester_id = emma AND receiver_id = marcus;
  IF conn_emma_marcus IS NULL THEN
    INSERT INTO connections (requester_id, receiver_id, status)
    VALUES (emma, marcus, 'accepted')
    RETURNING id INTO conn_emma_marcus;
  END IF;

  SELECT id INTO conn_jordan_sophia FROM connections
    WHERE requester_id = jordan AND receiver_id = sophia;
  IF conn_jordan_sophia IS NULL THEN
    INSERT INTO connections (requester_id, receiver_id, status)
    VALUES (jordan, sophia, 'accepted')
    RETURNING id INTO conn_jordan_sophia;
  END IF;

  SELECT id INTO conn_alex_jordan FROM connections
    WHERE requester_id = alex AND receiver_id = jordan;
  IF conn_alex_jordan IS NULL THEN
    INSERT INTO connections (requester_id, receiver_id, status)
    VALUES (alex, jordan, 'pending')
    RETURNING id INTO conn_alex_jordan;
  END IF;

  -- Messages for active connections
  IF NOT EXISTS (
    SELECT 1 FROM messages
    WHERE sender_id = alex AND receiver_id = emma
      AND connection_id = conn_alex_emma
      AND content = 'Hey Emma! Want to meet up before the workshop?'
  ) THEN
    INSERT INTO messages (sender_id, receiver_id, connection_id, content, read)
    VALUES (alex, emma, conn_alex_emma, 'Hey Emma! Want to meet up before the workshop?', true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM messages
    WHERE sender_id = emma AND receiver_id = alex
      AND connection_id = conn_alex_emma
      AND content = 'Absolutely! Let''s grab coffee 30 minutes before.'
  ) THEN
    INSERT INTO messages (sender_id, receiver_id, connection_id, content, read)
    VALUES (emma, alex, conn_alex_emma, 'Absolutely! Let''s grab coffee 30 minutes before.', true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM messages
    WHERE sender_id = emma AND receiver_id = marcus
      AND connection_id = conn_emma_marcus
      AND content = 'We should plan the volunteer fair booth together.'
  ) THEN
    INSERT INTO messages (sender_id, receiver_id, connection_id, content, read)
    VALUES (emma, marcus, conn_emma_marcus, 'We should plan the volunteer fair booth together.', false);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM messages
    WHERE sender_id = marcus AND receiver_id = emma
      AND connection_id = conn_emma_marcus
      AND content = 'Sounds good, I''ll draft a schedule tonight.'
  ) THEN
    INSERT INTO messages (sender_id, receiver_id, connection_id, content, read)
    VALUES (marcus, emma, conn_emma_marcus, 'Sounds good, I''ll draft a schedule tonight.', false);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM messages
    WHERE sender_id = jordan AND receiver_id = sophia
      AND connection_id = conn_jordan_sophia
      AND content = 'Loved your latest photo set! Are you attending the exhibition?'
  ) THEN
    INSERT INTO messages (sender_id, receiver_id, connection_id, content, read)
    VALUES (jordan, sophia, conn_jordan_sophia, 'Loved your latest photo set! Are you attending the exhibition?', true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM messages
    WHERE sender_id = sophia AND receiver_id = jordan
      AND connection_id = conn_jordan_sophia
      AND content = 'Thank you! Yes, I''ll be there early to help set up.'
  ) THEN
    INSERT INTO messages (sender_id, receiver_id, connection_id, content, read)
    VALUES (sophia, jordan, conn_jordan_sophia, 'Thank you! Yes, I''ll be there early to help set up.', false);
  END IF;

  -- Blocks and reports for safety scenarios
  IF NOT EXISTS (
    SELECT 1 FROM blocks WHERE blocker_id = sophia AND blocked_id = marcus
  ) THEN
    INSERT INTO blocks (blocker_id, blocked_id, reason)
    VALUES (sophia, marcus, 'Too many unsolicited messages');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM reports WHERE reporter_id = emma AND reported_id = marcus AND reason = 'Harassment'
  ) THEN
    INSERT INTO reports (reporter_id, reported_id, reason, description, status)
    VALUES (emma, marcus, 'Harassment', 'Marcus sent several unwanted DMs to multiple students.', 'reviewing');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM reports WHERE reporter_id = alex AND reported_id = marcus AND reason = 'Spam'
  ) THEN
    INSERT INTO reports (reporter_id, reported_id, reason, description, status)
    VALUES (alex, marcus, 'Spam', 'Received repeated promotional messages about unrelated events.', 'pending');
  END IF;
END $$;

