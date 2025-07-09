import { Router, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requireRole } from '../middleware/auth.js';
import { supabase } from '../config/supabase.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Admin and manager only routes
router.use(requireRole(['admin', 'manager']));

// Get admin stats
router.get('/stats', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const [
    { count: totalUsers },
    { count: totalCounsellors },
    { count: totalAppointments },
    { count: totalSessions },
    { count: pendingTestimonials }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('counsellors').select('*', { count: 'exact', head: true }),
    supabase.from('appointments').select('*', { count: 'exact', head: true }),
    supabase.from('sessions').select('*', { count: 'exact', head: true }),
    supabase.from('testimonials').select('*', { count: 'exact', head: true }).eq('is_approved', false)
  ]);

  const stats = {
    total_users: totalUsers || 0,
    total_counsellors: totalCounsellors || 0,
    total_appointments: totalAppointments || 0,
    total_sessions: totalSessions || 0,
    active_users: totalUsers || 0, // Simplified for now
    pending_testimonials: pendingTestimonials || 0,
    pending_content: 0 // Simplified for now
  };

  res.json({ data: stats });
}));

// Get all users
router.get('/users', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Error fetching users: ${error.message}`);
  }

  res.json({ data });
}));

// Get user by ID
router.get('/users/:id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }

  res.json({ data });
}));

// Update user
router.put('/users/:id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const updates = {
    ...req.body,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }

  res.json({ data, message: 'User updated successfully' });
}));

export default router;