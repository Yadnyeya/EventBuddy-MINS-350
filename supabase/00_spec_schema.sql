-- EventBuddy Database Schema
-- Based on Specification 2 Document
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- STUDENT TABLE
-- Core student account information
-- ============================================================================
CREATE TABLE student (
  student_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID,  -- Will link to profile table
  email VARCHAR(255) UNIQUE NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  year VARCHAR(20) CHECK (year IN ('Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INTEREST TABLE
-- Student interests for matching
-- ============================================================================
CREATE TABLE interest (
  interest_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES student(student_id) ON DELETE CASCADE,
  interest_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- EVENTS TABLE
-- Campus events, club meetings, and fairs
-- ============================================================================
CREATE TABLE events (
  event_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES student(student_id) ON DELETE SET NULL, -- Event creator/host
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(500),
  date_and_time TIMESTAMPTZ NOT NULL,
  event_type VARCHAR(50) CHECK (event_type IN ('Event', 'Club Meeting', 'Fair')),
  attendance INTEGER DEFAULT 0, -- Count of attendees
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ATTEND TABLE
-- Track event attendance, ratings, and shared experiences
-- ============================================================================
CREATE TABLE attend (
  attend_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES student(student_id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(event_id) ON DELETE CASCADE,
  shared_experience TEXT, -- Student's experience/feedback
  rating INTEGER CHECK (rating BETWEEN 1 AND 5), -- 1-5 star rating
  names_of_students TEXT[], -- Array of student names who attended together
  count_attendees INTEGER, -- Snapshot of total attendees at time of attendance
  timestamp_start TIMESTAMPTZ, -- When student checked in
  timestamp_end TIMESTAMPTZ, -- When student checked out
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, event_id) -- Student can only attend event once
);

-- ============================================================================
-- INDEXES for Performance
-- ============================================================================
CREATE INDEX idx_student_email ON student(email);
CREATE INDEX idx_student_year ON student(year);
CREATE INDEX idx_student_verified ON student(is_verified);

CREATE INDEX idx_interest_student ON interest(student_id);
CREATE INDEX idx_interest_name ON interest(interest_name);

CREATE INDEX idx_events_student ON events(student_id);
CREATE INDEX idx_events_datetime ON events(date_and_time);
CREATE INDEX idx_events_type ON events(event_type);

CREATE INDEX idx_attend_student ON attend(student_id);
CREATE INDEX idx_attend_event ON attend(event_id);
CREATE INDEX idx_attend_start ON attend(timestamp_start);

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

CREATE TRIGGER update_student_updated_at
  BEFORE UPDATE ON student
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMMENTS for Documentation
-- ============================================================================
COMMENT ON TABLE student IS 'Core student account information with email and verification status';
COMMENT ON TABLE interest IS 'Student interests for profile building and matching';
COMMENT ON TABLE events IS 'Campus events, club meetings, and fairs';
COMMENT ON TABLE attend IS 'Event attendance tracking with ratings and shared experiences';

COMMENT ON COLUMN student.is_verified IS 'Email verification status';
COMMENT ON COLUMN events.attendance IS 'Total count of students who attended';
COMMENT ON COLUMN attend.shared_experience IS 'Student feedback and experience sharing';
COMMENT ON COLUMN attend.names_of_students IS 'Array of names of students attended together';
COMMENT ON COLUMN attend.count_attendees IS 'Snapshot of total attendees at check-in time';
COMMENT ON COLUMN attend.timestamp_start IS 'Event check-in timestamp';
COMMENT ON COLUMN attend.timestamp_end IS 'Event check-out timestamp';
