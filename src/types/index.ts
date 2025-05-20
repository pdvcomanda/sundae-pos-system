
// Size definition
export type Size = {
  id: string;
  name: string;
  volume: string;
  priceMultiplier: number;
};

// Product definition
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  basePrice: number;
  image: string;
  category: 'acai' | 'sorvete' | 'iceCream' | 'complemento';
  available_sizes?: Size[];
};

// Topping definition
export type Topping = {
  id: string;
  name: string;
  price: number;
  category: 'frutas' | 'complementos' | 'caldas' | 'sweets' | 'fruits' | 'syrups' | 'other';
  image?: string;
};

// OrderItem definition
export type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  product: Product;
  size: Size;
  quantity: number;
  price: number;
  toppings: Topping[];
  notes?: string;
};

// Order definition
export type Order = {
  id: string;
  items: OrderItem[];
  total: number;
  date: Date;
  status: 'pending' | 'completed' | 'canceled';
  orderNumber: number;
  createdAt: Date;
};

// Business settings definition
export type BusinessSettings = {
  id: string;
  businessName: string;
  address: string;
  phone: string;
  email: string;
  logoUrl: string;
};

// Printer settings definition
export type PrinterSettings = {
  id: string;
  connectionType: 'bluetooth' | 'usb';
  printerName: string;
  printerAddress: string;
  autoPrint: boolean;
  printCustomerReceipt: boolean;
  printKitchenReceipt: boolean;
};

// System settings definition
export type SystemSettings = {
  id: string;
  darkMode: boolean;
  lastBackupAt?: Date;
  whatsappEnabled: boolean;
  whatsappNumber?: string;
  chatbotEnabled: boolean;
  chatbotWelcomeMessage: string;
};

// User definition
export type User = {
  id: string;
  username: string;
  fullName: string;
  role: 'admin' | 'operator';
  active: boolean;
};

// Inventory item definition
export type InventoryItem = {
  id: string;
  name: string;
  currentStock: number;
  minStock: number;
  unit: string;
  status: 'critical' | 'low' | 'normal';
};

// WhatsApp message definition
export type WhatsAppMessage = {
  id: string;
  phoneNumber: string;
  message: string;
  direction: 'incoming' | 'outgoing';
  processed: boolean;
  createdAt: Date;
};
