-- EventBuddy Database Schema
-- Prototype 2 - Initial Schema
-- Based on User Stories from Specification 1

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PROFILES TABLE
-- User Stories #1, #2, #3: Bio, interests, personality, major, academic year
-- ============================================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  bio TEXT,
  major VARCHAR(100),
  academic_year VARCHAR(20) CHECK (academic_year IN ('Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate')),
  personality_type VARCHAR(20) CHECK (personality_type IN ('Introverted', 'Extroverted', 'Ambivert')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INTERESTS TABLE
-- User Story #1: List interests for profile building
-- ============================================================================
CREATE TABLE interests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PROFILE_INTERESTS (Join Table)
-- Many-to-many relationship between profiles and interests
-- ============================================================================
CREATE TABLE profile_interests (
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  interest_id UUID REFERENCES interests(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (profile_id, interest_id)
);

-- ============================================================================
-- EVENTS TABLE
-- User Story #9: Browse campus events, club meetings, and fairs
-- User Story #6: Event promotion system
-- ============================================================================
CREATE TABLE events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_type VARCHAR(50) CHECK (event_type IN ('Event', 'Club Meeting', 'Fair')) NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  location VARCHAR(500),
  capacity INTEGER,
  category VARCHAR(100),
  status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'cancelled')),
  image_url TEXT,
  host_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- EVENT_SAVES TABLE
-- User Story #10: Save/bookmark events for reminders
-- ============================================================================
CREATE TABLE event_saves (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- ============================================================================
-- EVENT_RATINGS TABLE
-- User Story #11: Quick smiley face ratings for events
-- ============================================================================
CREATE TABLE event_ratings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating BETWEEN 1 AND 4), -- 1=😢, 2=😐, 3=😊, 4=😍
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- ============================================================================
-- CONNECTIONS TABLE
-- User Story #7: Buddy matching and connections
-- User Story #8: Unmatch functionality
-- ============================================================================
CREATE TABLE connections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  requester_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'unmatched')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(requester_id, receiver_id),
  CHECK (requester_id != receiver_id)
);

-- ============================================================================
-- MESSAGES TABLE
-- User Story #8: Message buddies (basic messaging)
-- ============================================================================
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  connection_id UUID REFERENCES connections(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- BLOCKS TABLE
-- User Story #5: Block users for safety
-- ============================================================================
CREATE TABLE blocks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  blocker_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  blocked_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(blocker_id, blocked_id),
  CHECK (blocker_id != blocked_id)
);

-- ============================================================================
-- REPORTS TABLE
-- User Story #5: Report users for safety
-- ============================================================================
CREATE TABLE reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reporter_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reported_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reason VARCHAR(100) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES for Performance
-- ============================================================================
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_major ON profiles(major);
CREATE INDEX idx_profiles_academic_year ON profiles(academic_year);
CREATE INDEX idx_profiles_personality ON profiles(personality_type);

CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_event_type ON events(event_type);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_host_id ON events(host_id);
CREATE INDEX idx_events_status ON events(status);

CREATE INDEX idx_connections_requester ON connections(requester_id);
CREATE INDEX idx_connections_receiver ON connections(receiver_id);
CREATE INDEX idx_connections_status ON connections(status);

CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_messages_created ON messages(created_at);

CREATE INDEX idx_event_saves_user ON event_saves(user_id);
CREATE INDEX idx_event_saves_event ON event_saves(event_id);

-- ============================================================================
-- TRIGGERS for Updated Timestamps
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_connections_updated_at
  BEFORE UPDATE ON connections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
