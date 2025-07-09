/*
  # Update Sample Data for Non-Profit U-Recover Platform

  1. Sample Data Updates
    - Update counsellors to remove hourly rates (non-profit)
    - Update testimonials to reflect free service
    - Add new blog posts, articles, and resources
    - Handle existing data gracefully

  2. Conflict Resolution
    - Use proper unique constraints for conflict handling
    - Update existing records where appropriate
    - Insert new records where they don't exist
*/

-- Insert sample counsellors (updated for non-profit - no hourly rates)
-- Note: counsellors table doesn't have unique constraint on full_name, so we'll use INSERT with conditional logic
DO $$
BEGIN
  -- Dr. Sarah Johnson
  IF NOT EXISTS (SELECT 1 FROM counsellors WHERE full_name = 'Dr. Sarah Johnson') THEN
    INSERT INTO counsellors (
      full_name, title, specialties, experience_years, rating, total_reviews, 
      location, languages, bio, education, is_available
    ) VALUES (
      'Dr. Sarah Johnson',
      'Licensed Clinical Psychologist',
      ARRAY['Anxiety Disorders', 'Depression', 'Trauma Therapy'],
      8,
      4.9,
      127,
      'New York, NY',
      ARRAY['English', 'Spanish'],
      'Dr. Johnson specializes in cognitive-behavioral therapy and has extensive experience helping clients overcome anxiety and depression.',
      ARRAY['PhD in Clinical Psychology - Columbia University', 'MA in Psychology - NYU'],
      true
    );
  ELSE
    UPDATE counsellors SET
      title = 'Licensed Clinical Psychologist',
      specialties = ARRAY['Anxiety Disorders', 'Depression', 'Trauma Therapy'],
      experience_years = 8,
      rating = 4.9,
      total_reviews = 127,
      location = 'New York, NY',
      languages = ARRAY['English', 'Spanish'],
      bio = 'Dr. Johnson specializes in cognitive-behavioral therapy and has extensive experience helping clients overcome anxiety and depression.',
      education = ARRAY['PhD in Clinical Psychology - Columbia University', 'MA in Psychology - NYU'],
      is_available = true,
      hourly_rate = NULL,
      updated_at = now()
    WHERE full_name = 'Dr. Sarah Johnson';
  END IF;

  -- Dr. Michael Chen
  IF NOT EXISTS (SELECT 1 FROM counsellors WHERE full_name = 'Dr. Michael Chen') THEN
    INSERT INTO counsellors (
      full_name, title, specialties, experience_years, rating, total_reviews, 
      location, languages, bio, education, is_available
    ) VALUES (
      'Dr. Michael Chen',
      'Marriage & Family Therapist',
      ARRAY['Couples Therapy', 'Family Counseling', 'Relationship Issues'],
      12,
      4.8,
      203,
      'Los Angeles, CA',
      ARRAY['English', 'Mandarin'],
      'Dr. Chen focuses on helping couples and families build stronger relationships through effective communication and conflict resolution.',
      ARRAY['PhD in Marriage & Family Therapy - UCLA', 'MS in Counseling Psychology - USC'],
      true
    );
  ELSE
    UPDATE counsellors SET
      title = 'Marriage & Family Therapist',
      specialties = ARRAY['Couples Therapy', 'Family Counseling', 'Relationship Issues'],
      experience_years = 12,
      rating = 4.8,
      total_reviews = 203,
      location = 'Los Angeles, CA',
      languages = ARRAY['English', 'Mandarin'],
      bio = 'Dr. Chen focuses on helping couples and families build stronger relationships through effective communication and conflict resolution.',
      education = ARRAY['PhD in Marriage & Family Therapy - UCLA', 'MS in Counseling Psychology - USC'],
      is_available = true,
      hourly_rate = NULL,
      updated_at = now()
    WHERE full_name = 'Dr. Michael Chen';
  END IF;

  -- Dr. Emily Davis
  IF NOT EXISTS (SELECT 1 FROM counsellors WHERE full_name = 'Dr. Emily Davis') THEN
    INSERT INTO counsellors (
      full_name, title, specialties, experience_years, rating, total_reviews, 
      location, languages, bio, education, is_available
    ) VALUES (
      'Dr. Emily Davis',
      'Trauma Specialist',
      ARRAY['PTSD', 'Trauma Recovery', 'EMDR Therapy'],
      10,
      4.9,
      156,
      'Chicago, IL',
      ARRAY['English'],
      'Dr. Davis is certified in EMDR therapy and specializes in helping clients heal from traumatic experiences and PTSD.',
      ARRAY['PhD in Clinical Psychology - Northwestern', 'EMDR Certification - EMDR Institute'],
      true
    );
  ELSE
    UPDATE counsellors SET
      title = 'Trauma Specialist',
      specialties = ARRAY['PTSD', 'Trauma Recovery', 'EMDR Therapy'],
      experience_years = 10,
      rating = 4.9,
      total_reviews = 156,
      location = 'Chicago, IL',
      languages = ARRAY['English'],
      bio = 'Dr. Davis is certified in EMDR therapy and specializes in helping clients heal from traumatic experiences and PTSD.',
      education = ARRAY['PhD in Clinical Psychology - Northwestern', 'EMDR Certification - EMDR Institute'],
      is_available = true,
      hourly_rate = NULL,
      updated_at = now()
    WHERE full_name = 'Dr. Emily Davis';
  END IF;

  -- Dr. James Wilson
  IF NOT EXISTS (SELECT 1 FROM counsellors WHERE full_name = 'Dr. James Wilson') THEN
    INSERT INTO counsellors (
      full_name, title, specialties, experience_years, rating, total_reviews, 
      location, languages, bio, education, is_available
    ) VALUES (
      'Dr. James Wilson',
      'Addiction Counselor',
      ARRAY['Substance Abuse', 'Addiction Recovery', 'Behavioral Addictions'],
      15,
      4.7,
      89,
      'Miami, FL',
      ARRAY['English', 'Portuguese'],
      'Dr. Wilson has over 15 years of experience in addiction counseling and helps clients achieve lasting recovery.',
      ARRAY['PhD in Addiction Psychology - University of Miami', 'Certified Addiction Counselor'],
      true
    );
  ELSE
    UPDATE counsellors SET
      title = 'Addiction Counselor',
      specialties = ARRAY['Substance Abuse', 'Addiction Recovery', 'Behavioral Addictions'],
      experience_years = 15,
      rating = 4.7,
      total_reviews = 89,
      location = 'Miami, FL',
      languages = ARRAY['English', 'Portuguese'],
      bio = 'Dr. Wilson has over 15 years of experience in addiction counseling and helps clients achieve lasting recovery.',
      education = ARRAY['PhD in Addiction Psychology - University of Miami', 'Certified Addiction Counselor'],
      is_available = true,
      hourly_rate = NULL,
      updated_at = now()
    WHERE full_name = 'Dr. James Wilson';
  END IF;
