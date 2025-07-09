import api from '../api.js';
import { Resource } from '../../types';

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
    return api.get<Resource[]>('/resources');
  },

  async getById(id: string): Promise<Resource> {
    return api.get(`/resources/${id}`);
  },

  async getByCategory(category: string): Promise<Resource[]> {
    return api.get(`/resources?category=${encodeURIComponent(category)}`);
  },

  async getByType(type: string): Promise<Resource[]> {
    return api.get(`/resources?type=${type}`);
  },

  async getFree(): Promise<Resource[]> {
    return api.get('/resources?premium=false');
  },

  async getPremium(): Promise<Resource[]> {
    return api.get('/resources?premium=true');
  },

  async create(data: CreateResourceData): Promise<Resource> {
    return api.post('/resources', data);
  },

  async update(id: string, updates: Partial<Resource>): Promise<Resource> {
    return api.put(`/resources/${id}`, updates);
  },

  async delete(id: string): Promise<void> {
    return api.delete(`/resources/${id}`);
  },

  async download(id: string): Promise<void> {
    return api.patch(`/resources/${id}/download`);
  },

  async uploadFile(id: string, file: File): Promise<Resource> {
    return api.uploadFile(`/resources/${id}/upload`, file);
  },
};