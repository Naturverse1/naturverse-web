import React, { createContext, useContext, useMemo, useState } from 'react';
import type { CartItem, Order } from '../types/marketplace';

type Ctx = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  totalNatur: number;
  placeOrder: () => Order;
};

const CartContext = createContext<Ctx | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('natur_cart') || '[]');
    } catch {
      return [];
    }
  });

  const persist = (next: CartItem[]) => {
    setItems(next);
    localStorage.setItem('natur_cart', JSON.stringify(next));
  };

  const add = (item: CartItem) => persist([...items, item]);
  const remove = (id: string) => persist(items.filter((i) => i.id !== id));
  const clear = () => persist([]);

  const totalNatur = useMemo(() => items.reduce((s, i) => s + i.lineNatur, 0), [items]);

  const placeOrder = (): Order => {
    const order: Order = {
      id: `ord_${Date.now()}`,
      createdAt: new Date().toISOString(),
      items,
      totalNatur,
    };
    const prev = JSON.parse(localStorage.getItem('natur_orders') || '[]');
    localStorage.setItem('natur_orders', JSON.stringify([order, ...prev]));
    clear();
    return order;
  };

  return (
    <CartContext.Provider value={{ items, add, remove, clear, totalNatur, placeOrder }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext)!;
