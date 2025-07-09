import { Router, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { supabase } from '../config/supabase.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Get all blog posts
router.get('/', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { published, featured } = req.query;
  
  let query = supabase
    .from('blog_posts')
    .select('*')
    .order('published_at', { ascending: false });

  if (published === 'true') {
    query = query.eq('is_published', true);
  }

  if (featured === 'true') {
    query = query.eq('is_featured', true);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error fetching blog posts: ${error.message}`);
  }

  res.json({ data });
}));

// Get blog post by ID
router.get('/:id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Error fetching blog post: ${error.message}`);
  }

  res.json({ data });
}));

// Get blog post by slug
router.get('/slug/:slug', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { slug } = req.params;

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    throw new Error(`Error fetching blog post: ${error.message}`);
  }

  res.json({ data });
}));

// Increment views
router.patch('/:id/views', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .rpc('increment_blog_views', { blog_id: id });

  if (error) {
    // If RPC doesn't exist, fallback to manual increment
    const { data: post } = await supabase
      .from('blog_posts')
      .select('views_count')
      .eq('id', id)
      .single();

    if (post) {
      await supabase
        .from('blog_posts')
        .update({ views_count: (post.views_count || 0) + 1 })
        .eq('id', id);
    }
  }

  res.json({ message: 'Views incremented successfully' });
}));

export default router;