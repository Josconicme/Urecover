import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { supabase } from '../config/supabase.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Get all articles
router.get('/', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { published, category, difficulty } = req.query;
  
  let query = supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });

  if (published === 'true') {
    query = query.eq('is_published', true);
  }

  if (category) {
    query = query.eq('category', category);
  }

  if (difficulty) {
    query = query.eq('difficulty_level', difficulty);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error fetching articles: ${error.message}`);
  }

  res.json({ data });
}));

// Get article by ID
router.get('/:id', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Error fetching article: ${error.message}`);
  }

  res.json({ data });
}));

// Get article by slug
router.get('/slug/:slug', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { slug } = req.params;

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    throw new Error(`Error fetching article: ${error.message}`);
  }

  res.json({ data });
}));

// Increment views
router.patch('/:id/views', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  const { data: article } = await supabase
    .from('articles')
    .select('views_count')
    .eq('id', id)
    .single();

  if (article) {
    await supabase
      .from('articles')
      .update({ views_count: (article.views_count || 0) + 1 })
      .eq('id', id);
  }

  res.json({ message: 'Views incremented successfully' });
}));

export default router;