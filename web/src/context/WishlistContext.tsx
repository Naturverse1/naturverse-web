import React, { createContext, useContext, useState, useEffect } from 'react';

export type WishlistContext = {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const WishlistCtx = createContext<WishlistContext | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ids, setIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('natur_wishlist');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const persist = (next: string[] | ((prev: string[]) => string[])) => {
    setIds(prev => {
      const value = typeof next === 'function' ? (next as (p: string[]) => string[])(prev) : next;
      try { localStorage.setItem('natur_wishlist', JSON.stringify(value)); } catch {}
      return value;
    });
  };

  const add = (id: string) => persist(prev => (prev.includes(id) ? prev : [...prev, id]));
  const remove = (id: string) => persist(prev => prev.filter(x => x !== id));
  const toggle = (id: string) => persist(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  const has = (id: string) => ids.includes(id);
  const clear = () => persist([]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'natur_wishlist') {
        try {
          const raw = e.newValue;
          setIds(raw ? JSON.parse(raw) : []);
        } catch {
          setIds([]);
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <WishlistCtx.Provider value={{ ids, add, remove, toggle, has, clear }}>
      {children}
    </WishlistCtx.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistCtx);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};

