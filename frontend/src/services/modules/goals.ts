import api from '../api.js';

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
    return api.get('/goals');
  },

  async getActive(): Promise<Goal[]> {
    return api.get('/goals?completed=false');
  },

  async getCompleted(): Promise<Goal[]> {
    return api.get('/goals?completed=true');
  },

  async getById(id: string): Promise<Goal> {
    return api.get(`/goals/${id}`);
  },

  async create(data: CreateGoalData): Promise<Goal> {
    return api.post('/goals', data);
  },

  async update(id: string, updates: Partial<Goal>): Promise<Goal> {
    return api.put(`/goals/${id}`, updates);
  },

  async updateProgress(id: string, currentValue: number): Promise<Goal> {
    return api.patch(`/goals/${id}/progress`, { current_value: currentValue });
  },

  async complete(id: string): Promise<Goal> {
    return api.patch(`/goals/${id}/complete`);
  },

  async incomplete(id: string): Promise<Goal> {
    return api.patch(`/goals/${id}/incomplete`);
  },

  async delete(id: string): Promise<void> {
    return api.delete(`/goals/${id}`);
  },

  async getStats(): Promise<any> {
    return api.get('/goals/stats');
  },
};