
import React, { createContext, useState, useContext } from 'react';
import { Product, Size, Topping, OrderItem, Order } from '../types';
import { toast } from 'sonner';

type OrderContextType = {
  currentOrder: Order | null;
  createNewOrder: () => void;
  addItemToOrder: (product: Product, size: Size, toppings: Topping[], quantity: number, notes?: string) => void;
  removeItemFromOrder: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  completeOrder: () => void;
  cancelOrder: () => void;
  clearOrder: () => void;
  orderHistory: Order[];
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

let orderCounter = 1;

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);

  const createNewOrder = () => {
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      items: [],
      total: 0,
      orderNumber: orderCounter++,
      createdAt: new Date(),
      date: new Date(),
      status: 'pending'
    };
    
    setCurrentOrder(newOrder);
    toast.success('Nova comanda criada');
  };

  const calculateOrderTotal = (items: OrderItem[]): number => {
    return items.reduce((total, item) => {
      const productPrice = item.product.basePrice * item.size.priceMultiplier;
      const toppingsPrice = item.toppings.reduce((sum, topping) => sum + topping.price, 0);
      return total + (productPrice + toppingsPrice) * item.quantity;
    }, 0);
  };

  const addItemToOrder = (product: Product, size: Size, toppings: Topping[], quantity: number, notes?: string) => {
    if (!currentOrder) {
      createNewOrder();
    }
    
    const newItem: OrderItem = {
      id: `item-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      product,
      size,
      quantity,
      price: product.price,
      toppings,
      notes
    };
    
    setCurrentOrder((prevOrder) => {
      if (!prevOrder) return null;
      
      const updatedItems = [...prevOrder.items, newItem];
      const updatedTotal = calculateOrderTotal(updatedItems);
      
      return {
        ...prevOrder,
        items: updatedItems,
        total: updatedTotal
      };
    });
    
    toast.success(`${product.name} adicionado ao pedido`);
  };

  const removeItemFromOrder = (itemId: string) => {
    if (!currentOrder) return;
    
    setCurrentOrder((prevOrder) => {
      if (!prevOrder) return null;
      
      const updatedItems = prevOrder.items.filter(item => item.id !== itemId);
      const updatedTotal = calculateOrderTotal(updatedItems);
      
      return {
        ...prevOrder,
        items: updatedItems,
        total: updatedTotal
      };
    });
    
    toast.info('Item removido do pedido');
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (!currentOrder) return;
    
    setCurrentOrder((prevOrder) => {
      if (!prevOrder) return null;
      
      const updatedItems = prevOrder.items.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      );
      const updatedTotal = calculateOrderTotal(updatedItems);
      
      return {
        ...prevOrder,
        items: updatedItems,
        total: updatedTotal
      };
    });
  };

  const completeOrder = () => {
    if (!currentOrder) return;
    
    setCurrentOrder((prevOrder) => {
      if (!prevOrder) return null;
      
      const completedOrder = { ...prevOrder, status: 'completed' as const };
      setOrderHistory((prevHistory) => [...prevHistory, completedOrder]);
      
      toast.success(`Pedido #${completedOrder.orderNumber} finalizado`);
      return null;
    });
  };

  const cancelOrder = () => {
    if (!currentOrder) return;
    
    setCurrentOrder((prevOrder) => {
      if (!prevOrder) return null;
      
      const cancelledOrder = { ...prevOrder, status: 'canceled' as const };
      setOrderHistory((prevHistory) => [...prevHistory, cancelledOrder]);
      
      toast.error(`Pedido #${cancelledOrder.orderNumber} cancelado`);
      return null;
    });
  };

  const clearOrder = () => {
    setCurrentOrder(null);
  };

  const value = {
    currentOrder,
    createNewOrder,
    addItemToOrder,
    removeItemFromOrder,
    updateItemQuantity,
    completeOrder,
    cancelOrder,
    clearOrder,
    orderHistory
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
