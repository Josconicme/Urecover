import { apiService } from '../api';

export interface User {
  id: string;
  email: string;
  role: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  date_of_birth?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  role: string;
  is_first_login: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  session: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
}

export const authApi = {
  async signup(data: {
    email: string;
    password: string;
    fullName?: string;
  }): Promise<AuthResponse> {
    return apiService.post('/auth/signup', data);
  },

  async signin(data: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    return apiService.post('/auth/signin', data);
  },

  async signout(): Promise<void> {
    return apiService.post('/auth/signout');
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return apiService.post('/auth/refresh', { refreshToken });
  },

  async forgotPassword(email: string): Promise<void> {
    return apiService.post('/auth/forgot-password', { email });
  },

  async resetPassword(data: {
    password: string;
    accessToken: string;
  }): Promise<void> {
    return apiService.post('/auth/reset-password', data);
  },

  async getProfile(): Promise<Profile> {
    return apiService.get('/auth/profile');
  },

  async updateProfile(updates: Partial<Profile>): Promise<Profile> {
    return apiService.put('/auth/profile', updates);
  },
};