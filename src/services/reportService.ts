
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderItem, Product } from '@/types';

// Sales by day report
export const getSalesByDay = async (startDate: Date, endDate: Date): Promise<{ date: string; total: number; orders: number }[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Error fetching sales by day:', error);
    return [];
  }
  
  // Group by date and sum totals
  const salesByDay: Record<string, { total: number; orders: number }> = {};
  
  data.forEach((order) => {
    const date = new Date(order.created_at).toISOString().split('T')[0];
    if (!salesByDay[date]) {
      salesByDay[date] = { total: 0, orders: 0 };
    }
    
    salesByDay[date].total += Number(order.total);
    salesByDay[date].orders += 1;
  });
  
  // Convert to array
  return Object.entries(salesByDay).map(([date, { total, orders }]) => ({
    date,
    total,
    orders
  }));
};

// Sales by product report
export const getSalesByProduct = async (startDate: Date, endDate: Date): Promise<{ productId: string; productName: string; quantity: number; total: number }[]> => {
  // First get all orders in the date range
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('id')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());
  
  if (ordersError || !orders.length) {
    console.error('Error fetching orders for product report:', ordersError);
    return [];
  }
  
  // Get all order items for these orders
  const orderIds = orders.map(order => order.id);
  
  const { data: orderItems, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .in('order_id', orderIds);
  
  if (itemsError) {
    console.error('Error fetching order items:', itemsError);
    return [];
  }
  
  // Group by product
  const salesByProduct: Record<string, { productId: string; productName: string; quantity: number; total: number }> = {};
  
  orderItems.forEach((item) => {
    if (!salesByProduct[item.product_id]) {
      salesByProduct[item.product_id] = {
        productId: item.product_id,
        productName: item.product_name,
        quantity: 0,
        total: 0
      };
    }
    
    salesByProduct[item.product_id].quantity += item.quantity;
    salesByProduct[item.product_id].total += Number(item.price) * item.quantity;
  });
  
  // Convert to array and sort by total sales
  return Object.values(salesByProduct).sort((a, b) => b.total - a.total);
};

// Sales by hour report
export const getSalesByHour = async (startDate: Date, endDate: Date): Promise<{ hour: number; total: number; orders: number }[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());
  
  if (error) {
    console.error('Error fetching sales by hour:', error);
    return [];
  }
  
  // Group by hour and sum totals
  const salesByHour: Record<number, { total: number; orders: number }> = {};
  
  // Initialize with all hours of the day
  for (let i = 0; i < 24; i++) {
    salesByHour[i] = { total: 0, orders: 0 };
  }
  
  data.forEach((order) => {
    const hour = new Date(order.created_at).getHours();
    
    salesByHour[hour].total += Number(order.total);
    salesByHour[hour].orders += 1;
  });
  
  // Convert to array
  return Object.entries(salesByHour).map(([hour, { total, orders }]) => ({
    hour: parseInt(hour),
    total,
    orders
  }));
};

// Average ticket size
export const getAverageTicket = async (startDate: Date, endDate: Date): Promise<number> => {
  const { data, error } = await supabase
    .from('orders')
    .select('total')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())
    .eq('status', 'completed');
  
  if (error || !data.length) {
    console.error('Error fetching average ticket:', error);
    return 0;
  }
  
  const sum = data.reduce((acc, order) => acc + Number(order.total), 0);
  return sum / data.length;
};

// Popular toppings
export const getPopularToppings = async (startDate: Date, endDate: Date): Promise<{ toppingId: string; toppingName: string; count: number }[]> => {
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('id')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());
  
  if (ordersError || !orders.length) {
    console.error('Error fetching orders for toppings report:', ordersError);
    return [];
  }
  
  // Get all order items for these orders
  const orderIds = orders.map(order => order.id);
  
  const { data: orderItems, error: itemsError } = await supabase
    .from('order_items')
    .select('id')
    .in('order_id', orderIds);
  
  if (itemsError || !orderItems.length) {
    console.error('Error fetching order items:', itemsError);
    return [];
  }
  
  // Get all toppings for these order items
  const orderItemIds = orderItems.map(item => item.id);
  
  const { data: toppingsData, error: toppingsError } = await supabase
    .from('order_item_toppings')
    .select('topping_id, toppings(id, name)')
    .in('order_item_id', orderItemIds);
  
  if (toppingsError) {
    console.error('Error fetching order item toppings:', toppingsError);
    return [];
  }
  
  // Count toppings
  const toppingCounts: Record<string, { toppingId: string; toppingName: string; count: number }> = {};
  
  toppingsData.forEach((item) => {
    const toppingId = item.topping_id;
    const toppingName = item.toppings?.name || 'Unknown';
    
    if (!toppingCounts[toppingId]) {
      toppingCounts[toppingId] = {
        toppingId,
        toppingName,
        count: 0
      };
    }
    
    toppingCounts[toppingId].count += 1;
  });
  
  // Convert to array and sort by count
  return Object.values(toppingCounts).sort((a, b) => b.count - a.count);
};
