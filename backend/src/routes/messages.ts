import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { supabase } from '../config/supabase.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Get user's conversations
router.get('/conversations', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      conversation_id,
      sender_id,
      receiver_id,
      content,
      created_at,
      is_read
    `)
    .or(`sender_id.eq.${req.user?.id},receiver_id.eq.${req.user?.id}`)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Error fetching conversations: ${error.message}`);
  }

  // Group by conversation_id and get latest message for each
  const conversations = data.reduce((acc: any[], message) => {
    const existing = acc.find(conv => conv.id === message.conversation_id);
    if (!existing) {
      acc.push({
        id: message.conversation_id,
        participants: [message.sender_id, message.receiver_id],
        last_message: message,
        unread_count: message.receiver_id === req.user?.id && !message.is_read ? 1 : 0,
        created_at: message.created_at,
        updated_at: message.created_at
      });
    } else if (!message.is_read && message.receiver_id === req.user?.id) {
      existing.unread_count++;
    }
    return acc;
  }, []);

  res.json({ data: conversations });
}));

// Get messages in a conversation
router.get('/conversations/:id/messages', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', id)
    .or(`sender_id.eq.${req.user?.id},receiver_id.eq.${req.user?.id}`)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Error fetching messages: ${error.message}`);
  }

  res.json({ data });
}));

// Send a message
router.post('/', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const messageData = {
    ...req.body,
    sender_id: req.user?.id,
    created_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('messages')
    .insert(messageData)
    .select()
    .single();

  if (error) {
    throw new Error(`Error sending message: ${error.message}`);
  }

  res.status(201).json({ data, message: 'Message sent successfully' });
}));

// Mark message as read
router.patch('/:id/read', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('id', id)
    .eq('receiver_id', req.user?.id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error marking message as read: ${error.message}`);
  }

  res.json({ data, message: 'Message marked as read' });
}));

// Mark conversation as read
router.patch('/conversations/:id/read', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('conversation_id', id)
    .eq('receiver_id', req.user?.id);

  if (error) {
    throw new Error(`Error marking conversation as read: ${error.message}`);
  }

  res.json({ message: 'Conversation marked as read' });
}));

// Get unread message count
router.get('/unread-count', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { count, error } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('receiver_id', req.user?.id)
    .eq('is_read', false);

  if (error) {
    throw new Error(`Error fetching unread count: ${error.message}`);
  }

  res.json({ data: count || 0 });
}));

export default router;