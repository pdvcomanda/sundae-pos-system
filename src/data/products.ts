
import { Product, Size } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Açaí Tradicional',
    description: 'Puro açaí batido na hora',
    category: 'acai',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    basePrice: 12.00,
    price: 12.00,
  },
  {
    id: '2',
    name: 'Açaí com Banana',
    description: 'Açaí batido com banana',
    category: 'acai',
    image: 'https://images.unsplash.com/photo-1490323935964-3522e2be9db0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    basePrice: 14.00,
    price: 14.00,
  },
  {
    id: '3',
    name: 'Açaí com Morango',
    description: 'Açaí batido com morango',
    category: 'acai',
    image: 'https://images.unsplash.com/photo-1502825751399-28bde8401def?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    basePrice: 15.00,
    price: 15.00,
  },
  {
    id: '4',
    name: 'Sorvete de Chocolate',
    description: 'Sorvete cremoso de chocolate',
    category: 'sorvete',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    basePrice: 10.00,
    price: 10.00,
  },
  {
    id: '5',
    name: 'Sorvete de Baunilha',
    description: 'Sorvete cremoso de baunilha',
    category: 'sorvete',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    basePrice: 10.00,
    price: 10.00,
  },
  {
    id: '6',
    name: 'Sorvete de Morango',
    description: 'Sorvete cremoso de morango',
    category: 'sorvete',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    basePrice: 10.00,
    price: 10.00,
  },
];

export const sizes: Size[] = [
  {
    id: 'small',
    name: 'Pequeno',
    volume: '300ml',
    priceMultiplier: 1.0,
  },
  {
    id: 'medium',
    name: 'Médio',
    volume: '500ml',
    priceMultiplier: 1.5,
  },
  {
    id: 'large',
    name: 'Grande',
    volume: '700ml',
    priceMultiplier: 2.0,
  },
];
