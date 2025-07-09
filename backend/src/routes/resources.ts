import { Router, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { supabase } from '../config/supabase.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Get all resources
router.get('/', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { category, type, premium } = req.query;
  
  let query = supabase
    .from('resources')
    .select('*')
    .order('created_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  if (type) {
    query = query.eq('resource_type', type);
  }

  if (premium !== undefined) {
    query = query.eq('is_premium', premium === 'true');
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error fetching resources: ${error.message}`);
  }

  res.json({ data });
}));

// Get resource by ID
router.get('/:id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Error fetching resource: ${error.message}`);
  }

  res.json({ data });
}));

// Increment download count
router.patch('/:id/download', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const { data: resource } = await supabase
    .from('resources')
    .select('download_count')
    .eq('id', id)
    .single();

  if (resource) {
    await supabase
      .from('resources')
      .update({ download_count: (resource.download_count || 0) + 1 })
      .eq('id', id);
  }

  res.json({ message: 'Download count incremented successfully' });
}));

export default router;