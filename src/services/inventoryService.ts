
import { supabase } from '@/integrations/supabase/client';
import { InventoryItem } from '@/types';

// Get all inventory items
export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .order('name', { ascending: true });
  
  if (error) {
    console.error('Error fetching inventory:', error);
    return [];
  }
  
  return data.map((item) => ({
    id: item.id,
    name: item.name,
    currentStock: item.current_stock,
    minStock: item.min_stock,
    unit: item.unit,
    status: item.status as 'critical' | 'low' | 'normal'
  }));
};

// Get one inventory item by ID
export const getInventoryItem = async (id: string): Promise<InventoryItem | null> => {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching inventory item:', error);
    return null;
  }
  
  return {
    id: data.id,
    name: data.name,
    currentStock: data.current_stock,
    minStock: data.min_stock,
    unit: data.unit,
    status: data.status as 'critical' | 'low' | 'normal'
  };
};

// Add new inventory item
export const addInventoryItem = async (item: Omit<InventoryItem, 'id' | 'status'>): Promise<InventoryItem | null> => {
  const { data, error } = await supabase
    .from('inventory')
    .insert({
      name: item.name,
      current_stock: item.currentStock,
      min_stock: item.minStock,
      unit: item.unit,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error adding inventory item:', error);
    return null;
  }
  
  return {
    id: data.id,
    name: data.name,
    currentStock: data.current_stock,
    minStock: data.min_stock,
    unit: data.unit,
    status: data.status as 'critical' | 'low' | 'normal'
  };
};

// Update inventory item
export const updateInventoryItem = async (item: Omit<InventoryItem, 'status'>): Promise<InventoryItem | null> => {
  const { data, error } = await supabase
    .from('inventory')
    .update({
      name: item.name,
      current_stock: item.currentStock,
      min_stock: item.minStock,
      unit: item.unit,
      updated_at: new Date().toISOString()
    })
    .eq('id', item.id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating inventory item:', error);
    return null;
  }
  
  return {
    id: data.id,
    name: data.name,
    currentStock: data.current_stock,
    minStock: data.min_stock,
    unit: data.unit,
    status: data.status as 'critical' | 'low' | 'normal'
  };
};

// Delete inventory item
export const deleteInventoryItem = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('inventory')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting inventory item:', error);
    return false;
  }
  
  return true;
};

// Add stock to inventory item
export const addStock = async (itemId: string, amount: number, note: string): Promise<boolean> => {
  try {
    // Call the RPC function we created in the migration
    const { data, error } = await supabase.rpc('add_inventory_stock', {
      item_id: itemId,
      amount,
      note
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding stock:', error);
    return false;
  }
};

// Reduce stock from inventory item
export const reduceStock = async (itemId: string, amount: number, reason: string): Promise<boolean> => {
  const negativeAmount = -Math.abs(amount);
  return await addStock(itemId, negativeAmount, reason);
};
