/*
  # Initial Schema for U-Recover Platform

  1. New Tables
    - `profiles` - User profiles extending Supabase auth
    - `counsellors` - Counsellor information and specialties
    - `appointments` - Booking and session management
    - `sessions` - Completed therapy sessions
    - `wellness_entries` - Daily wellness and mood tracking
    - `notifications` - User notifications system
    - `testimonials` - Client testimonials and reviews
    - `blog_posts` - Blog content management
    - `articles` - Educational articles
    - `resources` - Downloadable resources
    - `messages` - Chat messages between users and counsellors
    - `goals` - User wellness goals tracking

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure counsellor and admin access
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  phone text,
  date_of_birth date,
  emergency_contact text,
  emergency_phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create counsellors table
CREATE TABLE IF NOT EXISTS counsellors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  title text NOT NULL,
  specialties text[] DEFAULT '{}',
  experience_years integer DEFAULT 0,
  rating numeric(3,2) DEFAULT 0.0,
  total_reviews integer DEFAULT 0,
  location text,
  languages text[] DEFAULT '{}',
  bio text,
  education text[],
  hourly_rate numeric(10,2),
  avatar_url text,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  counsellor_id uuid REFERENCES counsellors(id) ON DELETE CASCADE,
  appointment_date timestamptz NOT NULL,
  duration_minutes integer DEFAULT 60,
  session_type text CHECK (session_type IN ('video', 'audio', 'chat', 'in-person')) DEFAULT 'video',
  status text CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no-show')) DEFAULT 'scheduled',
  notes text,
  meeting_link text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES appointments(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  counsellor_id uuid REFERENCES counsellors(id) ON DELETE CASCADE,
  session_date timestamptz NOT NULL,
  duration_minutes integer NOT NULL,
  session_type text NOT NULL,
  session_notes text,
  homework_assigned text,
  next_session_goals text,
  user_feedback text,
  counsellor_rating integer CHECK (counsellor_rating >= 1 AND counsellor_rating <= 5),
  created_at timestamptz DEFAULT now()
);

-- Create wellness_entries table
CREATE TABLE IF NOT EXISTS wellness_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_date date NOT NULL,
  mood_score integer CHECK (mood_score >= 1 AND mood_score <= 10),
  wellness_score integer CHECK (wellness_score >= 1 AND wellness_score <= 10),
  anxiety_level integer CHECK (anxiety_level >= 1 AND anxiety_level <= 10),
  sleep_hours numeric(3,1),
  exercise_minutes integer DEFAULT 0,
  meditation_minutes integer DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, entry_date)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text CHECK (type IN ('appointment', 'message', 'wellness', 'system', 'reminder')) DEFAULT 'system',
  is_read boolean DEFAULT false,
  action_url text,
  created_at timestamptz DEFAULT now()
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  counsellor_id uuid REFERENCES counsellors(id),
  rating integer CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  title text,
  content text NOT NULL,
  is_anonymous boolean DEFAULT false,
  is_approved boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES auth.users(id),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text NOT NULL,
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  featured_image_url text,
  is_published boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  read_time_minutes integer DEFAULT 5,
  views_count integer DEFAULT 0,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  content text NOT NULL,
  category text NOT NULL,
  difficulty_level text CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  read_time_minutes integer DEFAULT 5,
  tags text[] DEFAULT '{}',
  is_published boolean DEFAULT false,
  views_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create resources table
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL,
  resource_type text CHECK (resource_type IN ('pdf', 'audio', 'video', 'worksheet', 'guide')) NOT NULL,
  file_url text,
  file_size_mb numeric(10,2),
  download_count integer DEFAULT 0,
  is_premium boolean DEFAULT false,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL,
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  message_type text CHECK (message_type IN ('text', 'image', 'file', 'system')) DEFAULT 'text',
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create goals table
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  category text,
  target_value integer,
  current_value integer DEFAULT 0,
  unit text,
  target_date date,
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE counsellors ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Counsellors policies
CREATE POLICY "Anyone can read counsellors"
  ON counsellors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Counsellors can update own profile"
  ON counsellors FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Appointments policies
CREATE POLICY "Users can read own appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() IN (SELECT user_id FROM counsellors WHERE id = counsellor_id));

CREATE POLICY "Users can create appointments"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() IN (SELECT user_id FROM counsellors WHERE id = counsellor_id));

-- Sessions policies
CREATE POLICY "Users can read own sessions"
  ON sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() IN (SELECT user_id FROM counsellors WHERE id = counsellor_id));

CREATE POLICY "Counsellors can create sessions"
  ON sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IN (SELECT user_id FROM counsellors WHERE id = counsellor_id));

-- Wellness entries policies
CREATE POLICY "Users can manage own wellness entries"
  ON wellness_entries FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Testimonials policies
CREATE POLICY "Anyone can read approved testimonials"
  ON testimonials FOR SELECT
  TO authenticated
  USING (is_approved = true);

CREATE POLICY "Users can create own testimonials"
  ON testimonials FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Blog posts policies
CREATE POLICY "Anyone can read published blog posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (is_published = true);

-- Articles policies
CREATE POLICY "Anyone can read published articles"
  ON articles FOR SELECT
  TO authenticated
  USING (is_published = true);

-- Resources policies
CREATE POLICY "Anyone can read resources"
  ON resources FOR SELECT
  TO authenticated
  USING (true);

-- Messages policies
CREATE POLICY "Users can read own messages"
  ON messages FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

-- Goals policies
CREATE POLICY "Users can manage own goals"
  ON goals FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_counsellor_id ON appointments(counsellor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_wellness_entries_user_date ON wellness_entries(user_id, entry_date);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published, published_at);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(is_published);