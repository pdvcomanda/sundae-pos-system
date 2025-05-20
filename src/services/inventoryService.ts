
import { supabase } from '@/integrations/supabase/client';
import { InventoryItem } from '@/types';

export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .order('name', { ascending: true });
  
  if (error) {
    console.error('Error fetching inventory items:', error);
    return [];
  }
  
  return data.map((item) => ({
    id: item.id,
    name: item.name,
    currentStock: Number(item.current_stock),
    minStock: Number(item.min_stock),
    unit: item.unit,
    status: item.status as 'critical' | 'low' | 'normal'
  }));
};

export const addInventoryItem = async (item: Omit<InventoryItem, 'id' | 'status'>): Promise<InventoryItem | null> => {
  const { data, error } = await supabase
    .from('inventory')
    .insert({
      name: item.name,
      current_stock: item.currentStock,
      min_stock: item.minStock,
      unit: item.unit
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
    currentStock: Number(data.current_stock),
    minStock: Number(data.min_stock),
    unit: data.unit,
    status: data.status as 'critical' | 'low' | 'normal'
  };
};

export const updateInventoryItem = async (item: Omit<InventoryItem, 'status'>): Promise<InventoryItem | null> => {
  const { data, error } = await supabase
    .from('inventory')
    .update({
      name: item.name,
      current_stock: item.currentStock,
      min_stock: item.minStock,
      unit: item.unit,
      updated_at: new Date()
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
    currentStock: Number(data.current_stock),
    minStock: Number(data.min_stock),
    unit: data.unit,
    status: data.status as 'critical' | 'low' | 'normal'
  };
};

export const addInventoryStock = async (id: string, quantity: number, notes: string = ''): Promise<boolean> => {
  const { error } = await supabase.rpc('add_inventory_stock', { 
    item_id: id,
    amount: quantity,
    note: notes
  });
  
  if (error) {
    console.error('Error adding inventory stock:', error);
    return false;
  }
  
  return true;
};

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
