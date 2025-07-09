import { Router, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { supabase } from '../config/supabase.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Get testimonials
router.get('/', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { approved, featured, counsellor_id } = req.query;
  
  let query = supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });

  if (approved === 'true') {
    query = query.eq('is_approved', true);
  }

  if (featured === 'true') {
    query = query.eq('is_featured', true);
  }

  if (counsellor_id) {
    query = query.eq('counsellor_id', counsellor_id);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error fetching testimonials: ${error.message}`);
  }

  res.json({ data });
}));

// Get testimonial by ID
router.get('/:id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Error fetching testimonial: ${error.message}`);
  }

  res.json({ data });
}));

// Create testimonial
router.post('/', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const testimonialData = {
    ...req.body,
    user_id: req.user?.id,
    created_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('testimonials')
    .insert(testimonialData)
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating testimonial: ${error.message}`);
  }

  res.status(201).json({ data, message: 'Testimonial created successfully' });
}));

export default router;