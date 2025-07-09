import api from '../api.js';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  message_type: 'text' | 'image' | 'file' | 'system';
  is_read: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  last_message?: Message;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export interface SendMessageData {
  conversation_id: string;
  receiver_id: string;
  content: string;
  message_type?: 'text' | 'image' | 'file' | 'system';
}

export const messagesApi = {
  async getConversations(): Promise<Conversation[]> {
    return api.get('/messages/conversations');
  },

  async getConversation(id: string): Promise<Conversation> {
    return api.get(`/messages/conversations/${id}`);
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    return api.get(`/messages/conversations/${conversationId}/messages`);
  },

  async sendMessage(data: SendMessageData): Promise<Message> {
    return api.post('/messages', data);
  },

  async markAsRead(messageId: string): Promise<void> {
    return api.patch(`/messages/${messageId}/read`);
  },

  async markConversationAsRead(conversationId: string): Promise<void> {
    return api.patch(`/messages/conversations/${conversationId}/read`);
  },

  async createConversation(participantId: string): Promise<Conversation> {
    return api.post('/messages/conversations', { participant_id: participantId });
  },

  async deleteMessage(id: string): Promise<void> {
    return api.delete(`/messages/${id}`);
  },

  async getUnreadCount(): Promise<number> {
    return api.get('/messages/unread-count');
  },
};