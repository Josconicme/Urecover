import { apiService } from '../api.js';

export interface BlogPost {
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

export interface CreateBlogPostData {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category: string;
  tags?: string[];
  featured_image_url?: string;
  is_featured?: boolean;
}

export const blogsApi = {
  async getAll(): Promise<BlogPost[]> {
    return apiService.get('/blogs');
  },

  async getPublished(): Promise<BlogPost[]> {
    return apiService.get('/blogs?published=true');
  },

  async getFeatured(): Promise<BlogPost[]> {
    return apiService.get('/blogs?featured=true');
  },

  async getById(id: string): Promise<BlogPost> {
    return apiService.get(`/blogs/${id}`);
  },

  async getBySlug(slug: string): Promise<BlogPost> {
    return apiService.get(`/blogs/slug/${slug}`);
  },

  async create(data: CreateBlogPostData): Promise<BlogPost> {
    return apiService.post('/blogs', data);
  },

  async update(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
    return apiService.put(`/blogs/${id}`, updates);
  },

  async delete(id: string): Promise<void> {
    return apiService.delete(`/blogs/${id}`);
  },

  async publish(id: string): Promise<BlogPost> {
    return apiService.patch(`/blogs/${id}/publish`);
  },

  async unpublish(id: string): Promise<BlogPost> {
    return apiService.patch(`/blogs/${id}/unpublish`);
  },

  async incrementViews(id: string): Promise<void> {
    return apiService.patch(`/blogs/${id}/views`);
  },
};