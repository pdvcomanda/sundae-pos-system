
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; 
import { Order, OrderItem, Product, Size, Topping } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { printReceipt } from '@/services/printerService';
import { getPrinterSettings } from '@/services/settingsService';
import { useToast } from '@/hooks/use-toast';

interface OrderContextValue {
  currentOrder: Order | null;
  orderHistory: Order[];
  createNewOrder: () => void;
  addItemToOrder: (product: Product, size: Size, toppings: Topping[], quantity: number, notes?: string) => void;
  removeItemFromOrder: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  completeOrder: () => Promise<void>;
  cancelOrder: () => void;
  clearOrderHistory: () => void;
  loading: boolean;
}

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [nextOrderNumber, setNextOrderNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Load order history from database when component mounts
  useEffect(() => {
    const loadOrders = async () => {
      try {
        // Fetch the latest orders
        const { data: orders, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);
        
        if (error) {
          throw error;
        }
        
        // Get the next order number from sequence
        const { data: seqData, error: seqError } = await supabase
          .rpc('get_next_order_number');
        
        if (seqError) {
          throw seqError;
        }
        
        setNextOrderNumber(seqData || 1);
        
        // For each order, fetch its items
        const ordersWithItems: Order[] = [];
        
        for (const order of orders) {
          const { data: items, error: itemsError } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', order.id);
          
          if (itemsError) {
            console.error('Error fetching order items:', itemsError);
            continue;
          }
          
          // For each item, fetch its toppings
          const orderItems: OrderItem[] = [];
          
          for (const item of items) {
            // Get toppings for this item
            const { data: toppings, error: toppingsError } = await supabase
              .from('order_item_toppings')
              .select('*, toppings(*)')
              .eq('order_item_id', item.id);
            
            if (toppingsError) {
              console.error('Error fetching toppings:', toppingsError);
              continue;
            }
            
            // Get product details
            const { data: product, error: productError } = await supabase
              .from('products')
              .select('*')
              .eq('id', item.product_id)
              .single();
            
            if (productError) {
              console.error('Error fetching product:', productError);
              continue;
            }
            
            // Get size details
            const { data: size, error: sizeError } = await supabase
              .from('sizes')
              .select('*')
              .eq('id', item.size_id)
              .single();
            
            if (sizeError) {
              console.error('Error fetching size:', sizeError);
              continue;
            }
            
            const formattedToppings = toppings.map(t => ({
              id: t.toppings.id,
              name: t.toppings.name,
              price: t.toppings.price,
              category: t.toppings.category,
              image: t.toppings.image
            }));
            
            orderItems.push({
              id: item.id,
              productId: item.product_id,
              productName: item.product_name,
              product: {
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                basePrice: product.base_price,
                image: product.image,
                category: product.category as any,
              },
              size: {
                id: size.id,
                name: size.name,
                volume: size.volume,
                priceMultiplier: size.price_multiplier,
              },
              quantity: item.quantity,
              price: item.price,
              toppings: formattedToppings,
              notes: item.notes,
            });
          }
          
          ordersWithItems.push({
            id: order.id,
            items: orderItems,
            total: order.total,
            status: order.status as 'pending' | 'completed' | 'canceled',
            orderNumber: order.order_number,
            date: new Date(),
            createdAt: new Date(order.created_at)
          });
        }
        
        setOrderHistory(ordersWithItems);
      } catch (error) {
        console.error('Error loading orders:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os pedidos anteriores',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadOrders();
  }, [toast]);

  // Create a new order
  const createNewOrder = () => {
    const newOrder: Order = {
      id: uuidv4(),
      items: [],
      total: 0,
      status: 'pending',
      orderNumber: nextOrderNumber,
      date: new Date(),
      createdAt: new Date()
    };
    
    setCurrentOrder(newOrder);
    setNextOrderNumber(prev => prev + 1);
  };

  // Add item to order
  const addItemToOrder = (product: Product, size: Size, toppings: Topping[], quantity: number, notes?: string) => {
    if (!currentOrder) {
      createNewOrder();
      return;
    }
    
    const itemPrice = product.basePrice * size.priceMultiplier;
    const toppingsPrice = toppings.reduce((sum, topping) => sum + topping.price, 0);
    const totalItemPrice = (itemPrice + toppingsPrice) * quantity;
    
    const newItem: OrderItem = {
      id: uuidv4(),
      productId: product.id,
      productName: product.name,
      product,
      size,
      quantity,
      price: totalItemPrice,
      toppings,
      notes
    };
    
    setCurrentOrder(prevOrder => {
      if (!prevOrder) return null;
      
      const updatedItems = [...prevOrder.items, newItem];
      const newTotal = updatedItems.reduce((sum, item) => sum + item.price, 0);
      
      return {
        ...prevOrder,
        items: updatedItems,
        total: newTotal
      };
    });
  };

  // Remove item from order
  const removeItemFromOrder = (itemId: string) => {
    setCurrentOrder(prevOrder => {
      if (!prevOrder) return null;
      
      const updatedItems = prevOrder.items.filter(item => item.id !== itemId);
      const newTotal = updatedItems.reduce((sum, item) => sum + item.price, 0);
      
      return {
        ...prevOrder,
        items: updatedItems,
        total: newTotal
      };
    });
  };

  // Update item quantity
  const updateItemQuantity = (itemId: string, quantity: number) => {
    setCurrentOrder(prevOrder => {
      if (!prevOrder) return null;
      
      const updatedItems = prevOrder.items.map(item => {
        if (item.id === itemId) {
          const singleItemPrice = item.price / item.quantity;
          return {
            ...item,
            quantity,
            price: singleItemPrice * quantity
          };
        }
        return item;
      });
      
      const newTotal = updatedItems.reduce((sum, item) => sum + item.price, 0);
      
      return {
        ...prevOrder,
        items: updatedItems,
        total: newTotal
      };
    });
  };

  // Complete an order
  const completeOrder = async () => {
    if (!currentOrder || currentOrder.items.length === 0) return;
    
    try {
      setLoading(true);
      
      // Save order to database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          id: currentOrder.id,
          total: currentOrder.total,
          status: 'completed',
          order_number: currentOrder.orderNumber
        })
        .select()
        .single();
      
      if (orderError) {
        throw orderError;
      }
      
      // Save order items
      for (const item of currentOrder.items) {
        const { data: itemData, error: itemError } = await supabase
          .from('order_items')
          .insert({
            id: item.id,
            order_id: currentOrder.id,
            product_id: item.productId,
            product_name: item.productName,
            size_id: item.size.id,
            quantity: item.quantity,
            price: item.price,
            notes: item.notes || ''
          })
          .select()
          .single();
        
        if (itemError) {
          console.error('Error saving order item:', itemError);
          continue;
        }
        
        // Save toppings for this item
        for (const topping of item.toppings) {
          const { error: toppingError } = await supabase
            .from('order_item_toppings')
            .insert({
              order_item_id: item.id,
              topping_id: topping.id
            });
          
          if (toppingError) {
            console.error('Error saving topping:', toppingError);
          }
        }
      }
      
      // Update state
      const completedOrder: Order = {
        ...currentOrder,
        status: 'completed',
        createdAt: new Date(orderData.created_at)
      };
      
      setOrderHistory(prev => [completedOrder, ...prev]);
      setCurrentOrder(null);
      
      // Get printer settings and print receipts if configured
      const printerSettings = await getPrinterSettings();
      if (printerSettings?.autoPrint) {
        let receiptType: 'customer' | 'kitchen' | 'both' = 'both';
        
        if (printerSettings.printCustomerReceipt && !printerSettings.printKitchenReceipt) {
          receiptType = 'customer';
        } else if (!printerSettings.printCustomerReceipt && printerSettings.printKitchenReceipt) {
          receiptType = 'kitchen';
        }
        
        await printReceipt(completedOrder, receiptType);
      }
      
      toast({
        title: 'Pedido Finalizado',
        description: `Comanda #${completedOrder.orderNumber} finalizada com sucesso`,
      });
    } catch (error) {
      console.error('Error completing order:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível finalizar o pedido',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Cancel an order
  const cancelOrder = async () => {
    if (!currentOrder) return;
    
    try {
      // If the order has been saved to the database, update its status
      if (orderHistory.some(order => order.id === currentOrder.id)) {
        await supabase
          .from('orders')
          .update({ status: 'canceled' })
          .eq('id', currentOrder.id);
      }
      
      const canceledOrder = { ...currentOrder, status: 'canceled' as const };
      setOrderHistory(prev => [canceledOrder, ...prev.filter(o => o.id !== canceledOrder.id)]);
      setCurrentOrder(null);
      
      toast({
        title: 'Pedido Cancelado',
        description: `Comanda #${canceledOrder.orderNumber} foi cancelada`,
      });
    } catch (error) {
      console.error('Error canceling order:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível cancelar o pedido',
        variant: 'destructive'
      });
    }
  };

  // Clear order history
  const clearOrderHistory = () => {
    setOrderHistory([]);
  };

  return (
    <OrderContext.Provider
      value={{
        currentOrder,
        orderHistory,
        createNewOrder,
        addItemToOrder,
        removeItemFromOrder,
        updateItemQuantity,
        completeOrder,
        cancelOrder,
        clearOrderHistory,
        loading
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
