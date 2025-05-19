
// Definição de tamanhos com todas as propriedades necessárias
export type Size = {
  id: string;
  name: string;
  volume: string;
  priceMultiplier: number;
};

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

export type Topping = {
  id: string;
  name: string;
  price: number;
  category: 'frutas' | 'complementos' | 'caldas' | 'sweets' | 'fruits' | 'syrups' | 'other';
  image?: string;
};

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

export type Order = {
  id: string;
  items: OrderItem[];
  total: number;
  date: Date;
  status: 'pending' | 'completed' | 'canceled';
  orderNumber: number;
  createdAt: Date;
};
