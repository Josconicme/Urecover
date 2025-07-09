import api from '../api.js';
import { WellnessEntry } from '../../types';

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

export interface CreateWellnessEntryData {
  entry_date: string;
  mood_score?: number;
  wellness_score?: number;
  anxiety_level?: number;
  sleep_hours?: number;
  exercise_minutes?: number;
  meditation_minutes?: number;
  notes?: string;
}

export const wellnessApi = {
  async getAll(): Promise<WellnessEntry[]> {
    return api.get<WellnessEntry[]>('/wellness');
  },

  async getById(id: string): Promise<WellnessEntry> {
    return api.get<WellnessEntry>(`/wellness/${id}`);
  },

  async create(data: CreateWellnessEntryData): Promise<WellnessEntry> {
    return api.post<WellnessEntry>('/wellness', data);
  },

  async update(id: string, updates: Partial<WellnessEntry>): Promise<WellnessEntry> {
    return api.put<WellnessEntry>(`/wellness/${id}`, updates);
  },

  async delete(id: string): Promise<void> {
    return api.delete(`/wellness/${id}`);
  },

  async getByDateRange(startDate: string, endDate: string): Promise<WellnessEntry[]> {
    return api.get<WellnessEntry[]>(`/wellness?start_date=${startDate}&end_date=${endDate}`);
  },

  async getStats(): Promise<any> {
    return api.get('/wellness/stats');
  },
};