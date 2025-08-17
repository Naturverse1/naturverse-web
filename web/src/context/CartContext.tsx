import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  CartLine,
  loadCart,
  saveCart,
  onStorageSync,
} from '../lib/cartPersist';

type CartState = {
  items: CartLine[];
  add(item: CartLine): void;
  remove(id: string): void;
  clear(): void;
  inc(id: string): void;
  dec(id: string): void;
  totalNatur: number;
  openMiniCart(): void;
};

const CartContext = createContext<CartState | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartLine[]>(() => loadCart());

  useEffect(() => {
    saveCart(items);
  }, [items]);

  useEffect(() => onStorageSync(setItems), []);

  const persist = (updater: (prev: CartLine[]) => CartLine[]) => {
    setItems(prev => updater(prev));
  };

  const add = (delta: CartLine) => {
    persist(prev => {
      const existing = prev.find(i => i.id === delta.id);
      if (existing) {
        const next = prev
          .map(i =>
            i.id === delta.id ? { ...i, qty: i.qty + delta.qty } : i,
          )
          .filter(i => i.qty > 0);
        console.log('cart_qty_changed');
        return next;
      }
      console.log('cart_line_added');
      return delta.qty > 0 ? [...prev, delta] : prev;
    });
  };

  const remove = (id: string) => {
    console.log('cart_line_removed');
    persist(prev => prev.filter(i => i.id !== id));
  };

  const clear = () => persist(() => []);

  const inc = (id: string) => {
    const line = items.find(i => i.id === id);
    if (line) add({ ...line, qty: 1 });
  };

  const dec = (id: string) => {
    const line = items.find(i => i.id === id);
    if (!line) return;
    if (line.qty <= 1) remove(id);
    else add({ ...line, qty: -1 });
  };

  const totalNatur = useMemo(
    () => items.reduce((sum, i) => sum + i.priceNatur * i.qty, 0),
    [items],
  );

  const openMiniCart = () => {
    window.dispatchEvent(new CustomEvent('minicart:open'));
  };

  const value = useMemo(
    () => ({
      items,
      add,
      remove,
      clear,
      inc,
      dec,
      totalNatur,
      openMiniCart,
    }),
    [items, totalNatur],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

