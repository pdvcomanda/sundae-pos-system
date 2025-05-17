
import React from 'react';
import { Home, ShoppingCart, BarChart3, Package, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocation, Link } from 'react-router-dom';

export function Sidebar() {
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Nova Venda', href: '/new-order', icon: ShoppingCart },
    { name: 'Relatórios', href: '/reports', icon: BarChart3 },
    { name: 'Estoque', href: '/inventory', icon: Package },
    { name: 'Configurações', href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col h-screen bg-sidebar text-sidebar-foreground w-64 p-4">
      <div className="flex items-center justify-center p-4 mb-6">
        <h1 className="text-2xl font-bold text-white">Açaí POS</h1>
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
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 mt-auto">
        <div className="flex items-center">
          <div className="ml-3">
            <p className="text-sm font-medium">Operador</p>
            <p className="text-xs text-sidebar-foreground opacity-80">Caixa #1</p>
          </div>
        </div>
      </div>
    </div>
  );
}
