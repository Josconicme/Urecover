import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { supabase } from '../config/supabase.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Get user's goals
router.get('/', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { completed } = req.query;
  
  let query = supabase
    .from('goals')
    .select('*')
    .eq('user_id', req.user?.id)
    .order('created_at', { ascending: false });

  if (completed !== undefined) {
    query = query.eq('is_completed', completed === 'true');
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error fetching goals: ${error.message}`);
  }

  res.json({ data });
}));

// Get goal by ID
router.get('/:id', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('id', id)
    .eq('user_id', req.user?.id)
    .single();

  if (error) {
    throw new Error(`Error fetching goal: ${error.message}`);
  }

  res.json({ data });
}));

// Create goal
router.post('/', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const goalData = {
    ...req.body,
    user_id: req.user?.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('goals')
    .insert(goalData)
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating goal: ${error.message}`);
  }

  res.status(201).json({ data, message: 'Goal created successfully' });
}));

// Update goal
router.put('/:id', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const updates = {
    ...req.body,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('goals')
    .update(updates)
    .eq('id', id)
    .eq('user_id', req.user?.id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating goal: ${error.message}`);
  }

  res.json({ data, message: 'Goal updated successfully' });
}));

// Update goal progress
router.patch('/:id/progress', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { current_value } = req.body;

  const { data, error } = await supabase
    .from('goals')
    .update({ 
      current_value,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('user_id', req.user?.id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating goal progress: ${error.message}`);
  }

  res.json({ data, message: 'Goal progress updated successfully' });
}));

// Mark goal as completed
router.patch('/:id/complete', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('goals')
    .update({ 
      is_completed: true,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('user_id', req.user?.id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error marking goal as completed: ${error.message}`);
  }

  res.json({ data, message: 'Goal marked as completed' });
}));

// Delete goal
router.delete('/:id', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', id)
    .eq('user_id', req.user?.id);

  if (error) {
    throw new Error(`Error deleting goal: ${error.message}`);
  }

  res.json({ message: 'Goal deleted successfully' });
}));

// Get goal stats
router.get('/stats', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { data, error } = await supabase
    .from('goals')
    .select('is_completed, target_value, current_value')
    .eq('user_id', req.user?.id);

  if (error) {
    throw new Error(`Error fetching goal stats: ${error.message}`);
  }

  const stats = {
    total_goals: data.length,
    completed_goals: data.filter(goal => goal.is_completed).length,
    active_goals: data.filter(goal => !goal.is_completed).length,
    completion_rate: data.length > 0 ? (data.filter(goal => goal.is_completed).length / data.length) * 100 : 0
  };

  res.json({ data: stats });
}));

export default router;