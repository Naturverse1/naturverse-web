import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeState {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
}

const ThemeCtx = createContext<ThemeState | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      return (localStorage.getItem('natur_theme') as ThemeMode) || 'system';
    } catch {
      return 'system';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('natur_theme', theme);
    } catch {}
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const root = document.documentElement;
    const apply = () => {
      if (theme === 'system') {
        root.setAttribute('data-theme', mq.matches ? 'dark' : 'light');
      } else {
        root.setAttribute('data-theme', theme);
      }
    };
    apply();
    const onChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      }
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [theme]);

  return (
    <ThemeCtx.Provider value={{ theme, setTheme }}>{children}</ThemeCtx.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

