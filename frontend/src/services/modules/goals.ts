import { apiService } from '../api.js';

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

export interface CreateGoalData {
  title: string;
  description?: string;
  category?: string;
  target_value?: number;
  current_value?: number;
  unit?: string;
  target_date?: string;
}

export const goalsApi = {
  async getAll(): Promise<Goal[]> {
    return apiService.get('/goals');
  },

  async getActive(): Promise<Goal[]> {
    return apiService.get('/goals?completed=false');
  },

  async getCompleted(): Promise<Goal[]> {
    return apiService.get('/goals?completed=true');
  },

  async getById(id: string): Promise<Goal> {
    return apiService.get(`/goals/${id}`);
  },

  async create(data: CreateGoalData): Promise<Goal> {
    return apiService.post('/goals', data);
  },

  async update(id: string, updates: Partial<Goal>): Promise<Goal> {
    return apiService.put(`/goals/${id}`, updates);
  },

  async updateProgress(id: string, currentValue: number): Promise<Goal> {
    return apiService.patch(`/goals/${id}/progress`, { current_value: currentValue });
  },

  async markCompleted(id: string): Promise<Goal> {
    return apiService.patch(`/goals/${id}/complete`);
  },

  async markIncomplete(id: string): Promise<Goal> {
    return apiService.patch(`/goals/${id}/incomplete`);
  },

  async delete(id: string): Promise<void> {
    return apiService.delete(`/goals/${id}`);
  },

  async getStats(): Promise<any> {
    return apiService.get('/goals/stats');
  },
};