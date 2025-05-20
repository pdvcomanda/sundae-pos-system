
import { supabase } from '@/integrations/supabase/client';
import { WhatsAppMessage } from '@/types';

// Fetch all WhatsApp messages
export const getMessages = async (): Promise<WhatsAppMessage[]> => {
  const { data, error } = await supabase
    .from('whatsapp_messages')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching WhatsApp messages:', error);
    return [];
  }
  
  return data.map(message => ({
    id: message.id,
    phoneNumber: message.phone_number,
    message: message.message,
    direction: message.direction as 'incoming' | 'outgoing',
    processed: message.processed || false,
    createdAt: new Date(message.created_at)
  }));
};

// Get messages from a specific phone number
export const getMessagesByPhone = async (phoneNumber: string): Promise<WhatsAppMessage[]> => {
  const { data, error } = await supabase
    .from('whatsapp_messages')
    .select('*')
    .eq('phone_number', phoneNumber)
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Error fetching WhatsApp messages by phone:', error);
    return [];
  }
  
  return data.map(message => ({
    id: message.id,
    phoneNumber: message.phone_number,
    message: message.message,
    direction: message.direction as 'incoming' | 'outgoing',
    processed: message.processed || false,
    createdAt: new Date(message.created_at)
  }));
};

// Record a new incoming message
export const recordIncomingMessage = async (phoneNumber: string, messageText: string): Promise<WhatsAppMessage | null> => {
  const { data, error } = await supabase
    .from('whatsapp_messages')
    .insert({
      phone_number: phoneNumber,
      message: messageText,
      direction: 'incoming'
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error recording incoming message:', error);
    return null;
  }
  
  return {
    id: data.id,
    phoneNumber: data.phone_number,
    message: data.message,
    direction: data.direction as 'incoming' | 'outgoing',
    processed: data.processed || false,
    createdAt: new Date(data.created_at)
  };
};

// Send a message (record an outgoing message)
export const sendMessage = async (phoneNumber: string, messageText: string): Promise<WhatsAppMessage | null> => {
  // In a real implementation, you would send the message through WhatsApp API here
  // For now, we'll just record the outgoing message
  
  const { data, error } = await supabase
    .from('whatsapp_messages')
    .insert({
      phone_number: phoneNumber,
      message: messageText,
      direction: 'outgoing',
      created_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error recording outgoing message:', error);
    return null;
  }
  
  return {
    id: data.id,
    phoneNumber: data.phone_number,
    message: data.message,
    direction: data.direction as 'incoming' | 'outgoing',
    processed: data.processed || false,
    createdAt: new Date(data.created_at)
  };
};

// Mark a message as processed
export const markAsProcessed = async (messageId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('whatsapp_messages')
    .update({
      processed: true
    })
    .eq('id', messageId);
  
  return !error;
};

// Check if a message contains an order request
export const checkForOrderRequest = async (message: string): Promise<boolean> => {
  // Simple algorithm to detect order requests
  // In a real implementation, you'd use NLP or a more sophisticated algorithm
  const orderKeywords = [
    'pedido', 'pedir', 'quero', 'desejo', 'gostaria', 
    'açaí', 'acai', 'sorvete', 'ice cream'
  ];
  
  message = message.toLowerCase();
  return orderKeywords.some(keyword => message.includes(keyword.toLowerCase()));
};
