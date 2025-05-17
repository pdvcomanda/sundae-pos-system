
// Adicionando o tipo Size que estava faltando, causando o erro
export type Size = '300ml' | '500ml' | '700ml';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'acai' | 'sorvete' | 'complemento';
  available_sizes?: Size[];
};

export type Topping = {
  id: string;
  name: string;
  price: number | null;
  category: 'frutas' | 'complementos' | 'caldas';
};

export type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  size?: Size;
  quantity: number;
  price: number;
  toppings: Topping[];
};

export type Order = {
  id: string;
  items: OrderItem[];
  total: number;
  date: Date;
  status: 'pending' | 'completed' | 'canceled';
};
