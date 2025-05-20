import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import * as inventoryService from '@/services/inventoryService';
import { InventoryItem } from '@/types';

const InventoryPage = () => {
  const { toast } = useToast();
  
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  useEffect(() => {
    loadInventory();
  }, []);
  
  const loadInventory = async () => {
    try {
      const items = await inventoryService.getInventoryItems();
      setInventory(items);
    } catch (error) {
      console.error('Error loading inventory:', error);
      toast({
        title: 'Error',
        description: 'Failed to load inventory items',
        variant: 'destructive'
      });
    }
  };
  
  const resetForm = () => {
    const form = document.getElementById('inventory-form') as HTMLFormElement;
    if (form) {
      form.reset();
    }
  };

  const addInventoryItem = async (formData: FormData) => {
    try {
      const name = formData.get('name') as string;
      const unit = formData.get('unit') as string;
      const currentStock = parseFloat(formData.get('currentStock') as string);
      const minStock = parseFloat(formData.get('minStock') as string);
      
      if (!name || !unit || isNaN(currentStock) || isNaN(minStock)) {
        throw new Error('All fields are required');
      }

      setIsSubmitting(true);
      const newItem = await inventoryService.addInventoryItem({
        name,
        unit,
        currentStock,
        minStock
      });
      
      if (newItem) {
        toast({
          title: 'Item Added',
          description: `${newItem.name} has been added to inventory.`
        });
        setInventory([...inventory, newItem]);
        setDialogOpen(false);
        resetForm();
      } else {
        throw new Error('Failed to add inventory item');
      }
    } catch (error) {
      console.error('Error adding inventory item:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateInventoryItem = async (formData: FormData) => {
    try {
      const id = formData.get('id') as string;
      const name = formData.get('name') as string;
      const unit = formData.get('unit') as string;
      const currentStock = parseFloat(formData.get('currentStock') as string);
      const minStock = parseFloat(formData.get('minStock') as string);
      
      if (!id || !name || !unit || isNaN(currentStock) || isNaN(minStock)) {
        throw new Error('All fields are required');
      }

      setIsSubmitting(true);
      const updatedItem = await inventoryService.updateInventoryItem({
        id,
        name,
        unit,
        currentStock,
        minStock
      });
      
      if (updatedItem) {
        toast({
          title: 'Item Updated',
          description: `${updatedItem.name} has been updated.`
        });
        setInventory(inventory.map(item => (item.id === id ? updatedItem : item)));
        setDialogOpen(false);
        resetForm();
      } else {
        throw new Error('Failed to update inventory item');
      }
    } catch (error) {
      console.error('Error updating inventory item:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (isEditing) {
      await updateInventoryItem(formData);
    } else {
      await addInventoryItem(formData);
    }
  };
  
  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      await inventoryService.deleteInventoryItem(itemToDelete);
      setInventory(inventory.filter(item => item.id !== itemToDelete));
      toast({
        title: 'Item Deleted',
        description: 'Item has been deleted from inventory.'
      });
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete inventory item',
        variant: 'destructive'
      });
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };
  
  const openEditDialog = (item: InventoryItem) => {
    setIsEditing(true);
    setDialogOpen(true);
    
    // Populate the form with the item's data
    setTimeout(() => {
      const form = document.getElementById('inventory-form') as HTMLFormElement;
      if (form) {
        form.querySelector<HTMLInputElement>('input[name="id"]')?.value = item.id;
        form.querySelector<HTMLInputElement>('input[name="name"]')?.value = item.name;
        form.querySelector<HTMLInputElement>('input[name="currentStock"]')?.value = item.currentStock.toString();
        form.querySelector<HTMLInputElement>('input[name="minStock"]')?.value = item.minStock.toString();
        form.querySelector<HTMLInputElement>('input[name="unit"]')?.value = item.unit;
      }
    }, 0);
  };
  
  const openAddDialog = () => {
    setIsEditing(false);
    setDialogOpen(true);
  };
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Inventory</h1>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Inventory List</CardTitle>
          <CardDescription>Manage your inventory items</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventory.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.currentStock}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.minStock}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(item)}>
                        <Edit className="mr-2 h-4 w-4" />Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive ml-2"
                        onClick={() => {
                          setItemToDelete(item.id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Item' : 'Add Item'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Edit an existing item in the inventory.' : 'Add a new item to the inventory.'}
            </DialogDescription>
          </DialogHeader>
          <form id="inventory-form" onSubmit={handleSubmit}>
            {isEditing && <input type="hidden" name="id" />}
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input type="text" id="name" name="name" placeholder="Item Name" required />
              </div>
              <div>
                <Label htmlFor="currentStock">Current Stock</Label>
                <Input type="number" id="currentStock" name="currentStock" placeholder="Current Stock" required />
              </div>
              <div>
                <Label htmlFor="minStock">Min Stock</Label>
                <Input type="number" id="minStock" name="minStock" placeholder="Minimum Stock" required />
              </div>
              <div>
                <Label htmlFor="unit">Unit</Label>
                <Input type="text" id="unit" name="unit" placeholder="Unit (e.g., kg, piece)" required />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Update Item' : 'Add Item'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryPage;
