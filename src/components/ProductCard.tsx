
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Product } from '@/types';

type ProductCardProps = {
  product: Product;
  onClick: (product: Product) => void;
};

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <Card 
      className="product-card overflow-hidden cursor-pointer h-full flex flex-col"
      onClick={() => onClick(product)}
    >
      <div className="aspect-square overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardContent className="p-4 flex-1">
        <h3 className="font-bold">{product.name}</h3>
        <p className="text-sm text-muted-foreground">{product.description}</p>
      </CardContent>
      <CardFooter className="pt-0 pb-4 px-4">
        <p className="text-primary font-medium">R$ {product.basePrice.toFixed(2)}</p>
      </CardFooter>
    </Card>
  );
}
