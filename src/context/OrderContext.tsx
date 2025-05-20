
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Order, OrderItem, Product, Size, Topping } from '@/types';
import { products as initialProducts } from '@/data/products';
import { toppings as initialToppings } from '@/data/toppings';

// Define the context type
type OrderContextType = {
  products: Product[];
  toppings: Topping[];
  currentOrder: Order | null;
  activeOrderItem: OrderItem | null;
  orderHistory: Order[]; // Added missing property
  startNewOrder: () => void;
  addProductToOrder: (product: Product, size: Size, quantity?: number) => void;
  updateOrderItemQuantity: (itemId: string, quantity: number) => void;
  addToppingToOrderItem: (topping: Topping) => void;
  removeToppingFromOrderItem: (toppingId: string) => void;
  updateOrderItemNotes: (notes: string) => void;
  saveOrderItem: () => void;
  removeOrderItem: (itemId: string) => void;
  finalizeOrder: () => void;
  cancelOrder: () => void;
  totalItems: number;
  orderTotal: number;
  orderNumber: number;
  completeOrder: () => void;
  
  // Added missing properties needed by components
  addItemToOrder: (product: Product, size: Size, toppings: Topping[], quantity: number, notes: string) => void;
  removeItemFromOrder: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  createNewOrder: () => void;
};

