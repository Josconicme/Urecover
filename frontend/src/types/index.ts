// Authentication types
export interface User {
  id: string;
  email: string;
  role: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  location?: string;
  emergency_contact?: any;
  preferences?: any;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthPayload {
  email: string;
  password: string;
  fullName?: string;
}

export interface UserProfile {
  user: User;
  session: {
    access_token: string;
    refresh_token: string;
  };
}

// Counsellor types
export interface Counsellor {
  id: string;
  user_id?: string;
  full_name: string;
  title: string;
  specialties: string[];
  experience_years: number;
  rating: number;
  total_reviews: number;
  location?: string;
  languages: string[];
  bio?: string;
  education?: string[];
  certifications?: string[];
  hourly_rate?: number;
  avatar_url?: string;
  is_available: boolean;
  availability?: any;
  created_at: string;
  updated_at: string;
}

// Appointment types
export interface Appointment {
  id: string;
  user_id: string;
  counsellor_id: string;
  appointment_date: string;
  duration_minutes: number;
  session_type: 'video' | 'audio' | 'chat' | 'in-person';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  meeting_url?: string;
  created_at: string;
  updated_at: string;
  counsellors?: Counsellor;
}

// Wellness types
export interface WellnessEntry {
  id: string;
  user_id: string;
  entry_date: string;
  mood_score?: number;
  wellness_score?: number;
  anxiety_level?: number;
  sleep_hours?: number;
  exercise_minutes: number;
  meditation_minutes: number;
  notes?: string;
  created_at: string;
}

// Blog types
export interface Blog {
  id: string;
  author_id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category: string;
  tags: string[];
  featured_image_url?: string;
  is_published: boolean;
  is_featured: boolean;
  read_time_minutes: number;
  views_count: number;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

// Resource types
export interface Resource {
  id: string;
  title: string;
  description?: string;
  category: string;
  resource_type: 'pdf' | 'audio' | 'video' | 'worksheet' | 'guide';
  file_url?: string;
  file_size_mb?: number;
  download_count: number;
  is_premium: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

// API Response types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Message types
export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  message_type: 'text' | 'image' | 'file' | 'system';
  is_read: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  last_message?: Message;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

// Notification types
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'appointment' | 'message' | 'wellness' | 'system' | 'reminder';
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

// Goal types
export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category?: string;
  target_value?: number;
  current_value: number;
  unit?: string;
  target_date?: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

// Testimonial types
export interface Testimonial {
  id: string;
  user_id?: string;
  counsellor_id?: string;
  rating: number;
  title?: string;
  content: string;
  is_anonymous: boolean;
  is_approved: boolean;
  is_featured: boolean;
  created_at: string;
}

// Session types
export interface Session {
  id: string;
  appointment_id: string;
  user_id: string;
  counsellor_id: string;
  session_date: string;
  duration_minutes: number;
  session_type: string;
  notes?: string;
  homework?: string;
  next_session_goals?: string;
  created_at: string;
  updated_at: string;
}