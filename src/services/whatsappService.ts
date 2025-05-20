
import { supabase } from '@/integrations/supabase/client';
import { WhatsAppMessage } from '@/types';

// Get WhatsApp messages
export const getWhatsAppMessages = async (phoneNumber?: string): Promise<WhatsAppMessage[]> => {
  let query = supabase
    .from('whatsapp_messages')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (phoneNumber) {
    query = query.eq('phone_number', phoneNumber);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching WhatsApp messages:', error);
    return [];
  }
  
  return data.map(msg => ({
    id: msg.id,
    phoneNumber: msg.phone_number,
    message: msg.message,
    direction: msg.direction as 'incoming' | 'outgoing',
    processed: msg.processed,
    createdAt: new Date(msg.created_at)
  }));
};

// Send WhatsApp message
export const sendWhatsAppMessage = async (phoneNumber: string, message: string): Promise<WhatsAppMessage | null> => {
  const { data, error } = await supabase
    .from('whatsapp_messages')
    .insert({
      phone_number: phoneNumber,
      message: message,
      direction: 'outgoing',
      processed: true
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error sending WhatsApp message:', error);
    return null;
  }
  
  return {
    id: data.id,
    phoneNumber: data.phone_number,
    message: data.message,
    direction: data.direction as 'incoming' | 'outgoing',
    processed: data.processed,
    createdAt: new Date(data.created_at)
  };
};

// Process incoming message for order
export const processIncomingMessage = async (messageId: string): Promise<boolean> => {
  // In a real implementation, this would analyze the message content
  // and potentially create an order if it's a valid order request
  
  // Mark the message as processed
  const { error } = await supabase
    .from('whatsapp_messages')
    .update({ processed: true })
    .eq('id', messageId);
  
  if (error) {
    console.error('Error marking message as processed:', error);
    return false;
  }
  
  return true;
};

// Generate WhatsApp QR code
export const generateWhatsAppQR = async (): Promise<string | null> => {
  // In a real implementation, this would integrate with the WhatsApp Business API
  // to generate an actual QR code for connecting WhatsApp Web
  
  // For now, return a simulated QR code URL
  return 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=whatsapp-connect-simulation';
};

// Check WhatsApp connection status
export const checkWhatsAppConnection = async (): Promise<boolean> => {
  // In a real implementation, this would check the actual WhatsApp connection status
  // For now, return a simulated status
  return true;
};

// Set chatbot auto-reply
export const setChatbotAutoReply = async (message: string): Promise<boolean> => {
  try {
    await supabase
      .from('system_settings')
      .update({
        chatbot_welcome_message: message,
        updated_at: new Date()
      })
      .eq('id', (await supabase.from('system_settings').select('id').single()).data?.id);
    
    return true;
  } catch (error) {
    console.error('Error setting chatbot auto-reply:', error);
    return false;
  }
};
