
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const InventoryPage = () => {
  const inventory = [
    { id: 1, name: 'Açaí Base', stock: 15, unit: 'kg', status: 'normal', minStock: 5 },
    { id: 2, name: 'Morangos', stock: 3, unit: 'kg', status: 'low', minStock: 5 },
    { id: 3, name: 'Bananas', stock: 8, unit: 'kg', status: 'normal', minStock: 4 },
    { id: 4, name: 'Leite Condensado', stock: 12, unit: 'latas', status: 'normal', minStock: 6 },
    { id: 5, name: 'Granola', stock: 2, unit: 'kg', status: 'low', minStock: 3 },
    { id: 6, name: 'Chocolate Granulado', stock: 4, unit: 'kg', status: 'normal', minStock: 2 },
    { id: 7, name: 'Sorvete Chocolate', stock: 1, unit: 'baldes', status: 'critical', minStock: 2 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Controle de Estoque</h2>
        <p className="text-muted-foreground">Gerencie o estoque de produtos e insumos.</p>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
            Crítico: 1
          </Badge>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">
            Baixo: 2
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
            Normal: 4
          </Badge>
        </div>
        
        <Button size="sm">+ Novo Item</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Inventário</CardTitle>
          <CardDescription>Controle de estoque de insumos e produtos</CardDescription>
        </CardHeader>
        <CardContent>
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
                  <TableCell>{item.stock} {item.unit}</TableCell>
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
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm">
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      + Adicionar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryPage;
