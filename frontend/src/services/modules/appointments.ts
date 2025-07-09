import { apiService } from '../api.js';

export interface Appointment {
  id: string;
  user_id: string;
  counsellor_id: string;
  appointment_date: string;
  duration_minutes: number;
  session_type: 'video' | 'audio' | 'chat' | 'in-person';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  meeting_link?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAppointmentData {
  counsellor_id: string;
  appointment_date: string;
  duration_minutes?: number;
  session_type?: 'video' | 'audio' | 'chat' | 'in-person';
  notes?: string;
}

export const appointmentsApi = {
  async getAll(): Promise<Appointment[]> {
    return apiService.get('/appointments');
  },

  async getById(id: string): Promise<Appointment> {
    return apiService.get(`/appointments/${id}`);
  },

  async create(data: CreateAppointmentData): Promise<Appointment> {
    return apiService.post('/appointments', data);
  },

  async update(id: string, updates: Partial<Appointment>): Promise<Appointment> {
    return apiService.put(`/appointments/${id}`, updates);
  },

  async cancel(id: string): Promise<void> {
    return apiService.patch(`/appointments/${id}`, { status: 'cancelled' });
  },

  async getUpcoming(): Promise<Appointment[]> {
    return apiService.get('/appointments?status=scheduled,confirmed');
  },

  async getPast(): Promise<Appointment[]> {
    return apiService.get('/appointments?status=completed,cancelled,no-show');
  },
};