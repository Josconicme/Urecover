import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { supabase } from '../config/supabase.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Get user's notifications
router.get('/', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { unread } = req.query;
  
  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', req.user?.id)
    .order('created_at', { ascending: false });

  if (unread === 'true') {
    query = query.eq('is_read', false);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error fetching notifications: ${error.message}`);
  }

  res.json({ data });
}));

// Get notification by ID
router.get('/:id', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('id', id)
    .eq('user_id', req.user?.id)
    .single();

  if (error) {
    throw new Error(`Error fetching notification: ${error.message}`);
  }

  res.json({ data });
}));

// Mark notification as read
router.patch('/:id/read', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id)
    .eq('user_id', req.user?.id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error marking notification as read: ${error.message}`);
  }

  res.json({ data, message: 'Notification marked as read' });
}));

// Mark all notifications as read
router.patch('/read-all', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', req.user?.id)
    .eq('is_read', false);

  if (error) {
    throw new Error(`Error marking all notifications as read: ${error.message}`);
  }

  res.json({ message: 'All notifications marked as read' });
}));

// Delete notification
router.delete('/:id', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', id)
    .eq('user_id', req.user?.id);

  if (error) {
    throw new Error(`Error deleting notification: ${error.message}`);
  }

  res.json({ message: 'Notification deleted successfully' });
}));

// Get unread notification count
router.get('/unread-count', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', req.user?.id)
    .eq('is_read', false);

  if (error) {
    throw new Error(`Error fetching unread count: ${error.message}`);
  }

  res.json({ data: count || 0 });
}));

export default router;