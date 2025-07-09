import api from '../api';
import { AuthPayload, UserProfile } from '../../types';

export const signin = async (payload: AuthPayload): Promise<UserProfile> => {
  return api.post<UserProfile>('/auth/signin', payload);
};

export const signup = async (payload: AuthPayload): Promise<UserProfile> => {
  return api.post<UserProfile>('/auth/signup', { ...payload });
};

export const getProfile = async (): Promise<UserProfile> => {
  return api.get<UserProfile>('/auth/profile');
};

export const updateProfile = async (payload: Partial<UserProfile>): Promise<UserProfile> => {
  return api.put<UserProfile>('/auth/profile', payload);
};

export const signout = async (): Promise<void> => {
  return api.post('/auth/signout');
};