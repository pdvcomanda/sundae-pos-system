
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, DollarSign, ShoppingCart, Package, TrendingUp } from 'lucide-react';
import { useOrder } from '@/context/OrderContext';

export function Dashboard() {
  const { orderHistory } = useOrder();
  
  // Calculate statistics
  const totalSales = orderHistory
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + order.total, 0);
  
  const totalOrders = orderHistory.filter(order => order.status === 'completed').length;
  
  const averageTicket = totalOrders > 0 ? totalSales / totalOrders : 0;
  
  // Get popular products
  const popularProducts = orderHistory
    .filter(order => order.status === 'completed')
    .flatMap(order => order.items)
    .reduce((acc: Record<string, number>, item) => {
      const productId = item.product.id;
      acc[productId] = (acc[productId] || 0) + item.quantity;
      return acc;
    }, {});
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Visão geral das suas vendas e estatísticas.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Totais</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalSales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              +12.5% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <ArrowUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {averageTicket.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +7.2% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Itens precisam de reposição
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Vendas Recentes</CardTitle>
            <CardDescription>Você fez {totalOrders} vendas hoje</CardDescription>
          </CardHeader>
          <CardContent>
            {orderHistory.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">Nenhuma venda registrada ainda</p>
            ) : (
              <div className="space-y-4">
                {orderHistory
                  .filter(order => order.status === 'completed')
                  .slice(0, 5)
                  .map(order => (
                    <div key={order.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">Pedido #{order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.items.length} itens • {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="font-bold">R$ {order.total.toFixed(2)}</div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Produtos Mais Vendidos</CardTitle>
            <CardDescription>Top produtos do dia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.keys(popularProducts).length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">Sem dados suficientes</p>
              ) : (
                Object.entries(popularProducts)
                  .sort(([, countA], [, countB]) => countB - countA)
                  .slice(0, 5)
                  .map(([productId, count], index) => {
                    // Find product name in orderHistory
                    const productName = orderHistory
                      .flatMap(order => order.items)
                      .find(item => item.product.id === productId)?.product.name || 'Produto';
                    
                    return (
                      <div key={productId} className="flex items-center">
                        <span className="font-medium text-muted-foreground w-6">{index + 1}.</span>
                        <div className="ml-2 flex-1">
                          <p className="font-medium">{productName}</p>
                        </div>
                        <div className="font-bold">{count} unid.</div>
                      </div>
                    );
                  })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
