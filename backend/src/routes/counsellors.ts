import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { supabase } from '../config/supabase.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Get all counsellors
router.get('/', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { available, specialty } = req.query;
  
  let query = supabase
    .from('counsellors')
    .select('*')
    .order('rating', { ascending: false });

  if (available === 'true') {
    query = query.eq('is_available', true);
  }

  if (specialty) {
    query = query.contains('specialties', [specialty]);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error fetching counsellors: ${error.message}`);
  }

  res.json({ data });
}));

// Get counsellor by ID
router.get('/:id', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('counsellors')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Error fetching counsellor: ${error.message}`);
  }

  res.json({ data });
}));

// Update counsellor profile (counsellors only)
router.put('/:id', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Check if user is the counsellor or admin
  const { data: counsellor } = await supabase
    .from('counsellors')
    .select('user_id')
    .eq('id', id)
    .single();

  if (!counsellor || (counsellor.user_id !== req.user?.id && req.user?.role !== 'admin')) {
    return res.status(403).json({ error: 'Unauthorized to update this profile' });
  }

  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('counsellors')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating counsellor: ${error.message}`);
  }

  res.json({ data, message: 'Counsellor profile updated successfully' });
}));

export default router;