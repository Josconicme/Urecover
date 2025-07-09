/*
  # Demo Data Setup Migration

  This migration adds sample data to the database that doesn't require
  authentication users to exist first. Demo users and counsellor accounts
  must be created manually through Supabase Auth dashboard.

  1. Sample Data Added
    - Additional sample counsellors (beyond the existing ones)
    - More blog posts and articles
    - Additional resources
    - More testimonials

  2. Notes
    - Demo users must be created manually in Supabase Auth
    - After creating auth users, their profiles will be auto-created via triggers
    - Use the emails and passwords specified in the README
*/

-- Add more sample counsellors (these don't require user_id since they're just sample data)
INSERT INTO counsellors (
  full_name,
  title,
  specialties,
  experience_years,
  rating,
  total_reviews,
  location,
  languages,
  bio,
  education,
  hourly_rate,
  is_available
) VALUES 
(
  'Dr. Lisa Rodriguez',
  'Licensed Clinical Psychologist',
  ARRAY['Anxiety', 'Depression', 'Trauma', 'PTSD'],
  10,
  4.8,
  156,
  'San Francisco, CA',
  ARRAY['English', 'Spanish'],
  'Dr. Rodriguez specializes in trauma-informed care and PTSD treatment using EMDR and cognitive processing therapy.',
  ARRAY['Ph.D. in Clinical Psychology - Stanford University', 'EMDR Certification'],
  160.00,
  true
),
(
  'Dr. David Kim',
  'Licensed Professional Counselor',
  ARRAY['Addiction Recovery', 'Group Therapy', 'Motivational Interviewing'],
  14,
  4.9,
  234,
  'Seattle, WA',
  ARRAY['English', 'Korean'],
  'Dr. Kim has extensive experience in addiction recovery and leads both individual and group therapy sessions.',
  ARRAY['M.A. in Counseling Psychology - University of Washington', 'Addiction Counselor Certification'],
  145.00,
  true
) ON CONFLICT DO NOTHING;

-- Add more sample blog posts
INSERT INTO blog_posts (
  title,
  slug,
  excerpt,
  content,
  category,
  tags,
  is_published,
  is_featured,
  read_time_minutes,
  published_at
) VALUES 
(
  'Managing Stress During Life Transitions',
  'managing-stress-life-transitions',
  'Learn effective strategies for coping with stress during major life changes and transitions.',
  'Life transitions, whether positive or negative, can be significant sources of stress. This article explores evidence-based strategies for managing stress during these challenging periods...',
  'Stress Management',
  ARRAY['stress', 'life transitions', 'coping strategies'],
  true,
  false,
  9,
  now() - interval '2 days'
),
(
  'The Benefits of Group Therapy',
  'benefits-group-therapy',
  'Discover how group therapy can provide unique benefits and support for mental health recovery.',
  'Group therapy offers a unique therapeutic environment where individuals can connect with others facing similar challenges. This article explores the many benefits of group therapy...',
  'Therapy',
  ARRAY['group therapy', 'support', 'community'],
  true,
  false,
  7,
  now() - interval '4 days'
) ON CONFLICT (slug) DO NOTHING;

-- Add more sample articles
INSERT INTO articles (
  title,
  slug,
  description,
  content,
  category,
  difficulty_level,
  read_time_minutes,
  tags,
  is_published
) VALUES 
(
  'Creating a Self-Care Routine',
  'creating-self-care-routine',
  'Step-by-step guide to building a sustainable self-care routine that fits your lifestyle.',
  'Self-care is essential for maintaining mental health and well-being. This guide will help you create a personalized self-care routine...',
  'Self-Care',
  'beginner',
  8,
  ARRAY['self-care', 'routine', 'wellness'],
  true
),
(
  'Understanding Cognitive Behavioral Therapy',
  'understanding-cognitive-behavioral-therapy',
  'Learn about CBT techniques and how they can help with various mental health conditions.',
  'Cognitive Behavioral Therapy (CBT) is one of the most effective forms of psychotherapy. This article explains the core principles and techniques...',
  'Therapy Techniques',
  'intermediate',
  15,
  ARRAY['CBT', 'therapy', 'mental health'],
  true
) ON CONFLICT (slug) DO NOTHING;

-- Add more sample resources
INSERT INTO resources (
  title,
  description,
  category,
  resource_type,
  file_size_mb,
  download_count,
  tags
) VALUES 
(
  'Stress Management Techniques Guide',
  'Comprehensive guide with practical stress management techniques for daily use.',
  'Guides',
  'pdf',
  4.2,
  2100,
  ARRAY['stress management', 'techniques', 'wellness']
),
(
  'Progressive Muscle Relaxation Audio',
  'Guided progressive muscle relaxation session for deep relaxation and stress relief.',
  'Meditations',
  'audio',
  18.5,
  1650,
  ARRAY['relaxation', 'muscle tension', 'stress relief']
),
(
  'Cognitive Restructuring Worksheet',
  'Printable worksheet for practicing cognitive restructuring techniques.',
  'Worksheets',
  'pdf',
  0.8,
  2800,
  ARRAY['CBT', 'cognitive restructuring', 'thought patterns']
) ON CONFLICT DO NOTHING;

-- Add more sample testimonials
INSERT INTO testimonials (
  rating,
  title,
  content,
  is_anonymous,
  is_approved,
  is_featured
) VALUES 
(
  5,
  'Professional and caring',
  'The counsellors at U-Recover are incredibly professional and caring. I felt heard and supported throughout my journey.',
  true,
  true,
  false
),
(
  5,
  'Convenient and effective',
  'Online therapy through U-Recover has been so convenient and effective. I can access help when I need it most.',
  true,
  true,
  true
),
(
  4,
  'Great resources',
  'The platform offers excellent resources and tools that complement the therapy sessions perfectly.',
  true,
  true,
  false
) ON CONFLICT DO NOTHING;

-- Create a function to handle profile creation when auth users are created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, is_first_login)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'role', 'user'),
    true
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Add role column to profiles if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role text DEFAULT 'user';
    ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
      CHECK (role IN ('user', 'counsellor', 'admin'));
  END IF;
END $$;

-- Add is_first_login column to profiles if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'is_first_login'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_first_login boolean DEFAULT true;
  END IF;
END $$;