import api from '../api.js';

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
  role: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  location?: string;
  emergency_contact?: any;
  preferences?: any;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthPayload {
  email: string;
  password: string;
  fullName?: string;
}

export interface AuthResponse {
  user: User;
  session: {
    access_token: string;
    refresh_token: string;
  };
  message: string;
}

export const signin = async (payload: AuthPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/signin', payload);
  return response;
};

export const signup = async (payload: AuthPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/signup', payload);
  return response;
};

export const getProfile = async (): Promise<Profile> => {
  const response = await api.get<{ profile: Profile }>('/auth/profile');
  return response.profile;
};

export const updateProfile = async (payload: Partial<Profile>): Promise<Profile> => {
  const response = await api.put<{ profile: Profile }>('/auth/profile', payload);
  return response.profile;
};

export const signout = async (): Promise<void> => {
  await api.post('/auth/signout');
};

export const refreshToken = async (refreshToken: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/refresh', { refreshToken });
  return response;
};