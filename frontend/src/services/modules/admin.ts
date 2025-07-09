import api from '../api.js';

export interface AdminStats {
  total_users: number;
  total_counsellors: number;
  total_appointments: number;
  total_sessions: number;
  active_users: number;
  pending_testimonials: number;
  pending_content: number;
}

export interface UserManagement {
  id: string;
  email: string;
  full_name?: string;
  role: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
}

export interface ContentModeration {
  id: string;
  type: 'blog_post' | 'article' | 'testimonial';
  title: string;
  author: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export const adminApi = {
  async getStats(): Promise<AdminStats> {
    return api.get('/admin/stats');
  },

  async getUsers(): Promise<UserManagement[]> {
    return api.get('/admin/users');
  },

  async getUserById(id: string): Promise<UserManagement> {
    return api.get(`/admin/users/${id}`);
  },

  async updateUser(id: string, updates: Partial<UserManagement>): Promise<UserManagement> {
    return api.put(`/admin/users/${id}`, updates);
  },

  async suspendUser(id: string, reason?: string): Promise<void> {
    return api.patch(`/admin/users/${id}/suspend`, { reason });
  },

  async activateUser(id: string): Promise<void> {
    return api.patch(`/admin/users/${id}/activate`);
  },

  async deleteUser(id: string): Promise<void> {
    return api.delete(`/admin/users/${id}`);
  },

  async getPendingContent(): Promise<ContentModeration[]> {
    return api.get('/admin/content/pending');
  },

  async approveContent(type: string, id: string): Promise<void> {
    return api.patch(`/admin/content/${type}/${id}/approve`);
  },

  async rejectContent(type: string, id: string, reason?: string): Promise<void> {
    return api.patch(`/admin/content/${type}/${id}/reject`, { reason });
  },

  async getSystemLogs(): Promise<any[]> {
    return api.get('/admin/logs');
  },

  async exportData(type: string): Promise<Blob> {
    const response = await fetch(`/admin/export/${type}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    return response.blob();
  },

  async getAnalytics(period: string): Promise<any> {
    return api.get(`/admin/analytics?period=${period}`);
  },

  async sendSystemNotification(data: {
    title: string;
    message: string;
    target_users?: string[];
    target_roles?: string[];
  }): Promise<void> {
    return api.post('/admin/notifications/system', data);
  },
};