// Create context with default undefined value
const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Provider component
export const OrderProvider = ({ children }: { children: ReactNode }) => {
  // Convert the products to match our type
  const products = initialProducts.map(product => ({
    ...product,
    category: product.category as 'acai' | 'sorvete' | 'iceCream' | 'complemento'
  }));

  // Convert the toppings to match our type
  const toppings = initialToppings.map(topping => ({
    ...topping,
    category: topping.category as 'frutas' | 'complementos' | 'caldas' | 'sweets' | 'fruits' | 'syrups' | 'other'
  }));

  // State for current order
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [activeOrderItem, setActiveOrderItem] = useState<OrderItem | null>(null);
  const [orderNumber, setOrderNumber] = useState<number>(1);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);

  // Start a new order
  const startNewOrder = () => {
    const newOrder: Order = {
      id: uuidv4(),
      items: [],
      total: 0,
      date: new Date(),
      status: 'pending',
      orderNumber: orderNumber,
      createdAt: new Date(),
    };
    setCurrentOrder(newOrder);
    setOrderNumber(prev => prev + 1);
  };

  // Create a new order - alias for startNewOrder for API compatibility
  const createNewOrder = () => {
    startNewOrder();
  };

  // Add product to order
  const addProductToOrder = (product: Product, size: Size, quantity: number = 1) => {
    const orderItem: OrderItem = {
      id: uuidv4(),
      productId: product.id,
      productName: product.name,
      product: product,
      size: size,
      quantity: quantity,
      price: product.price * size.priceMultiplier * quantity,
      toppings: [],
      notes: '',
    };
    setActiveOrderItem(orderItem);
  };

  // Update order item quantity
  const updateOrderItemQuantity = (itemId: string, quantity: number) => {
    if (activeOrderItem && activeOrderItem.id === itemId) {
      const updatedItem = {
        ...activeOrderItem,
        quantity: quantity,
        price: (activeOrderItem.product.price * activeOrderItem.size.priceMultiplier * quantity) + 
          activeOrderItem.toppings.reduce((total, topping) => total + topping.price, 0),
      };
      setActiveOrderItem(updatedItem);
    } else if (currentOrder) {
      const updatedItems = currentOrder.items.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: quantity,
            price: (item.product.price * item.size.priceMultiplier * quantity) + 
              item.toppings.reduce((total, topping) => total + topping.price, 0),
          };
        }
        return item;
      });
      
      const updatedOrder = {
        ...currentOrder,
        items: updatedItems,
        total: updatedItems.reduce((total, item) => total + item.price, 0),
      };
      
      setCurrentOrder(updatedOrder);
    }
  };

  // Alias for updateOrderItemQuantity for API compatibility
  const updateItemQuantity = updateOrderItemQuantity;

  // Add topping to order item
  const addToppingToOrderItem = (topping: Topping) => {
    if (activeOrderItem) {
      const updatedToppings = [...activeOrderItem.toppings, topping];
      const updatedItem = {
        ...activeOrderItem,
        toppings: updatedToppings,
        price: activeOrderItem.product.price * activeOrderItem.size.priceMultiplier * activeOrderItem.quantity + 
          updatedToppings.reduce((total, topping) => total + topping.price, 0),
      };
      setActiveOrderItem(updatedItem);
    }
  };

  // Remove topping from order item
  const removeToppingFromOrderItem = (toppingId: string) => {
    if (activeOrderItem) {
      const updatedToppings = activeOrderItem.toppings.filter(t => t.id !== toppingId);
      const updatedItem = {
        ...activeOrderItem,
        toppings: updatedToppings,
        price: activeOrderItem.product.price * activeOrderItem.size.priceMultiplier * activeOrderItem.quantity + 
          updatedToppings.reduce((total, topping) => total + topping.price, 0),
      };
      setActiveOrderItem(updatedItem);
    }
  };

  // Update order item notes
  const updateOrderItemNotes = (notes: string) => {
    if (activeOrderItem) {
      const updatedItem = {
        ...activeOrderItem,
        notes: notes,
      };
      setActiveOrderItem(updatedItem);
    }
  };

  // Save order item to the order
  const saveOrderItem = () => {
    if (activeOrderItem && currentOrder) {
      let updatedItems;
      // Check if the item already exists in the order
      const existingItemIndex = currentOrder.items.findIndex(item => item.id === activeOrderItem.id);
      
      if (existingItemIndex >= 0) {
        // Update existing item
        updatedItems = [...currentOrder.items];
        updatedItems[existingItemIndex] = activeOrderItem;
      } else {
        // Add new item
        updatedItems = [...currentOrder.items, activeOrderItem];
      }
      
      const updatedOrder = {
        ...currentOrder,
        items: updatedItems,
        total: updatedItems.reduce((total, item) => total + item.price, 0),
      };
      
      setCurrentOrder(updatedOrder);
      setActiveOrderItem(null);
    }
  };

  // Remove order item from order
  const removeOrderItem = (itemId: string) => {
    if (currentOrder) {
      const updatedItems = currentOrder.items.filter(item => item.id !== itemId);
      const updatedOrder = {
        ...currentOrder,
        items: updatedItems,
        total: updatedItems.reduce((total, item) => total + item.price, 0),
      };
      
      setCurrentOrder(updatedOrder);
    }
  };

  // Alias for removeOrderItem for API compatibility
  const removeItemFromOrder = removeOrderItem;

  // Finalize order
  const finalizeOrder = () => {
    if (currentOrder) {
      // In a real system, you would send the order to the backend
      console.log('Order finalized:', currentOrder);
      // Reset the current order and active item
      setCurrentOrder(null);
      setActiveOrderItem(null);
    }
  };

  // Cancel order
  const cancelOrder = () => {
    setCurrentOrder(null);
    setActiveOrderItem(null);
  };

  // Complete order (mark as completed)
  const completeOrder = () => {
    if (currentOrder) {
      const completedOrder = {
        ...currentOrder,
        status: 'completed' as const,
      };
      setOrderHistory(prev => [...prev, completedOrder]);
      setCurrentOrder(null);
      // In a real system, you would update the status in the backend
    }
  };

  // Add item directly to order - combines multiple steps for convenience
  const addItemToOrder = (
    product: Product, 
    size: Size, 
    toppings: Topping[], 
    quantity: number, 
    notes: string
  ) => {
    if (!currentOrder) {
      startNewOrder();
    }
    
    const itemPrice = product.basePrice * size.priceMultiplier;
    const toppingsPrice = toppings.reduce((sum, topping) => sum + topping.price, 0);
    const totalItemPrice = (itemPrice + toppingsPrice) * quantity;
    
    const orderItem: OrderItem = {
      id: uuidv4(),
      productId: product.id,
      productName: product.name,
      product: product,
      size: size,
      quantity: quantity,
      price: totalItemPrice,
      toppings: toppings,
      notes: notes,
    };
    
    setCurrentOrder(prevOrder => {
      if (!prevOrder) {
        // Create a new order if there isn't one
        const newOrder: Order = {
          id: uuidv4(),
          items: [orderItem],
          total: totalItemPrice,
          date: new Date(),
          status: 'pending',
          orderNumber: orderNumber,
          createdAt: new Date(),
        };
        setOrderNumber(prev => prev + 1);
        return newOrder;
      }
      
      // Add to existing order
      const updatedItems = [...prevOrder.items, orderItem];
      return {
        ...prevOrder,
        items: updatedItems,
        total: updatedItems.reduce((total, item) => total + item.price, 0),
      };
    });
  };

  // Calculate total items in the order
  const totalItems = currentOrder ? currentOrder.items.reduce((total, item) => total + item.quantity, 0) : 0;

  // Calculate order total
  const orderTotal = currentOrder ? currentOrder.total : 0;

  // Provide the context value
  const contextValue: OrderContextType = {
    products,
    toppings,
    currentOrder,
    activeOrderItem,
    orderHistory,
    startNewOrder,
    addProductToOrder,
    updateOrderItemQuantity,
    addToppingToOrderItem,
    removeToppingFromOrderItem,
    updateOrderItemNotes,
    saveOrderItem,
    removeOrderItem,
    finalizeOrder,
    cancelOrder,
    completeOrder,
    totalItems,
    orderTotal,
    orderNumber,
    // Add the new alias functions
    addItemToOrder,
    removeItemFromOrder,
    updateItemQuantity,
    createNewOrder,
  };

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
};

// Custom hook to use the order context
export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
