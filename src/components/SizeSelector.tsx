
import React from 'react';
import { Size } from '@/types';
import { cn } from '@/lib/utils';

type SizeSelectorProps = {
  sizes: Size[];
  selectedSize: Size | null;
  onSelectSize: (size: Size) => void;
};

export function SizeSelector({ sizes, selectedSize, onSelectSize }: SizeSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-medium">Tamanho</h3>
      <div className="grid grid-cols-3 gap-3">
        {sizes.map((size) => (
          <div
            key={size.id}
            onClick={() => onSelectSize(size)}
            className={cn(
              "size-option flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer",
              selectedSize?.id === size.id ? "selected bg-primary/10" : "bg-card hover:bg-muted"
            )}
          >
            <span className="text-lg font-bold">{size.volume}</span>
            <span className="text-sm text-muted-foreground">{size.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
