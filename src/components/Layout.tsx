
import React from 'react';
import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
