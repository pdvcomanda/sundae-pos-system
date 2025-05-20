
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';

export const getUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('username', { ascending: true });
  
  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }
  
  return data.map((user) => ({
    id: user.id,
    username: user.username,
    fullName: user.full_name,
    role: user.role as 'admin' | 'operator',
    active: user.active
  }));
};

export const addUser = async (user: Omit<User, 'id'>): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .insert({
      username: user.username,
      full_name: user.fullName,
      role: user.role,
      active: user.active
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error adding user:', error);
    return null;
  }
  
  return {
    id: data.id,
    username: data.username,
    fullName: data.full_name,
    role: data.role as 'admin' | 'operator',
    active: data.active
  };
};

export const updateUser = async (user: User): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .update({
      username: user.username,
      full_name: user.fullName,
      role: user.role,
      active: user.active,
      updated_at: new Date()
    })
    .eq('id', user.id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating user:', error);
    return null;
  }
  
  return {
    id: data.id,
    username: data.username,
    fullName: data.full_name,
    role: data.role as 'admin' | 'operator',
    active: data.active
  };
};

export const deleteUser = async (userId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);
  
  if (error) {
    console.error('Error deleting user:', error);
    return false;
  }
  
  return true;
};
