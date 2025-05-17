
import React from 'react';
import { Topping } from '@/types';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

type ToppingsSelectorProps = {
  toppings: Topping[];
  selectedToppings: Topping[];
  onToggleTopping: (topping: Topping) => void;
};

export function ToppingsSelector({ toppings, selectedToppings, onToggleTopping }: ToppingsSelectorProps) {
  // Group toppings by category
  const toppingsByCategory = toppings.reduce((acc, topping) => {
    if (!acc[topping.category]) {
      acc[topping.category] = [];
    }
    acc[topping.category].push(topping);
    return acc;
  }, {} as Record<string, Topping[]>);

  // Translate category names
  const categoryNames: Record<string, string> = {
    'fruits': 'Frutas',
    'sweets': 'Doces',
    'syrups': 'Caldas',
    'other': 'Outros',
  };

  const isSelected = (topping: Topping) => {
    return selectedToppings.some(selected => selected.id === topping.id);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Complementos</h3>

      {Object.entries(toppingsByCategory).map(([category, categoryToppings]) => (
        <div key={category} className="space-y-2">
          <h4 className="text-sm text-muted-foreground">{categoryNames[category] || category}</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {categoryToppings.map((topping) => (
              <div
                key={topping.id}
                onClick={() => onToggleTopping(topping)}
                className={cn(
                  "topping-option flex items-center p-2 rounded-lg border cursor-pointer",
                  isSelected(topping) ? "selected bg-secondary/10" : "bg-card hover:bg-muted"
                )}
              >
                <div className="relative flex-shrink-0 h-10 w-10 mr-2 rounded-md overflow-hidden">
                  {topping.image ? (
                    <img 
                      src={topping.image} 
                      alt={topping.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-muted flex items-center justify-center">
                      <span className="text-xs">{topping.name.charAt(0)}</span>
                    </div>
                  )}
                  {isSelected(topping) && (
                    <div className="absolute inset-0 bg-secondary/50 flex items-center justify-center">
                      <Check className="h-6 w-6 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{topping.name}</p>
                  <p className="text-xs text-muted-foreground">+ R$ {topping.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
