import { apiService } from '../api.js';

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

export interface CreateResourceData {
  title: string;
  description?: string;
  category: string;
  resource_type: 'pdf' | 'audio' | 'video' | 'worksheet' | 'guide';
  file_url?: string;
  file_size_mb?: number;
  is_premium?: boolean;
  tags?: string[];
}

export const resourcesApi = {
  async getAll(): Promise<Resource[]> {
    return apiService.get('/resources');
  },

  async getById(id: string): Promise<Resource> {
    return apiService.get(`/resources/${id}`);
  },

  async getByCategory(category: string): Promise<Resource[]> {
    return apiService.get(`/resources?category=${encodeURIComponent(category)}`);
  },

  async getByType(type: string): Promise<Resource[]> {
    return apiService.get(`/resources?type=${type}`);
  },

  async getFree(): Promise<Resource[]> {
    return apiService.get('/resources?premium=false');
  },

  async getPremium(): Promise<Resource[]> {
    return apiService.get('/resources?premium=true');
  },

  async create(data: CreateResourceData): Promise<Resource> {
    return apiService.post('/resources', data);
  },

  async update(id: string, updates: Partial<Resource>): Promise<Resource> {
    return apiService.put(`/resources/${id}`, updates);
  },

  async delete(id: string): Promise<void> {
    return apiService.delete(`/resources/${id}`);
  },

  async download(id: string): Promise<void> {
    return apiService.patch(`/resources/${id}/download`);
  },

  async uploadFile(id: string, file: File): Promise<Resource> {
    return apiService.uploadFile(`/resources/${id}/upload`, file);
  },
};