/*
  # Seed Sample Data for U-Recover Platform

  1. Sample Data
    - Counsellors with realistic profiles
    - Blog posts and articles
    - Resources for download
    - Sample testimonials
*/

-- Insert sample counsellors
INSERT INTO counsellors (
  full_name, title, specialties, experience_years, rating, total_reviews, 
  location, languages, bio, education, hourly_rate, is_available
) VALUES 
(
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
  120.00,
  true
),
(
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
  140.00,
  true
),
(
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
  135.00,
  true
),
(
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
  110.00,
  true
);

-- Insert sample blog posts
INSERT INTO blog_posts (
  title, slug, excerpt, content, category, tags, is_published, is_featured, 
  read_time_minutes, published_at
) VALUES 
(
  'Understanding Anxiety: A Comprehensive Guide',
  'understanding-anxiety-comprehensive-guide',
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
  'power-of-mindfulness-daily-life',
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
  'building-healthy-relationships',
  'Explore the foundations of healthy relationships and learn communication skills that strengthen your connections with others.',
  'Healthy relationships are fundamental to our well-being and happiness. Whether it''s with family, friends, or romantic partners, the quality of our relationships significantly impacts our mental health...',
  'Relationships',
  ARRAY['relationships', 'communication', 'social health'],
  true,
  false,
  10,
  now() - interval '7 days'
);

-- Insert sample articles
INSERT INTO articles (
  title, slug, description, content, category, difficulty_level, 
  read_time_minutes, tags, is_published
) VALUES 
(
  '10 Signs You Might Need Professional Help',
  '10-signs-need-professional-help',
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
  'breathing-techniques-anxiety-relief',
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
  'understanding-depression-myths-facts',
  'Debunking common misconceptions about depression and providing factual information.',
  'Depression is often misunderstood. Let''s separate myths from facts to better understand this common mental health condition...',
  'Mental Health Education',
  'intermediate',
  12,
  ARRAY['depression', 'education', 'awareness'],
  true
);

-- Insert sample resources
INSERT INTO resources (
  title, description, category, resource_type, file_size_mb, 
  download_count, tags
) VALUES 
(
  'Anxiety Management Workbook',
  'A comprehensive workbook with exercises and techniques for managing anxiety.',
  'Workbooks',
  'pdf',
  2.5,
  1250,
  ARRAY['anxiety', 'workbook', 'exercises']
),
(
  'Guided Meditation: Stress Relief',
  '20-minute guided meditation session for stress relief and relaxation.',
  'Meditations',
  'audio',
  15.0,
  890,
  ARRAY['meditation', 'stress relief', 'relaxation']
),
(
  'Daily Mood Tracker',
  'Printable mood tracking sheet to monitor your emotional well-being daily.',
  'Tools',
  'pdf',
  1.2,
  3200,
  ARRAY['mood tracking', 'wellness', 'self-monitoring']
),
(
  'Sleep Hygiene Guide',
  'Complete guide to improving sleep quality for better mental health.',
  'Guides',
  'pdf',
  3.1,
  1800,
  ARRAY['sleep', 'wellness', 'mental health']
);

-- Insert sample testimonials
INSERT INTO testimonials (
  rating, title, content, is_anonymous, is_approved, is_featured
) VALUES 
(
  5,
  'Life-changing experience',
  'U-Recover has been a game-changer for my mental health journey. The counsellors are incredibly supportive and understanding.',
  true,
  true,
  true
),
(
  5,
  'Highly recommend',
  'The convenience of online sessions combined with professional care has made therapy accessible for me. Highly recommend!',
  true,
  true,
  false
),
(
  4,
  'Great platform',
  'Great platform with caring professionals. The resources and articles have been very helpful in my recovery process.',
  true,
  true,
  false
),
(
  5,
  'Comfortable and supported',
  'I was hesitant about online therapy, but U-Recover made me feel comfortable and supported throughout my journey.',
  true,
  true,
  false
);