import api from '../api.js';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'appointment' | 'message' | 'wellness' | 'system' | 'reminder';
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

export interface CreateNotificationData {
  title: string;
  message: string;
  type?: 'appointment' | 'message' | 'wellness' | 'system' | 'reminder';
  action_url?: string;
}

export const notificationsApi = {
  async getAll(): Promise<Notification[]> {
    return api.get('/notifications');
  },

  async getUnread(): Promise<Notification[]> {
    return api.get('/notifications?unread=true');
  },

  async getById(id: string): Promise<Notification> {
    return api.get(`/notifications/${id}`);
  },

  async markAsRead(id: string): Promise<Notification> {
    return api.patch(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    return api.patch('/notifications/read-all');
  },

  async delete(id: string): Promise<void> {
    return api.delete(`/notifications/${id}`);
  },

  async deleteAll(): Promise<void> {
    return api.delete('/notifications');
  },

  async getUnreadCount(): Promise<number> {
    return api.get('/notifications/unread-count');
  },

  async create(data: CreateNotificationData): Promise<Notification> {
    return api.post('/notifications', data);
  },
};