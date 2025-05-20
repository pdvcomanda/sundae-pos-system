
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getSystemSettings, updateSystemSettings } from '@/services/settingsService';
import { SystemSettings } from '@/types';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => Promise<void>;
  systemSettings: SystemSettings | null;
  setSystemSettings: React.Dispatch<React.SetStateAction<SystemSettings | null>>;
  loading: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [systemSettings, setSystemSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadSystemSettings = async () => {
      try {
        const settings = await getSystemSettings();
        setSystemSettings(settings);
        
        // Apply dark mode if enabled
        if (settings?.darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (error) {
        console.error('Error loading system settings:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as configurações do sistema',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    loadSystemSettings();
  }, [toast]);

  const toggleDarkMode = async () => {
    if (!systemSettings) return;

    const newDarkMode = !systemSettings.darkMode;
    
    // Update the UI immediately
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Update state
    setSystemSettings(prev => prev ? { ...prev, darkMode: newDarkMode } : null);
    
    // Save to database
    try {
      await updateSystemSettings({
        ...systemSettings,
        darkMode: newDarkMode
      });
    } catch (error) {
      console.error('Error updating dark mode setting:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o modo escuro',
        variant: 'destructive'
      });
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode: systemSettings?.darkMode || false, toggleDarkMode, systemSettings, setSystemSettings, loading }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
