
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useOrder } from '@/context/OrderContext';

export function OrderSummary() {
  const { currentOrder, removeItemFromOrder, updateItemQuantity, completeOrder, cancelOrder, createNewOrder } = useOrder();

  if (!currentOrder) {
    return (
      <Card className="order-summary">
        <CardHeader>
          <CardTitle>Comanda</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="mb-4">Nenhuma comanda aberta</p>
          <Button onClick={createNewOrder}>Nova Comanda</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="order-summary">
      <CardHeader className="border-b">
        <CardTitle>Comanda #{currentOrder.orderNumber}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {currentOrder.items.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-muted-foreground">Nenhum item adicionado</p>
          </div>
        ) : (
          <div>
            {currentOrder.items.map((item) => {
              const itemPrice = item.product.basePrice * item.size.priceMultiplier;
              const toppingsPrice = item.toppings.reduce((sum, topping) => sum + topping.price, 0);
              const totalItemPrice = (itemPrice + toppingsPrice) * item.quantity;
              
              return (
                <div key={item.id} className="border-b p-4">
                  <div className="flex justify-between mb-1">
                    <div className="font-medium">{item.product.name}</div>
                    <div className="font-bold">R$ {totalItemPrice.toFixed(2)}</div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-1">
                    {item.size.name} ({item.size.volume})
                  </div>
                  
                  {item.toppings.length > 0 && (
                    <div className="text-sm text-muted-foreground mb-2">
                      + {item.toppings.map(t => t.name).join(', ')}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItemFromOrder(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex-col border-t p-4 gap-4">
        <div className="w-full flex justify-between py-2">
          <div className="font-bold text-lg">Total</div>
          <div className="font-bold text-lg">R$ {currentOrder.total.toFixed(2)}</div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 w-full">
          <Button variant="outline" onClick={cancelOrder}>
            Cancelar
          </Button>
          <Button 
            onClick={completeOrder}
            disabled={currentOrder.items.length === 0}
          >
            Finalizar
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
