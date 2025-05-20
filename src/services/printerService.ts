
import { getPrinterSettings } from './settingsService';
import { getBusinessSettings } from './settingsService';
import { Order, OrderItem, BusinessSettings } from '@/types';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

// Function to format currency
const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// Generate the text for a customer receipt
const generateCustomerReceipt = async (order: Order, businessSettings?: BusinessSettings | null): Promise<string> => {
  // Get business settings if not provided
  if (!businessSettings) {
    businessSettings = await getBusinessSettings();
  }
  
  const businessName = businessSettings?.businessName || 'Açaí dos Sonhos';
  const address = businessSettings?.address || '';
  const phone = businessSettings?.phone || '';
  
  // Create the header
  let receipt = `
${businessName}
${address}
${phone ? `Tel: ${phone}` : ''}
----------------------------------------
CUPOM NÃO FISCAL
----------------------------------------
Comanda #${order.orderNumber}
Data: ${format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm', { locale: pt })}
----------------------------------------
ITENS
----------------------------------------
`;
  
  // Add items
  order.items.forEach((item, index) => {
    // Item details
    receipt += `${index + 1}. ${item.product.name}\n`;
    receipt += `   ${item.size.name} (${item.size.volume})\n`;
    
    // Toppings
    if (item.toppings.length > 0) {
      const toppingsText = item.toppings.map(t => t.name).join(', ');
      receipt += `   + ${toppingsText}\n`;
    }
    
    // Quantity and price
    receipt += `   ${item.quantity}x ${formatCurrency(item.price / item.quantity)} = ${formatCurrency(item.price)}\n`;
    
    // Notes if any
    if (item.notes) {
      receipt += `   Obs: ${item.notes}\n`;
    }
    
    receipt += '----------------------------------------\n';
  });
  
  // Add total
  receipt += `
TOTAL: ${formatCurrency(order.total)}
----------------------------------------
Agradecemos a preferência!
`;

  return receipt;
};

// Generate the text for a kitchen receipt
const generateKitchenReceipt = async (order: Order, businessSettings?: BusinessSettings | null): Promise<string> => {
  // Get business settings if not provided
  if (!businessSettings) {
    businessSettings = await getBusinessSettings();
  }
  
  const businessName = businessSettings?.businessName || 'Açaí dos Sonhos';
  
  // Create the header
  let receipt = `
${businessName} - COZINHA
----------------------------------------
COMANDA #${order.orderNumber}
Data: ${format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm', { locale: pt })}
----------------------------------------
PREPARO
----------------------------------------
`;
  
  // Add items
  order.items.forEach((item, index) => {
    // Item details in larger, simplified format for kitchen
    receipt += `${index + 1}. ${item.product.name.toUpperCase()}\n`;
    receipt += `   ${item.size.name.toUpperCase()} (${item.size.volume}) - QTD: ${item.quantity}\n`;
    
    // Toppings
    if (item.toppings.length > 0) {
      receipt += `   ADICIONAR:\n`;
      item.toppings.forEach(t => {
        receipt += `   - ${t.name.toUpperCase()}\n`;
      });
    }
    
    // Notes if any - highlighted for kitchen
    if (item.notes) {
      receipt += `   OBS: ${item.notes.toUpperCase()}\n`;
    }
    
    receipt += '----------------------------------------\n';
  });
  
  return receipt;
};

// Print receipt function
export const printReceipt = async (order: Order, type: 'customer' | 'kitchen' | 'both'): Promise<boolean> => {
  try {
    const printerSettings = await getPrinterSettings();
    const businessSettings = await getBusinessSettings();
    
    if (!printerSettings) {
      console.error('Printer settings not found');
      return false;
    }
    
    // Generate receipt based on type
    if (type === 'customer' || type === 'both') {
      const customerReceipt = await generateCustomerReceipt(order, businessSettings);
      console.log('Customer Receipt:', customerReceipt);
      // In a real system, this would send to the actual printer
    }
    
    if (type === 'kitchen' || type === 'both') {
      const kitchenReceipt = await generateKitchenReceipt(order, businessSettings);
      console.log('Kitchen Receipt:', kitchenReceipt);
      // In a real system, this would send to the actual printer
    }
    
    return true;
  } catch (error) {
    console.error('Error printing receipt:', error);
    return false;
  }
};

// Function to detect available printers
export const detectPrinters = async (): Promise<string[]> => {
  // In a real implementation, this would detect actual printers
  // For now, return a simulated list
  return ['POS-58 Printer', 'Epson TM-T20', 'Star Micronics TSP100'];
};

// Function to print a test page
export const printTestPage = async (): Promise<boolean> => {
  try {
    const printerSettings = await getPrinterSettings();
    
    if (!printerSettings || !printerSettings.printerName) {
      console.error('No printer selected');
      return false;
    }
    
    const testPage = `
----------------------------------------
TESTE DE IMPRESSÃO
----------------------------------------
Impressora: ${printerSettings.printerName}
Data/Hora: ${format(new Date(), 'dd/MM/yyyy HH:mm:ss', { locale: pt })}
----------------------------------------
1...2...3...4...5...6...7...8...9...10
----------------------------------------
TESTE CONCLUÍDO COM SUCESSO!
----------------------------------------
`;
    
    console.log('Test Page:', testPage);
    // In a real system, this would send to the actual printer
    
    return true;
  } catch (error) {
    console.error('Error printing test page:', error);
    return false;
  }
};

// Function to install printer driver (simulation)
export const installPrinterDriver = async (driverType: 'windows' | 'mac'): Promise<boolean> => {
  // In a real system, this would download and install the appropriate driver
  console.log(`Simulating ${driverType} driver installation...`);
  
  // Simulate a delay for "installation"
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return true;
};

// Function to connect to a printer via WebUSB
export const connectWebUSB = async (): Promise<boolean> => {
  // In a real system, this would use the WebUSB API
  console.log('Simulating WebUSB connection...');
  
  // Simulate a delay for "connection"
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return true;
};
