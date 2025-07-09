import { apiService } from '../api.js';

export interface Testimonial {
  id: string;
  user_id?: string;
  counsellor_id?: string;
  rating: number;
  title?: string;
  content: string;
  is_anonymous: boolean;
  is_approved: boolean;
  is_featured: boolean;
  created_at: string;
}

export interface CreateTestimonialData {
  counsellor_id?: string;
  rating: number;
  title?: string;
  content: string;
  is_anonymous?: boolean;
}

export const testimonialsApi = {
  async getAll(): Promise<Testimonial[]> {
    return apiService.get('/testimonials');
  },

  async getApproved(): Promise<Testimonial[]> {
    return apiService.get('/testimonials?approved=true');
  },

  async getFeatured(): Promise<Testimonial[]> {
    return apiService.get('/testimonials?featured=true');
  },

  async getById(id: string): Promise<Testimonial> {
    return apiService.get(`/testimonials/${id}`);
  },

  async getByCounsellor(counsellorId: string): Promise<Testimonial[]> {
    return apiService.get(`/testimonials?counsellor_id=${counsellorId}`);
  },

  async create(data: CreateTestimonialData): Promise<Testimonial> {
    return apiService.post('/testimonials', data);
  },

  async update(id: string, updates: Partial<Testimonial>): Promise<Testimonial> {
    return apiService.put(`/testimonials/${id}`, updates);
  },

  async delete(id: string): Promise<void> {
    return apiService.delete(`/testimonials/${id}`);
  },

  async approve(id: string): Promise<Testimonial> {
    return apiService.patch(`/testimonials/${id}/approve`);
  },

  async reject(id: string): Promise<Testimonial> {
    return apiService.patch(`/testimonials/${id}/reject`);
  },

  async feature(id: string): Promise<Testimonial> {
    return apiService.patch(`/testimonials/${id}/feature`);
  },

  async unfeature(id: string): Promise<Testimonial> {
    return apiService.patch(`/testimonials/${id}/unfeature`);
  },
};