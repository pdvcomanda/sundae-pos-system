
export type Product = {
  id: string;
  name: string;
  description: string;
  category: 'acai' | 'iceCream';
  image: string;
  basePrice: number;
};

export type Size = {
  id: string;
  name: string;
  volume: string;
  priceMultiplier: number;
};

export type Topping = {
  id: string;
  name: string;
  price: number;
  category: 'fruits' | 'sweets' | 'syrups' | 'other';
  image?: string;
};

export type OrderItem = {
  id: string;
  product: Product;
  size: Size;
  toppings: Topping[];
  quantity: number;
  notes?: string;
};

export type Order = {
  id: string;
  items: OrderItem[];
  total: number;
  orderNumber: number;
  createdAt: Date;
  status: 'pending' | 'completed' | 'cancelled';
};

export type User = {
  id: string;
  name: string;
  role: 'admin' | 'cashier';
};
