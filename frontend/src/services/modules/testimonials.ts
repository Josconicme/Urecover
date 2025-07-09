import api from '../api.js';

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
    return api.get('/testimonials');
  },

  async getApproved(): Promise<Testimonial[]> {
    return api.get('/testimonials?approved=true');
  },

  async getFeatured(): Promise<Testimonial[]> {
    return api.get('/testimonials?featured=true');
  },

  async getById(id: string): Promise<Testimonial> {
    return api.get(`/testimonials/${id}`);
  },

  async getByCounsellor(counsellorId: string): Promise<Testimonial[]> {
    return api.get(`/testimonials?counsellor_id=${counsellorId}`);
  },

  async create(data: CreateTestimonialData): Promise<Testimonial> {
    return api.post('/testimonials', data);
  },

  async update(id: string, updates: Partial<Testimonial>): Promise<Testimonial> {
    return api.put(`/testimonials/${id}`, updates);
  },

  async delete(id: string): Promise<void> {
    return api.delete(`/testimonials/${id}`);
  },

  async approve(id: string): Promise<Testimonial> {
    return api.patch(`/testimonials/${id}/approve`);
  },

  async reject(id: string): Promise<Testimonial> {
    return api.patch(`/testimonials/${id}/reject`);
  },

  async feature(id: string): Promise<Testimonial> {
    return api.patch(`/testimonials/${id}/feature`);
  },

  async unfeature(id: string): Promise<Testimonial> {
    return api.patch(`/testimonials/${id}/unfeature`);
  },
};