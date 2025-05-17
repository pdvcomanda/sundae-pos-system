
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ReportsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Relatórios</h2>
        <p className="text-muted-foreground">Visualize o desempenho do seu negócio.</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Relatórios de Vendas</CardTitle>
            <CardDescription>Analise suas vendas por período</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">Relatórios disponíveis:</p>
              <div className="space-y-2">
                <div className="p-3 rounded-md border hover:bg-muted cursor-pointer">
                  Vendas por dia
                </div>
                <div className="p-3 rounded-md border hover:bg-muted cursor-pointer">
                  Vendas por produto
                </div>
                <div className="p-3 rounded-md border hover:bg-muted cursor-pointer">
                  Vendas por hora
                </div>
                <div className="p-3 rounded-md border hover:bg-muted cursor-pointer">
                  Ticket médio
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Estoque e Consumo</CardTitle>
            <CardDescription>Monitore seu inventário</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">Relatórios disponíveis:</p>
              <div className="space-y-2">
                <div className="p-3 rounded-md border hover:bg-muted cursor-pointer">
                  Itens com baixo estoque
                </div>
                <div className="p-3 rounded-md border hover:bg-muted cursor-pointer">
                  Consumo de insumos
                </div>
                <div className="p-3 rounded-md border hover:bg-muted cursor-pointer">
                  Histórico de compras
                </div>
                <div className="p-3 rounded-md border hover:bg-muted cursor-pointer">
                  Validade de produtos
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;
