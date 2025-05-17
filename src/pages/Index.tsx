
import React from 'react';
import { Dashboard } from '@/components/Dashboard';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className={isMobile ? "px-0" : "px-4"}>
      <Dashboard />
    </div>
  );
};

export default Index;
