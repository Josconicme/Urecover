import api from '../api.js';
import { Counsellor, PaginatedResponse } from '../../types';

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
    return api.get('/counsellors');
  },

  async getById(id: string): Promise<Counsellor> {
    return api.get(`/counsellors/${id}`);
  },

  async getAvailable(): Promise<Counsellor[]> {
    return api.get('/counsellors?available=true');
  },

  async searchBySpecialty(specialty: string): Promise<Counsellor[]> {
    return api.get(`/counsellors?specialty=${encodeURIComponent(specialty)}`);
  },

  async updateProfile(id: string, updates: Partial<Counsellor>): Promise<Counsellor> {
    return api.put(`/counsellors/${id}`, updates);
  },
};

export const getCounsellors = async (params: { page?: number; limit?: number }): Promise<PaginatedResponse<Counsellor>> => {
  return api.get<PaginatedResponse<Counsellor>>('/counsellors', { params });
};