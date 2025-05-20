
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Loader2, Calendar as CalendarIcon, Download } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { pt } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Import report services
import {
  getSalesByDay,
  getSalesByProduct,
  getSalesByHour,
  getAverageTicket,
  getPopularToppings
} from '@/services/reportService';

// Color palette for charts
const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'];
const PRODUCT_COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'];

const ReportsPage = () => {
  // Date range state
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  
  // Active report
  const [activeReport, setActiveReport] = useState('daily-sales');
  
  // Loading states
  const [loading, setLoading] = useState(false);
  
  // Report data states
  const [dailySalesData, setDailySalesData] = useState<{ date: string; total: number; orders: number }[]>([]);
  const [productSalesData, setProductSalesData] = useState<{ productId: string; productName: string; quantity: number; total: number }[]>([]);
  const [hourlySalesData, setHourlySalesData] = useState<{ hour: number; total: number; orders: number }[]>([]);
  const [averageTicket, setAverageTicket] = useState<number>(0);
  const [popularToppings, setPopularToppings] = useState<{ toppingId: string; toppingName: string; count: number }[]>([]);
  
  // Load report data
  const loadReportData = async () => {
    setLoading(true);
    try {
      switch (activeReport) {
        case 'daily-sales':
          const dailyData = await getSalesByDay(startDate, endDate);
          setDailySalesData(dailyData);
          break;
        case 'product-sales':
          const productData = await getSalesByProduct(startDate, endDate);
          setProductSalesData(productData);
          break;
        case 'hourly-sales':
          const hourlyData = await getSalesByHour(startDate, endDate);
          setHourlySalesData(hourlyData);
          break;
        case 'ticket-average':
          const ticket = await getAverageTicket(startDate, endDate);
          setAverageTicket(ticket);
          break;
        case 'popular-toppings':
          const toppings = await getPopularToppings(startDate, endDate);
          setPopularToppings(toppings);
          break;
      }
    } catch (error) {
      console.error('Error loading report data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Load data when report changes or date range changes
  React.useEffect(() => {
    loadReportData();
  }, [activeReport, startDate, endDate]);
  
  // Format date range for display
  const formattedDateRange = `${format(startDate, 'dd/MM/yyyy')} - ${format(endDate, 'dd/MM/yyyy')}`;
  
  // Export report data
  const handleExportReport = () => {
    // Sample implementation - would be expanded in a real system
    let data;
    let filename;
    
    switch (activeReport) {
      case 'daily-sales':
        data = dailySalesData;
        filename = 'vendas-por-dia';
        break;
      case 'product-sales':
        data = productSalesData;
        filename = 'vendas-por-produto';
        break;
      case 'hourly-sales':
        data = hourlySalesData;
        filename = 'vendas-por-hora';
        break;
      case 'ticket-average':
        data = { averageTicket };
        filename = 'ticket-medio';
        break;
      case 'popular-toppings':
        data = popularToppings;
        filename = 'complementos-populares';
        break;
    }
    
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${format(new Date(), 'yyyyMMdd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Generate hourly labels for x-axis
  const hourLabels = Array.from({ length: 24 }, (_, i) => `${i}h`);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Relatórios</h2>
          <p className="text-muted-foreground">Visualize o desempenho do seu negócio.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formattedDateRange}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <div className="flex">
                <div className="border-r p-2">
                  <div className="px-3 py-2 text-sm font-medium">Data Inicial</div>
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      if (date) {
                        setStartDate(date);
                      }
                    }}
                    disabled={(date) => date > endDate || date > new Date()}
                    locale={pt}
                  />
                </div>
                <div className="p-2">
                  <div className="px-3 py-2 text-sm font-medium">Data Final</div>
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => {
                      if (date) {
                        setEndDate(date);
                      }
                    }}
                    disabled={(date) => date < startDate || date > new Date()}
                    locale={pt}
                  />
                </div>
              </div>
              <div className="border-t p-3 flex justify-end">
                <Button 
                  size="sm" 
                  onClick={() => setDatePickerOpen(false)}
                >
                  Aplicar
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button onClick={handleExportReport} variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="daily-sales" onValueChange={setActiveReport} value={activeReport}>
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
          <TabsTrigger value="daily-sales">Vendas por Dia</TabsTrigger>
          <TabsTrigger value="product-sales">Vendas por Produto</TabsTrigger>
          <TabsTrigger value="hourly-sales">Vendas por Hora</TabsTrigger>
          <TabsTrigger value="ticket-average">Ticket Médio</TabsTrigger>
          <TabsTrigger value="popular-toppings">Complementos Populares</TabsTrigger>
        </TabsList>
        
        <Card>
          <CardHeader>
            <CardTitle>
              {activeReport === 'daily-sales' && 'Vendas por Dia'}
              {activeReport === 'product-sales' && 'Vendas por Produto'}
              {activeReport === 'hourly-sales' && 'Vendas por Hora'}
              {activeReport === 'ticket-average' && 'Ticket Médio'}
              {activeReport === 'popular-toppings' && 'Complementos Mais Populares'}
            </CardTitle>
            <CardDescription>
              {activeReport === 'daily-sales' && 'Visualize as vendas diárias no período selecionado'}
              {activeReport === 'product-sales' && 'Analise quais produtos vendem mais'}
              {activeReport === 'hourly-sales' && 'Identifique os horários de pico de vendas'}
              {activeReport === 'ticket-average' && 'Valor médio gasto por cliente'}
              {activeReport === 'popular-toppings' && 'Complementos mais escolhidos pelos clientes'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {/* Daily Sales Chart */}
                <TabsContent value="daily-sales" className="h-[400px]">
                  {dailySalesData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={dailySalesData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 50
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date) => format(new Date(date), 'dd/MM')} 
                          angle={-45}
                          textAnchor="end"
                          height={70}
                        />
                        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                        <Tooltip 
                          formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                          labelFormatter={(date) => format(new Date(date), 'dd/MM/yyyy')}
                        />
                        <Legend />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="total"
                          name="Total de Vendas (R$)"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="orders"
                          name="Número de Pedidos"
                          stroke="#82ca9d"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">Nenhum dado disponível para o período selecionado</p>
                    </div>
                  )}
                </TabsContent>
                
                {/* Products Sales Chart */}
                <TabsContent value="product-sales" className="h-[400px]">
                  {productSalesData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={productSalesData.slice(0, 10)} // Show top 10 products
                        layout="vertical"
                        margin={{
                          top: 20,
                          right: 30,
                          left: 100,
                          bottom: 5
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis 
                          type="category" 
                          dataKey="productName" 
                          width={100}
                        />
                        <Tooltip
                          formatter={(value: number, name: string) => [
                            name === 'total' ? `R$ ${value.toFixed(2)}` : value,
                            name === 'total' ? 'Valor Total' : 'Quantidade'
                          ]}
                        />
                        <Legend />
                        <Bar dataKey="quantity" name="Quantidade" fill="#8884d8" />
                        <Bar dataKey="total" name="Valor Total (R$)" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">Nenhum dado disponível para o período selecionado</p>
                    </div>
                  )}
                </TabsContent>
                
                {/* Hourly Sales Chart */}
                <TabsContent value="hourly-sales" className="h-[400px]">
                  {hourlySalesData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={hourlySalesData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="hour" 
                          tickFormatter={(hour) => `${hour}h`}
                        />
                        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                        <Tooltip 
                          formatter={(value: number, name: string) => [
                            name === 'total' ? `R$ ${value.toFixed(2)}` : value,
                            name === 'total' ? 'Valor Total' : 'Número de Pedidos'
                          ]}
                          labelFormatter={(hour) => `${hour}:00 - ${hour + 1}:00`}
                        />
                        <Legend />
                        <Bar 
                          yAxisId="left" 
                          dataKey="total" 
                          name="Total de Vendas (R$)" 
                          fill="#8884d8" 
                        />
                        <Bar 
                          yAxisId="right" 
                          dataKey="orders" 
                          name="Número de Pedidos" 
                          fill="#82ca9d" 
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">Nenhum dado disponível para o período selecionado</p>
                    </div>
                  )}
                </TabsContent>
                
                {/* Average Ticket */}
                <TabsContent value="ticket-average" className="h-[400px]">
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="text-9xl font-bold text-primary mb-4">
                      {averageTicket > 0 ? `R$ ${averageTicket.toFixed(2)}` : 'R$ 0,00'}
                    </div>
                    <p className="text-xl text-muted-foreground">
                      Valor médio por pedido no período selecionado
                    </p>
                  </div>
                </TabsContent>
                
                {/* Popular Toppings */}
                <TabsContent value="popular-toppings" className="h-[400px]">
                  {popularToppings.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={popularToppings.slice(0, 6)} // Show top 6 toppings
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="count"
                          nameKey="toppingName"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {popularToppings.slice(0, 6).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} pedidos`, 'Quantidade']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">Nenhum dado disponível para o período selecionado</p>
                    </div>
                  )}
                </TabsContent>
              </>
            )}
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
