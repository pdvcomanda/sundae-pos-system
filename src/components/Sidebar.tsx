
import React from 'react';
import { Home, ShoppingCart, BarChart3, Package, Settings, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function Sidebar({ collapsed = false, toggleCollapse }: { collapsed?: boolean; toggleCollapse?: () => void }) {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Nova Venda', href: '/new-order', icon: ShoppingCart },
    { name: 'Relatórios', href: '/reports', icon: BarChart3 },
    { name: 'Estoque', href: '/inventory', icon: Package },
    { name: 'Configurações', href: '/settings', icon: Settings },
  ];

  const renderSidebarContent = () => (
    <>
      <div className={cn("flex items-center justify-between p-4 mb-6", collapsed && "justify-center")}>
        {!collapsed && <h1 className="text-2xl font-bold text-white">Açaí POS</h1>}
        {!isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={toggleCollapse}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </Button>
        )}
      </div>
      <nav className="flex-1">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm rounded-lg",
                    isActive 
                      ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    collapsed && "justify-center px-2"
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
                  {!collapsed && item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className={cn("p-4 mt-auto", collapsed && "flex justify-center")}>
        {!collapsed && (
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-sm font-medium">Operador</p>
              <p className="text-xs text-sidebar-foreground opacity-80">Caixa #1</p>
            </div>
          </div>
        )}
      </div>
    </>
  );

  // Mobile sidebar usando Sheet component
  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-10">
            <Menu size={24} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-sidebar p-0 w-64 border-r-0">
          {renderSidebarContent()}
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop sidebar
  return (
    <div className={cn(
      "flex flex-col h-screen bg-sidebar text-sidebar-foreground p-4 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {renderSidebarContent()}
    </div>
  );
}
