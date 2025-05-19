
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCard } from './ProductCard';
import { SizeSelector } from './SizeSelector';
import { ToppingsSelector } from './ToppingsSelector';
import { OrderSummary } from './OrderSummary';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useOrder } from '@/context/OrderContext';
import { products } from '@/data/products';
import { toppings } from '@/data/toppings';
import { Product, Size, Topping } from '@/types';
import { sizes } from '@/data/products';

export function NewOrder() {
  const { addItemToOrder, currentOrder, createNewOrder } = useOrder();
  
  // Product selection state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  
  // Filter products by category
  const acaiProducts = products.filter(p => p.category === 'acai');
  const iceCreamProducts = products.filter(p => p.category === 'sorvete');
  
  // Handle product selection
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };
  
  // Toggle topping selection
  const handleToggleTopping = (topping: Topping) => {
    setSelectedToppings(prev => {
      const exists = prev.some(t => t.id === topping.id);
      if (exists) {
        return prev.filter(t => t.id !== topping.id);
      } else {
        return [...prev, topping];
      }
    });
  };
  
  // Add current selection to order
  const handleAddToOrder = () => {
    if (selectedProduct && selectedSize) {
      if (!currentOrder) {
        createNewOrder();
      }
      
      addItemToOrder(
        selectedProduct,
        selectedSize,
        selectedToppings,
        quantity,
        notes
      );
      
      // Reset selections
      setSelectedProduct(null);
      setSelectedSize(null);
      setSelectedToppings([]);
      setQuantity(1);
      setNotes('');
    }
  };
  
  // Close product dialog
  const handleCloseDialog = () => {
    setSelectedProduct(null);
  };
  
  // Increment/decrement quantity
  const incrementQuantity = () => setQuantity(q => q + 1);
  const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1));
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Nova Venda</h2>
          <p className="text-muted-foreground">Selecione os produtos para adicionar à comanda.</p>
        </div>
        
        <Tabs defaultValue="acai" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="acai">Açaí</TabsTrigger>
            <TabsTrigger value="iceCream">Sorvetes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="acai" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {acaiProducts.map((product) => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  onClick={handleProductSelect}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="iceCream" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {iceCreamProducts.map((product) => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  onClick={handleProductSelect}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div>
        <OrderSummary />
      </div>
      
      {/* Product customization dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={open => !open && handleCloseDialog()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <SizeSelector 
              sizes={sizes}
              selectedSize={selectedSize}
              onSelectSize={setSelectedSize}
            />
            
            <ToppingsSelector 
              toppings={toppings}
              selectedToppings={selectedToppings}
              onToggleTopping={handleToggleTopping}
            />
            
            <div className="space-y-3">
              <h3 className="font-medium">Observações</h3>
              <Textarea
                placeholder="Ex: Sem açúcar, colocar leite condensado à parte, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium">Quantidade</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={decrementQuantity}>-</Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button variant="outline" size="sm" onClick={incrementQuantity}>+</Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>Cancelar</Button>
            <Button 
              onClick={handleAddToOrder}
              disabled={!selectedSize}
            >
              Adicionar ao Pedido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
