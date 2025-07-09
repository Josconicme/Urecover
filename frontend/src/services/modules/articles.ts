import api from '../api.js';

export interface Article {
  id: string;
  title: string;
  slug: string;
  description?: string;
  content: string;
  category: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  read_time_minutes: number;
  tags: string[];
  is_published: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateArticleData {
  title: string;
  slug: string;
  description?: string;
  content: string;
  category: string;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  read_time_minutes?: number;
  tags?: string[];
}

export const articlesApi = {
  async getAll(): Promise<Article[]> {
    return api.get('/articles');
  },

  async getPublished(): Promise<Article[]> {
    return api.get('/articles?published=true');
  },

  async getById(id: string): Promise<Article> {
    return api.get(`/articles/${id}`);
  },

  async getBySlug(slug: string): Promise<Article> {
    return api.get(`/articles/slug/${slug}`);
  },

  async getByCategory(category: string): Promise<Article[]> {
    return api.get(`/articles?category=${encodeURIComponent(category)}`);
  },

  async getByDifficulty(level: string): Promise<Article[]> {
    return api.get(`/articles?difficulty=${level}`);
  },

  async create(data: CreateArticleData): Promise<Article> {
    return api.post('/articles', data);
  },

  async update(id: string, updates: Partial<Article>): Promise<Article> {
    return api.put(`/articles/${id}`, updates);
  },

  async delete(id: string): Promise<void> {
    return api.delete(`/articles/${id}`);
  },

  async publish(id: string): Promise<Article> {
    return api.patch(`/articles/${id}/publish`);
  },

  async unpublish(id: string): Promise<Article> {
    return api.patch(`/articles/${id}/unpublish`);
  },

  async incrementViews(id: string): Promise<void> {
    return api.patch(`/articles/${id}/views`);
  },
};