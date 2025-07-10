import { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';
import { createError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const authController = {
  async signup(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, fullName } = req.body;

      logger.info(`Signup attempt for email: ${email}`);

      if (!email || !password) {
        logger.warn('Signup failed: Missing email or password');
        res.status(400).json({
          error: 'Email and password are required',
          message: 'Email and password are required'
        });
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || ''
          }
        }
      });

      if (error) {
        logger.error(`Supabase signup error: ${error.message}`);
        res.status(400).json({
          error: error.message,
          message: error.message
        });
        return;
      }

      if (!data.user) {
        logger.error('Signup failed: No user data returned');
        res.status(400).json({
          error: 'Failed to create user',
          message: 'Failed to create user'
        });
        return;
      }

      logger.info(`User created successfully: ${data.user.id}`);

      res.status(201).json({
        message: 'User created successfully',
        user: {
          id: data.user.id,
          email: data.user.email,
          role: 'user'
        },
        session: data.session
      });
    } catch (error: any) {
      logger.error(`Signup controller error: ${error.message}`, error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to create user'
      });
    }
  },

  async signin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      logger.info(`Signin attempt for email: ${email}`);

      if (!email || !password) {
        logger.warn('Signin failed: Missing email or password');
        res.status(400).json({
          error: 'Email and password are required',
          message: 'Email and password are required'
        });
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        logger.error(`Supabase signin error: ${error.message}`);
        res.status(401).json({
          error: error.message,
          message: error.message
        });
        return;
      }

      if (!data.user || !data.session) {
        logger.error('Signin failed: No user or session data returned');
        res.status(401).json({
          error: 'Invalid credentials',
          message: 'Invalid email or password'
        });
        return;
      }

      // Get user profile for role
      let userRole = 'user';
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();
        
        if (profile?.role) {
          userRole = profile.role;
        }
      } catch (profileError) {
        logger.warn(`Could not fetch user role: ${profileError}`);
      }

      logger.info(`User signed in successfully: ${data.user.id}`);

      res.json({
        message: 'Signed in successfully',
        user: {
          id: data.user.id,
          email: data.user.email,
          role: userRole
        },
        session: data.session
      });
    } catch (error: any) {
      logger.error(`Signin controller error: ${error.message}`, error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to sign in'
      });
    }
  },

  async signout(req: Request, res: Response): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        logger.error(`Signout error: ${error.message}`);
        res.status(400).json({
          error: error.message,
          message: error.message
        });
        return;
      }

      res.json({ message: 'Signed out successfully' });
    } catch (error: any) {
      logger.error(`Signout controller error: ${error.message}`, error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to sign out'
      });
    }
  },

  async refresh(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          error: 'Refresh token is required',
          message: 'Refresh token is required'
        });
        return;
      }

      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken
      });

      if (error) {
        logger.error(`Token refresh error: ${error.message}`);
        res.status(401).json({
          error: error.message,
          message: error.message
        });
        return;
      }

      res.json({
        message: 'Token refreshed successfully',
        session: data.session
      });
    } catch (error: any) {
      logger.error(`Refresh controller error: ${error.message}`, error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to refresh token'
      });
    }
  },

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({
          error: 'Email is required',
          message: 'Email is required'
        });
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        logger.error(`Password reset error: ${error.message}`);
        res.status(400).json({
          error: error.message,
          message: error.message
        });
        return;
      }

      res.json({ message: 'Password reset email sent' });
    } catch (error: any) {
      logger.error(`Forgot password controller error: ${error.message}`, error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to send password reset email'
      });
    }
  },

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { password, accessToken } = req.body;

      if (!password || !accessToken) {
        res.status(400).json({
          error: 'Password and access token are required',
          message: 'Password and access token are required'
        });
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password
      });

      if (error) {
        logger.error(`Password update error: ${error.message}`);
        res.status(400).json({
          error: error.message,
          message: error.message
        });
        return;
      }

      res.json({ message: 'Password updated successfully' });
    } catch (error: any) {
      logger.error(`Reset password controller error: ${error.message}`, error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to reset password'
      });
    }
  },

  async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'User not authenticated',
          message: 'User not authenticated'
        });
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', req.user.id)
        .single();

      if (error) {
        logger.error(`Profile fetch error: ${error.message}`);
        
        // If profile doesn't exist, create one
        if (error.code === 'PGRST116') {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: req.user.id,
              email: req.user.email,
              role: req.user.role || 'user',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single();

          if (createError) {
            logger.error(`Profile creation error: ${createError.message}`);
            res.status(500).json({
              error: 'Error creating profile',
              message: 'Error creating profile'
            });
            return;
          }

          res.json({ profile: newProfile });
          return;
        }

        res.status(500).json({
          error: 'Error fetching profile',
          message: 'Error fetching profile'
        });
        return;
      }

      res.json({ profile: data });
    } catch (error: any) {
      logger.error(`Get profile controller error: ${error.message}`, error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch profile'
      });
    }
  },

  async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'User not authenticated',
          message: 'User not authenticated'
        });
        return;
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
        res.status(500).json({
          error: 'Error updating profile',
          message: 'Error updating profile'
        });
        return;
      }

      res.json({
        message: 'Profile updated successfully',
        profile: data
      });
    } catch (error: any) {
      logger.error(`Update profile controller error: ${error.message}`, error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to update profile'
      });
    }
  }
};