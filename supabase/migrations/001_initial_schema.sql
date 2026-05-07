-- livEvent database migration
-- Run this in your Supabase SQL Editor

-- Enable UUID extension (already enabled in Supabase by default)
-- Create tables

CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  imei VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255),
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS artists (
  artist_id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) UNIQUE NOT NULL,
  gender VARCHAR(100) NOT NULL,
  description TEXT,
  image TEXT,
  twitter TEXT,
  facebook TEXT,
  instagram TEXT,
  youtube TEXT,
  webpage TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  event_id SERIAL PRIMARY KEY,
  artist_id INTEGER NOT NULL REFERENCES artists(artist_id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  date DATE NOT NULL,
  duration TIME NOT NULL DEFAULT '02:00:00',
  localization TEXT NOT NULL,
  tickets TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  notification_id SERIAL PRIMARY KEY,
  artist_id INTEGER NOT NULL REFERENCES artists(artist_id) ON DELETE CASCADE,
  event_id INTEGER NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS survey_index (
  survey_id SERIAL PRIMARY KEY,
  artist_id INTEGER NOT NULL REFERENCES artists(artist_id) ON DELETE CASCADE,
  event_id INTEGER NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  date DATE NOT NULL,
  duration TIME NOT NULL DEFAULT '05:00:00',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(artist_id, event_id)
);

CREATE TABLE IF NOT EXISTS survey_answers (
  answer_id SERIAL PRIMARY KEY,
  survey_id INTEGER NOT NULL REFERENCES survey_index(survey_id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(survey_id, user_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_artist_id ON events(artist_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_notifications_artist_id ON notifications(artist_id);
CREATE INDEX IF NOT EXISTS idx_notifications_event_id ON notifications(event_id);
CREATE INDEX IF NOT EXISTS idx_survey_index_artist_id ON survey_index(artist_id);
CREATE INDEX IF NOT EXISTS idx_survey_answers_survey_id ON survey_answers(survey_id);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_index ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_answers ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read events" ON events FOR SELECT USING (true);
CREATE POLICY "Public read verified artists" ON artists FOR SELECT USING (verified = true);
CREATE POLICY "Public read notifications" ON notifications FOR SELECT USING (true);
CREATE POLICY "Public read surveys" ON survey_index FOR SELECT USING (true);

-- Authenticated artist write access
CREATE POLICY "Artist insert event" ON events FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Artist update own event" ON events FOR UPDATE
  USING (artist_id IN (
    SELECT artist_id FROM artists WHERE email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
  ));

CREATE POLICY "Artist delete own event" ON events FOR DELETE
  USING (artist_id IN (
    SELECT artist_id FROM artists WHERE email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
  ));

CREATE POLICY "Artist insert notification" ON notifications FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Artist delete own notification" ON notifications FOR DELETE
  USING (artist_id IN (
    SELECT artist_id FROM artists WHERE email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
  ));

CREATE POLICY "Artist insert survey" ON survey_index FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Artists can see/update their own profile
-- All profiles are publicly readable (verified filter applied at query level)
CREATE POLICY "Artist read own profile" ON artists FOR SELECT USING (true);
-- Only authenticated users can register as an artist (one record per auth user)
CREATE POLICY "Artist insert own profile" ON artists FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );
CREATE POLICY "Artist update own profile" ON artists FOR UPDATE
  USING (email = (
    SELECT email FROM auth.users WHERE id = auth.uid()
  ));

-- Users can answer surveys
CREATE POLICY "User insert survey answer" ON survey_answers FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Public read survey answers" ON survey_answers FOR SELECT USING (true);
