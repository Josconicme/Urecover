import apiService from '../api.js';

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
  try {
    const response = await apiService.post<AuthResponse>('/auth/signin', payload);
    return response;
  } catch (error: any) {
    console.error('Signin API error:', error);
    throw error;
  }
};

export const signup = async (payload: AuthPayload): Promise<AuthResponse> => {
  try {
    const response = await apiService.post<AuthResponse>('/auth/signup', payload);
    return response;
  } catch (error: any) {
    console.error('Signup API error:', error);
    throw error;
  }
};

export const getProfile = async (): Promise<Profile> => {
  try {
    const response = await apiService.get<{ profile: Profile }>('/auth/profile');
    return response.profile;
  } catch (error: any) {
    console.error('Get profile API error:', error);
    throw error;
  }
};

export const updateProfile = async (payload: Partial<Profile>): Promise<Profile> => {
  try {
    const response = await apiService.put<{ profile: Profile }>('/auth/profile', payload);
    return response.profile;
  } catch (error: any) {
    console.error('Update profile API error:', error);
    throw error;
  }
};

export const signout = async (): Promise<void> => {
  try {
    await apiService.post('/auth/signout');
  } catch (error: any) {
    console.error('Signout API error:', error);
    throw error;
  }
};

export const refreshToken = async (refreshToken: string): Promise<AuthResponse> => {
  try {
    const response = await apiService.post<AuthResponse>('/auth/refresh', { refreshToken });
    return response;
  } catch (error: any) {
    console.error('Refresh token API error:', error);
    throw error;
  }
};