import { Router, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { supabase } from '../config/supabase.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Get user's appointments
router.get('/', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { status } = req.query;
  
  let query = supabase
    .from('appointments')
    .select(`
      *,
      counsellors (
        id,
        full_name,
        title,
        avatar_url
      )
    `)
    .or(`user_id.eq.${req.user?.id},counsellor_id.in.(select id from counsellors where user_id.eq.${req.user?.id})`)
    .order('appointment_date', { ascending: true });

  if (status) {
    const statusArray = status.toString().split(',');
    query = query.in('status', statusArray);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error fetching appointments: ${error.message}`);
  }

  res.json({ data });
}));

// Get appointment by ID
router.get('/:id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      counsellors (
        id,
        full_name,
        title,
        avatar_url
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Error fetching appointment: ${error.message}`);
  }

  // Check if user has access to this appointment
  const isCounsellor = await supabase
    .from('counsellors')
    .select('id')
    .eq('id', data.counsellor_id)
    .eq('user_id', req.user?.id)
    .single();

  if (data.user_id !== req.user?.id && !isCounsellor.data) {
    return res.status(403).json({ error: 'Unauthorized to view this appointment' });
  }

  return res.json({ data });
}));

// Create new appointment
router.post('/', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const appointmentData = {
    ...req.body,
    user_id: req.user?.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('appointments')
    .insert(appointmentData)
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating appointment: ${error.message}`);
  }

  res.status(201).json({ data, message: 'Appointment created successfully' });
}));

// Update appointment
router.put('/:id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const updates = {
    ...req.body,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('appointments')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating appointment: ${error.message}`);
  }

  res.json({ data, message: 'Appointment updated successfully' });
}));

// Cancel appointment
router.patch('/:id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const updates = {
    ...req.body,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('appointments')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating appointment: ${error.message}`);
  }

  res.json({ data, message: 'Appointment updated successfully' });
}));

export default router;