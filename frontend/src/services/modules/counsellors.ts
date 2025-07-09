import { apiService } from '../api.js';

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
  hourly_rate?: number;
  avatar_url?: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export const counsellorsApi = {
  async getAll(): Promise<Counsellor[]> {
    return apiService.get('/counsellors');
  },

  async getById(id: string): Promise<Counsellor> {
    return apiService.get(`/counsellors/${id}`);
  },

  async getAvailable(): Promise<Counsellor[]> {
    return apiService.get('/counsellors?available=true');
  },

  async searchBySpecialty(specialty: string): Promise<Counsellor[]> {
    return apiService.get(`/counsellors?specialty=${encodeURIComponent(specialty)}`);
  },

  async updateProfile(id: string, updates: Partial<Counsellor>): Promise<Counsellor> {
    return apiService.put(`/counsellors/${id}`, updates);
  },
};