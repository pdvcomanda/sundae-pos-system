
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="flex h-screen bg-background">
      {!isMobile && <Sidebar collapsed={collapsed} toggleCollapse={toggleCollapse} />}
      {isMobile && <Sidebar />}
      <div className={cn(
        "flex-1 overflow-auto transition-all duration-300", 
        !isMobile && collapsed ? "ml-16" : !isMobile ? "ml-64" : ""
      )}>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Adicione a importação faltante
import { cn } from '@/lib/utils';
