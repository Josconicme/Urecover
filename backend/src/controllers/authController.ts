import { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';
import { createError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const authController = {
  async signup(req: Request, res: Response): Promise<void> {
    const { email, password, fullName } = req.body;

    if (!email || !password) {
      throw createError('Email and password are required', 400);
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (error) {
      logger.error(`Signup error: ${error.message}`);
      throw createError(error.message, 400);
    }

    res.status(201).json({
      message: 'User created successfully',
      user: data.user,
      session: data.session
    });
  },

  async signin(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createError('Email and password are required', 400);
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      logger.error(`Signin error: ${error.message}`);
      throw createError(error.message, 401);
    }

    res.json({
      message: 'Signed in successfully',
      user: data.user,
      session: data.session
    });
  },

  async signout(req: Request, res: Response): Promise<void> {
    const { error } = await supabase.auth.signOut();

    if (error) {
      logger.error(`Signout error: ${error.message}`);
      throw createError(error.message, 400);
    }

    res.json({ message: 'Signed out successfully' });
  },

  async refresh(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw createError('Refresh token is required', 400);
    }

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken
    });

    if (error) {
      logger.error(`Token refresh error: ${error.message}`);
      throw createError(error.message, 401);
    }

    res.json({
      message: 'Token refreshed successfully',
      session: data.session
    });
  },

  async forgotPassword(req: Request, res: Response): Promise<void> {
    const { email } = req.body;

    if (!email) {
      throw createError('Email is required', 400);
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      logger.error(`Password reset error: ${error.message}`);
      throw createError(error.message, 400);
    }

    res.json({ message: 'Password reset email sent' });
  },

  async resetPassword(req: Request, res: Response): Promise<void> {
    const { password, accessToken } = req.body;

    if (!password || !accessToken) {
      throw createError('Password and access token are required', 400);
    }

    const { error } = await supabase.auth.updateUser({
      password
    });

    if (error) {
      logger.error(`Password update error: ${error.message}`);
      throw createError(error.message, 400);
    }

    res.json({ message: 'Password updated successfully' });
  },

  async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      throw createError('User not authenticated', 401);
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) {
      logger.error(`Profile fetch error: ${error.message}`);
      throw createError('Error fetching profile', 500);
    }

    res.json({ profile: data });
  },

  async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      throw createError('User not authenticated', 401);
    }

    const updates = req.body;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) {
      logger.error(`Profile update error: ${error.message}`);
      throw createError('Error updating profile', 500);
    }

    res.json({
      message: 'Profile updated successfully',
      profile: data
    });
  }
};