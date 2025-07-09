import api from '../api.js';
import { Appointment } from '../../types';

export interface CreateAppointmentData {
  counsellor_id: string;
  appointment_date: string;
  duration_minutes?: number;
  session_type?: 'video' | 'audio' | 'chat' | 'in-person';
  notes?: string;
}

export const getAppointments = async (): Promise<Appointment[]> => {
  return api.get<Appointment[]>('/appointments');
};

export const createAppointment = async (payload: Partial<Appointment>): Promise<Appointment> => {
  return api.post<Appointment>('/appointments', payload);
};

export const appointmentsApi = {
  async getAll(): Promise<Appointment[]> {
    return api.get('/appointments');
  },

  async getById(id: string): Promise<Appointment> {
    return api.get(`/appointments/${id}`);
  },

  async create(data: CreateAppointmentData): Promise<Appointment> {
    return api.post('/appointments', data);
  },

  async update(id: string, updates: Partial<Appointment>): Promise<Appointment> {
    return api.put(`/appointments/${id}`, updates);
  },

  async cancel(id: string): Promise<void> {
    return api.patch(`/appointments/${id}`, { status: 'cancelled' });
  },

  async getUpcoming(): Promise<Appointment[]> {
    return api.get('/appointments?status=scheduled,confirmed');
  },

  async getPast(): Promise<Appointment[]> {
    return api.get('/appointments?status=completed,cancelled,no-show');
  },
};