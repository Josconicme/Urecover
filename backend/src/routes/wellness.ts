import { Router, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { supabase } from '../config/supabase.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Get user's wellness entries
router.get('/', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { start_date, end_date } = req.query;
  
  let query = supabase
    .from('wellness_entries')
    .select('*')
    .eq('user_id', req.user?.id)
    .order('entry_date', { ascending: false });

  if (start_date && end_date) {
    query = query.gte('entry_date', start_date).lte('entry_date', end_date);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error fetching wellness entries: ${error.message}`);
  }

  res.json({ data });
}));

// Get wellness entry by ID
router.get('/:id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('wellness_entries')
    .select('*')
    .eq('id', id)
    .eq('user_id', req.user?.id)
    .single();

  if (error) {
    throw new Error(`Error fetching wellness entry: ${error.message}`);
  }

  res.json({ data });
}));

// Create wellness entry
router.post('/', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const entryData = {
    ...req.body,
    user_id: req.user?.id,
    created_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('wellness_entries')
    .insert(entryData)
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating wellness entry: ${error.message}`);
  }

  res.status(201).json({ data, message: 'Wellness entry created successfully' });
}));

// Update wellness entry
router.put('/:id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const { data, error } = await supabase
    .from('wellness_entries')
    .update(updates)
    .eq('id', id)
    .eq('user_id', req.user?.id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating wellness entry: ${error.message}`);
  }

  res.json({ data, message: 'Wellness entry updated successfully' });
}));

// Delete wellness entry
router.delete('/:id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('wellness_entries')
    .delete()
    .eq('id', id)
    .eq('user_id', req.user?.id);

  if (error) {
    throw new Error(`Error deleting wellness entry: ${error.message}`);
  }

  res.json({ message: 'Wellness entry deleted successfully' });
}));

// Get wellness stats
router.get('/stats', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { data, error } = await supabase
    .from('wellness_entries')
    .select('mood_score, wellness_score, anxiety_level, sleep_hours, exercise_minutes, meditation_minutes')
    .eq('user_id', req.user?.id)
    .order('entry_date', { ascending: false })
    .limit(30);

  if (error) {
    throw new Error(`Error fetching wellness stats: ${error.message}`);
  }

  // Calculate averages
  const stats = {
    total_entries: data.length,
    avg_mood: data.reduce((sum, entry) => sum + (entry.mood_score || 0), 0) / data.length || 0,
    avg_wellness: data.reduce((sum, entry) => sum + (entry.wellness_score || 0), 0) / data.length || 0,
    avg_anxiety: data.reduce((sum, entry) => sum + (entry.anxiety_level || 0), 0) / data.length || 0,
    avg_sleep: data.reduce((sum, entry) => sum + (entry.sleep_hours || 0), 0) / data.length || 0,
    total_exercise: data.reduce((sum, entry) => sum + (entry.exercise_minutes || 0), 0),
    total_meditation: data.reduce((sum, entry) => sum + (entry.meditation_minutes || 0), 0)
  };

  res.json({ data: stats });
}));

export default router;