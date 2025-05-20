
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { InventoryItem } from '@/types';
import { getInventoryItems, addInventoryItem, updateInventoryItem, addInventoryStock, deleteInventoryItem } from '@/services/inventoryService';

const InventoryPage = () => {
  const { toast } = useToast();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [stockDialogOpen, setStockDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [saving, setSaving] = useState(false);
  const [addingStock, setAddingStock] = useState(false);

  // Counts for status badges
  const criticalCount = inventory.filter(item => item.status === 'critical').length;
  const lowCount = inventory.filter(item => item.status === 'low').length;
  const normalCount = inventory.filter(item => item.status === 'normal').length;

  // Load inventory data
  useEffect(() => {
    const loadInventory = async () => {
      try {
        const items = await getInventoryItems();
        setInventory(items);
      } catch (error) {
        console.error('Error loading inventory:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar o estoque',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    loadInventory();
  }, [toast]);

  // Item form schema
  const itemFormSchema = z.object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    currentStock: z.number().min(0, 'Estoque deve ser zero ou positivo'),
    minStock: z.number().min(0, 'Estoque mínimo deve ser zero ou positivo'),
    unit: z.string().min(1, 'Unidade é obrigatória')
  });

  // Stock form schema
  const stockFormSchema = z.object({
    quantity: z.number().min(0.1, 'Quantidade deve ser maior que zero'),
    notes: z.string().optional()
  });

  // Item form
  const itemForm = useForm<z.infer<typeof itemFormSchema>>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      name: '',
      currentStock: 0,
      minStock: 0,
      unit: 'kg'
    }
  });

  // Stock form
  const stockForm = useForm<z.infer<typeof stockFormSchema>>({
    resolver: zodResolver(stockFormSchema),
    defaultValues: {
      quantity: 1,
      notes: ''
    }
  });

  // Open add item dialog
  const handleOpenAddItemDialog = () => {
    itemForm.reset({
      name: '',
      currentStock: 0,
      minStock: 0,
      unit: 'kg'
    });
    setDialogMode('add');
    setItemDialogOpen(true);
  };

  // Open edit item dialog
  const handleOpenEditItemDialog = (item: InventoryItem) => {
    itemForm.reset({
      name: item.name,
      currentStock: item.currentStock,
      minStock: item.minStock,
      unit: item.unit
    });
    setSelectedItem(item);
    setDialogMode('edit');
    setItemDialogOpen(true);
  };

  // Open add stock dialog
  const handleOpenAddStockDialog = (item: InventoryItem) => {
    stockForm.reset({
      quantity: 1,
      notes: ''
    });
    setSelectedItem(item);
    setStockDialogOpen(true);
  };

  // Open delete dialog
  const handleOpenDeleteDialog = (item: InventoryItem) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  // Submit item form
  const onItemFormSubmit = async (values: z.infer<typeof itemFormSchema>) => {
    setSaving(true);
    try {
      if (dialogMode === 'add') {
        const newItem = await addInventoryItem(values);
        if (newItem) {
          setInventory([...inventory, newItem]);
          toast({
            title: 'Item Adicionado',
            description: `${newItem.name} foi adicionado ao estoque`
          });
          setItemDialogOpen(false);
        }
      } else if (selectedItem) {
        const updatedItem = await updateInventoryItem({
          id: selectedItem.id,
          ...values
        });
        
        if (updatedItem) {
          setInventory(inventory.map(item => item.id === updatedItem.id ? updatedItem : item));
          toast({
            title: 'Item Atualizado',
            description: `${updatedItem.name} foi atualizado`
          });
          setItemDialogOpen(false);
        }
      }
    } catch (error) {
      console.error('Error saving inventory item:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o item de estoque',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  // Submit stock form
  const onStockFormSubmit = async (values: z.infer<typeof stockFormSchema>) => {
    if (!selectedItem) return;
    
    setAddingStock(true);
    try {
      const success = await addInventoryStock(selectedItem.id, values.quantity, values.notes);
      
      if (success) {
        // Refresh inventory after adding stock
        const items = await getInventoryItems();
        setInventory(items);
        
        toast({
          title: 'Estoque Adicionado',
          description: `${values.quantity} ${selectedItem.unit} adicionado ao estoque de ${selectedItem.name}`
        });
        setStockDialogOpen(false);
      }
    } catch (error) {
      console.error('Error adding stock:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar ao estoque',
        variant: 'destructive'
      });
    } finally {
      setAddingStock(false);
    }
  };

  // Delete item
  const handleDeleteItem = async () => {
    if (!selectedItem) return;
    
    try {
      const success = await deleteInventoryItem(selectedItem.id);
      
      if (success) {
        setInventory(inventory.filter(item => item.id !== selectedItem.id));
        toast({
          title: 'Item Removido',
          description: `${selectedItem.name} foi removido do estoque`
        });
        setDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o item de estoque',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Controle de Estoque</h2>
        <p className="text-muted-foreground">Gerencie o estoque de produtos e insumos.</p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
            Crítico: {criticalCount}
          </Badge>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">
            Baixo: {lowCount}
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
            Normal: {normalCount}
          </Badge>
        </div>
        
        <Button size="sm" onClick={handleOpenAddItemDialog}>
          <Plus className="h-4 w-4 mr-2" /> Novo Item
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Inventário</CardTitle>
          <CardDescription>Controle de estoque de insumos e produtos</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Estoque Atual</TableHead>
                  <TableHead>Estoque Mínimo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.currentStock} {item.unit}</TableCell>
                    <TableCell>{item.minStock} {item.unit}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          item.status === 'critical'
                            ? 'bg-red-50 text-red-700'
                            : item.status === 'low'
                            ? 'bg-yellow-50 text-yellow-700'
                            : 'bg-green-50 text-green-700'
                        }
                      >
                        {item.status === 'critical'
                          ? 'Crítico'
                          : item.status === 'low'
                          ? 'Baixo'
                          : 'Normal'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenEditItemDialog(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleOpenDeleteDialog(item)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleOpenAddStockDialog(item)}>
                          <Plus className="h-4 w-4 mr-1" /> Adicionar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {inventory.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Nenhum item no estoque. Clique em 'Novo Item' para adicionar.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Add/Edit Item Dialog */}
      <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogMode === 'add' ? 'Adicionar Item' : 'Editar Item'}</DialogTitle>
            <DialogDescription>
              {dialogMode === 'add' 
                ? 'Adicione um novo item ao estoque.' 
                : 'Edite as informações do item.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...itemForm}>
            <form onSubmit={itemForm.handleSubmit(onItemFormSubmit)} className="space-y-4">
              <FormField
                control={itemForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Item</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Açaí Base" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={itemForm.control}
                  name="currentStock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estoque Atual</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          min="0"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={itemForm.control}
                  name="minStock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estoque Mínimo</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          min="0"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={itemForm.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidade</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: kg, unidades, litros" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setItemDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {dialogMode === 'add' ? 'Adicionar' : 'Salvar'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Add Stock Dialog */}
      <Dialog open={stockDialogOpen} onOpenChange={setStockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Estoque</DialogTitle>
            <DialogDescription>
              Adicione quantidade ao estoque de {selectedItem?.name}.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...stockForm}>
            <form onSubmit={stockForm.handleSubmit(onStockFormSubmit)} className="space-y-4">
              <FormField
                control={stockForm.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade ({selectedItem?.unit})</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        min="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={stockForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Compra, reposição, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setStockDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={addingStock}>
                  {addingStock && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Adicionar
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Item Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover Item</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover {selectedItem?.name} do estoque? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteItem}>
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryPage;
