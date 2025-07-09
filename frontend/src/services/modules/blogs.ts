import api from '../api.js';
import { Blog } from '../../types';

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
    return api.get<BlogPost[]>('/blogs');
  },

  async getPublished(): Promise<BlogPost[]> {
    return api.get<BlogPost[]>('/blogs?published=true');
  },

  async getFeatured(): Promise<BlogPost[]> {
    return api.get<BlogPost[]>('/blogs?featured=true');
  },

  async getById(id: string): Promise<BlogPost> {
    return api.get<BlogPost>(`/blogs/${id}`);
  },

  async getBySlug(slug: string): Promise<BlogPost> {
    return api.get<BlogPost>(`/blogs/slug/${slug}`);
  },

  async create(data: CreateBlogPostData): Promise<BlogPost> {
    return api.post<BlogPost>('/blogs', data);
  },

  async update(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
    return api.put<BlogPost>(`/blogs/${id}`, updates);
  },

  async delete(id: string): Promise<void> {
    return api.delete<void>(`/blogs/${id}`);
  },

  async publish(id: string): Promise<BlogPost> {
    return api.patch<BlogPost>(`/blogs/${id}/publish`);
  },

  async unpublish(id: string): Promise<BlogPost> {
    return api.patch<BlogPost>(`/blogs/${id}/unpublish`);
  },

  async incrementViews(id: string): Promise<void> {
    return api.patch<void>(`/blogs/${id}/views`);
  },
};

export const getBlogs = async (): Promise<Blog[]> => {
  return api.get<Blog[]>('/blogs');
};