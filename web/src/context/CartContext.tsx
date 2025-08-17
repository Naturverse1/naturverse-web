import React, { createContext, useContext, useMemo, useState } from 'react';

export type CartItem = {
  id: string;
  name: string;
  priceNatur: number; // price in NATUR
  qty: number;
  options?: Record<string, string>;
  imageUrl?: string;
  meta?: Record<string, unknown>;
};

type CartState = {
  items: CartItem[];
  add(item: CartItem): void;
  remove(id: string): void;
  clear(): void;
  totalNatur: number;
};

const CartContext = createContext<CartState | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem('natur_cart');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const persist = (next: CartItem[] | ((prev: CartItem[]) => CartItem[])) => {
    setItems(prev => {
      const value = typeof next === 'function' ? (next as (p: CartItem[]) => CartItem[])(prev) : next;
      try { localStorage.setItem('natur_cart', JSON.stringify(value)); } catch {}
      return value;
    });
  };

  const add = (delta: CartItem) => {
    const next = (() => {
      const existing = items.find(i => i.id === delta.id);
      if (existing) {
        const merged = items
          .map(i => (i.id === delta.id ? { ...i, qty: i.qty + delta.qty } : i))
          .filter(i => i.qty > 0);
        return merged;
      }
      return delta.qty > 0 ? [...items, delta] : items;
    })();
    persist(next);
  };

  const remove = (id: string) => persist(prev => prev.filter(i => i.id !== id));
  const clear = () => persist([]);

  const totalNatur = useMemo(
    () => items.reduce((sum, i) => sum + i.priceNatur * i.qty, 0),
    [items]
  );

  const value = useMemo(() => ({ items, add, remove, clear, totalNatur }), [items, totalNatur]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

