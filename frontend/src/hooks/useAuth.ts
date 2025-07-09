import { useState, useEffect } from 'react';
import { authApi, User, Profile, AuthResponse } from '../services/modules/auth';
import { toast } from 'react-hot-toast';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        const profile = await authApi.getProfile();
        setState(prev => ({
          ...prev,
          user: { id: profile.id, email: profile.email, role: profile.role },
          profile,
          loading: false,
        }));
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await authApi.signin({ email, password });
      
      // Store tokens
      localStorage.setItem('access_token', response.session.access_token);
      localStorage.setItem('refresh_token', response.session.refresh_token);
      
      // Get profile
      const profile = await authApi.getProfile();
      
      setState(prev => ({
        ...prev,
        user: response.user,
        profile,
        loading: false,
      }));

      toast.success('Signed in successfully!');
      return { data: response, error: null };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Sign in failed';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      toast.error(errorMessage);
      return { data: null, error: { message: errorMessage } };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await authApi.signup({ email, password, fullName });
      
      // Store tokens if provided
      if (response.session) {
        localStorage.setItem('access_token', response.session.access_token);
        localStorage.setItem('refresh_token', response.session.refresh_token);
        
        // Get profile
        const profile = await authApi.getProfile();
        
        setState(prev => ({
          ...prev,
          user: response.user,
          profile,
          loading: false,
        }));
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }

      toast.success('Account created successfully!');
      return { data: response, error: null };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Sign up failed';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      toast.error(errorMessage);
      return { data: null, error: { message: errorMessage } };
    }
  };

  const signOut = async () => {
    try {
      await authApi.signout();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setState({
        user: null,
        profile: null,
        loading: false,
        error: null,
      });
      toast.success('Signed out successfully!');
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      const updatedProfile = await authApi.updateProfile(updates);
      setState(prev => ({
        ...prev,
        profile: updatedProfile,
      }));
      toast.success('Profile updated successfully!');
      return { data: updatedProfile, error: null };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Profile update failed';
      toast.error(errorMessage);
      return { data: null, error: { message: errorMessage } };
    }
  };

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };
}