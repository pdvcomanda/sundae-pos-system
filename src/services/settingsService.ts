
import { supabase } from '@/integrations/supabase/client';
import { BusinessSettings, PrinterSettings, SystemSettings } from '@/types';

// Business settings services
export const getBusinessSettings = async (): Promise<BusinessSettings | null> => {
  const { data, error } = await supabase.from('business_settings').select('*').single();
  
  if (error) {
    console.error('Error fetching business settings:', error);
    return null;
  }
  
  return {
    id: data.id,
    businessName: data.business_name,
    address: data.address || '',
    phone: data.phone || '',
    email: data.email || '',
    logoUrl: data.logo_url || '',
  };
};

export const updateBusinessSettings = async (settings: Partial<BusinessSettings>): Promise<BusinessSettings | null> => {
  const { data, error } = await supabase
    .from('business_settings')
    .update({
      business_name: settings.businessName,
      address: settings.address,
      phone: settings.phone,
      email: settings.email,
      logo_url: settings.logoUrl,
      updated_at: new Date().toISOString()
    })
    .eq('id', settings.id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating business settings:', error);
    return null;
  }
  
  return {
    id: data.id,
    businessName: data.business_name,
    address: data.address || '',
    phone: data.phone || '',
    email: data.email || '',
    logoUrl: data.logo_url || '',
  };
};

// Printer settings services
export const getPrinterSettings = async (): Promise<PrinterSettings | null> => {
  const { data, error } = await supabase.from('printer_settings').select('*').single();
  
  if (error) {
    console.error('Error fetching printer settings:', error);
    return null;
  }
  
  return {
    id: data.id,
    connectionType: data.connection_type as 'bluetooth' | 'usb',
    printerName: data.printer_name || '',
    printerAddress: data.printer_address || '',
    autoPrint: data.auto_print,
    printCustomerReceipt: data.print_customer_receipt,
    printKitchenReceipt: data.print_kitchen_receipt,
  };
};

export const updatePrinterSettings = async (settings: Partial<PrinterSettings>): Promise<PrinterSettings | null> => {
  const { data, error } = await supabase
    .from('printer_settings')
    .update({
      connection_type: settings.connectionType,
      printer_name: settings.printerName,
      printer_address: settings.printerAddress,
      auto_print: settings.autoPrint,
      print_customer_receipt: settings.printCustomerReceipt,
      print_kitchen_receipt: settings.printKitchenReceipt,
      updated_at: new Date().toISOString()
    })
    .eq('id', settings.id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating printer settings:', error);
    return null;
  }
  
  return {
    id: data.id,
    connectionType: data.connection_type as 'bluetooth' | 'usb',
    printerName: data.printer_name || '',
    printerAddress: data.printer_address || '',
    autoPrint: data.auto_print,
    printCustomerReceipt: data.print_customer_receipt,
    printKitchenReceipt: data.print_kitchen_receipt,
  };
};

// System settings services
export const getSystemSettings = async (): Promise<SystemSettings | null> => {
  const { data, error } = await supabase.from('system_settings').select('*').single();
  
  if (error) {
    console.error('Error fetching system settings:', error);
    return null;
  }
  
  return {
    id: data.id,
    darkMode: data.dark_mode,
    lastBackupAt: data.last_backup_at ? new Date(data.last_backup_at) : undefined,
    whatsappEnabled: data.whatsapp_enabled,
    whatsappNumber: data.whatsapp_number || '',
    chatbotEnabled: data.chatbot_enabled,
    chatbotWelcomeMessage: data.chatbot_welcome_message || '',
  };
};

export const updateSystemSettings = async (settings: Partial<SystemSettings>): Promise<SystemSettings | null> => {
  const { data, error } = await supabase
    .from('system_settings')
    .update({
      dark_mode: settings.darkMode,
      whatsapp_enabled: settings.whatsappEnabled,
      whatsapp_number: settings.whatsappNumber,
      chatbot_enabled: settings.chatbotEnabled,
      chatbot_welcome_message: settings.chatbotWelcomeMessage,
      updated_at: new Date().toISOString()
    })
    .eq('id', settings.id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating system settings:', error);
    return null;
  }
  
  return {
    id: data.id,
    darkMode: data.dark_mode,
    lastBackupAt: data.last_backup_at ? new Date(data.last_backup_at) : undefined,
    whatsappEnabled: data.whatsapp_enabled,
    whatsappNumber: data.whatsapp_number || '',
    chatbotEnabled: data.chatbot_enabled,
    chatbotWelcomeMessage: data.chatbot_welcome_message || '',
  };
};

// Backup and restore functions
export const createBackup = async (): Promise<boolean> => {
  // In a real system, this would create a dump of the database
  const { error } = await supabase
    .from('system_settings')
    .update({
      last_backup_at: new Date().toISOString()
    })
    .eq('id', (await getSystemSettings())?.id || '');
  
  return !error;
};

export const exportData = async (): Promise<Blob | null> => {
  try {
    // Fetch all data from all tables
    const [
      businessSettings, 
      printerSettings, 
      systemSettings, 
      products,
      toppings,
      inventory,
      orders
    ] = await Promise.all([
      supabase.from('business_settings').select('*'),
      supabase.from('printer_settings').select('*'),
      supabase.from('system_settings').select('*'),
      supabase.from('products').select('*'),
      supabase.from('toppings').select('*'),
      supabase.from('inventory').select('*'),
      supabase.from('orders').select('*').order('created_at', { ascending: false })
    ]);
    
    // Create a JSON object with all data
    const exportData = {
      businessSettings: businessSettings.data,
      printerSettings: printerSettings.data,
      systemSettings: systemSettings.data,
      products: products.data,
      toppings: toppings.data,
      inventory: inventory.data,
      orders: orders.data
    };
    
    // Convert to JSON and then to Blob
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    return blob;
  } catch (error) {
    console.error('Error exporting data:', error);
    return null;
  }
};