END $$;

-- Insert sample blog posts (using unique slug constraint)
INSERT INTO blog_posts (
  title, slug, excerpt, content, category, tags, is_published, is_featured, 
  read_time_minutes, published_at
) VALUES 
(
  'Understanding Anxiety: A Comprehensive Guide',
  'understanding-anxiety-comprehensive-guide-v2',
  'Learn about the different types of anxiety disorders and effective coping strategies that can help you manage symptoms in daily life.',
  'Anxiety is one of the most common mental health conditions, affecting millions of people worldwide. In this comprehensive guide, we''ll explore the different types of anxiety disorders, their symptoms, and evidence-based treatment approaches...',
  'Mental Health',
  ARRAY['anxiety', 'mental health', 'coping strategies'],
  true,
  true,
  8,
  now() - interval '3 days'
),
(
  'The Power of Mindfulness in Daily Life',
  'power-of-mindfulness-daily-life-v2',
  'Discover how incorporating mindfulness practices into your routine can improve mental clarity and emotional well-being.',
  'Mindfulness has gained significant attention in recent years as a powerful tool for mental health and well-being. This ancient practice, rooted in Buddhist tradition, has been adapted for modern therapeutic use...',
  'Mindfulness',
  ARRAY['mindfulness', 'meditation', 'wellness'],
  true,
  false,
  6,
  now() - interval '5 days'
),
(
  'Building Healthy Relationships',
  'building-healthy-relationships-v2',
  'Explore the foundations of healthy relationships and learn communication skills that strengthen your connections with others.',
  'Healthy relationships are fundamental to our well-being and happiness. Whether it''s with family, friends, or romantic partners, the quality of our relationships significantly impacts our mental health...',
  'Relationships',
  ARRAY['relationships', 'communication', 'social health'],
  true,
  false,
  10,
  now() - interval '7 days'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  is_published = EXCLUDED.is_published,
  is_featured = EXCLUDED.is_featured,
  read_time_minutes = EXCLUDED.read_time_minutes,
  published_at = EXCLUDED.published_at,
  updated_at = now();

-- Insert sample articles (using unique slug constraint)
INSERT INTO articles (
  title, slug, description, content, category, difficulty_level, 
  read_time_minutes, tags, is_published
) VALUES 
(
  '10 Signs You Might Need Professional Help',
  '10-signs-need-professional-help-v2',
  'Learn to recognize when it''s time to seek professional mental health support.',
  'Recognizing when to seek professional help is crucial for mental health. Here are 10 key signs that indicate it might be time to reach out to a mental health professional...',
  'Mental Health Awareness',
  'beginner',
  5,
  ARRAY['mental health', 'therapy', 'self-awareness'],
  true
),
(
  'Breathing Techniques for Anxiety Relief',
  'breathing-techniques-anxiety-relief-v2',
  'Simple breathing exercises you can use anywhere to manage anxiety symptoms.',
  'Breathing techniques are powerful tools for managing anxiety. These simple exercises can be done anywhere and provide immediate relief from anxiety symptoms...',
  'Coping Strategies',
  'beginner',
  7,
  ARRAY['anxiety', 'breathing', 'coping'],
  true
),
(
  'Understanding Depression: Myths vs Facts',
  'understanding-depression-myths-facts-v2',
  'Debunking common misconceptions about depression and providing factual information.',
  'Depression is often misunderstood. Let''s separate myths from facts to better understand this common mental health condition...',
  'Mental Health Education',
  'intermediate',
  12,
  ARRAY['depression', 'education', 'awareness'],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
  category = EXCLUDED.category,
  difficulty_level = EXCLUDED.difficulty_level,
  read_time_minutes = EXCLUDED.read_time_minutes,
  tags = EXCLUDED.tags,
  is_published = EXCLUDED.is_published,
  updated_at = now();

-- Insert sample resources (no unique constraint, use conditional logic)
DO $$
BEGIN
  -- Anxiety Management Workbook
  IF NOT EXISTS (SELECT 1 FROM resources WHERE title = 'Anxiety Management Workbook') THEN
    INSERT INTO resources (
      title, description, category, resource_type, file_size_mb, 
      download_count, tags
    ) VALUES (
      'Anxiety Management Workbook',
      'A comprehensive workbook with exercises and techniques for managing anxiety.',
      'Workbooks',
      'pdf',
      2.5,
      1250,
      ARRAY['anxiety', 'workbook', 'exercises']
    );
  END IF;

  -- Guided Meditation: Stress Relief
  IF NOT EXISTS (SELECT 1 FROM resources WHERE title = 'Guided Meditation: Stress Relief') THEN
    INSERT INTO resources (
      title, description, category, resource_type, file_size_mb, 
      download_count, tags
    ) VALUES (
      'Guided Meditation: Stress Relief',
      '20-minute guided meditation session for stress relief and relaxation.',
      'Meditations',
      'audio',
      15.0,
      890,
      ARRAY['meditation', 'stress relief', 'relaxation']
    );
  END IF;

  -- Daily Mood Tracker
  IF NOT EXISTS (SELECT 1 FROM resources WHERE title = 'Daily Mood Tracker') THEN
    INSERT INTO resources (
      title, description, category, resource_type, file_size_mb, 
      download_count, tags
    ) VALUES (
      'Daily Mood Tracker',
      'Printable mood tracking sheet to monitor your emotional well-being daily.',
      'Tools',
      'pdf',
      1.2,
      3200,
      ARRAY['mood tracking', 'wellness', 'self-monitoring']
    );
  END IF;

  -- Sleep Hygiene Guide
  IF NOT EXISTS (SELECT 1 FROM resources WHERE title = 'Sleep Hygiene Guide') THEN
    INSERT INTO resources (
      title, description, category, resource_type, file_size_mb, 
      download_count, tags
    ) VALUES (
      'Sleep Hygiene Guide',
      'Complete guide to improving sleep quality for better mental health.',
      'Guides',
      'pdf',
      3.1,
      1800,
      ARRAY['sleep', 'wellness', 'mental health']
    );
  END IF;
END $$;

-- Insert sample testimonials (no unique constraint, use conditional logic)
DO $$
BEGIN
  -- Life-changing and completely free
  IF NOT EXISTS (SELECT 1 FROM testimonials WHERE content LIKE '%couldn''t afford therapy%') THEN
    INSERT INTO testimonials (
      rating, title, content, is_anonymous, is_approved, is_featured
    ) VALUES (
      5,
      'Life-changing and completely free',
      'U-Recover has been a game-changer for my mental health journey. I couldn''t afford therapy, but this non-profit made it possible for me to get the help I needed.',
      true,
      true,
      true
    );
  END IF;

  -- Amazing that it's free
  IF NOT EXISTS (SELECT 1 FROM testimonials WHERE content LIKE '%all for free%') THEN
    INSERT INTO testimonials (
      rating, title, content, is_anonymous, is_approved, is_featured
    ) VALUES (
      5,
      'Amazing that it''s free',
      'The convenience of online sessions combined with professional care, all for free! This organization is truly making mental health accessible to everyone.',
      true,
      true,
      false
    );
  END IF;

  -- Great platform, no cost
  IF NOT EXISTS (SELECT 1 FROM testimonials WHERE content LIKE '%everything is free%') THEN
    INSERT INTO testimonials (
      rating, title, content, is_anonymous, is_approved, is_featured
    ) VALUES (
      4,
      'Great platform, no cost',
      'Great platform with caring professionals. The resources and articles have been very helpful, and I love that everything is free.',
      true,
      true,
      false
    );
  END IF;

  -- Free support when I needed it most
  IF NOT EXISTS (SELECT 1 FROM testimonials WHERE content LIKE '%completely free made it accessible%') THEN
    INSERT INTO testimonials (
      rating, title, content, is_anonymous, is_approved, is_featured
    ) VALUES (
      5,
      'Free support when I needed it most',
      'I was hesitant about online therapy, but U-Recover made me feel comfortable and supported. The fact that it''s completely free made it accessible when I had no other options.',
      true,
      true,
      false
    );
  END IF;
END $$;