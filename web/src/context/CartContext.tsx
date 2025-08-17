import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type CartItem = { id: string; name: string; price: number; qty: number; options?: Record<string, string>; thumb?: string };
type Cart = { items: CartItem[]; add: (i: CartItem) => void; remove: (id: string) => void; setQty: (id: string, qty: number) => void; clear: () => void; subtotal: number; fee: number; total: number };

const KEY = 'natur_cart';
const CartCtx = createContext<Cart | null>(null);
export const useCart = () => useContext(CartCtx)!;

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]');
    } catch {
      return [];
    }
  });
  useEffect(() => localStorage.setItem(KEY, JSON.stringify(items)), [items]);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const fee = Math.round(subtotal * 0.05 * 100) / 100; // 5% placeholder
  const total = Math.round((subtotal + fee) * 100) / 100;

  const api = useMemo<Cart>(
    () => ({
      items,
      add: (n) =>
        setItems((prev) => {
          const i = prev.find(
            (x) => x.id === n.id && JSON.stringify(x.options || {}) === JSON.stringify(n.options || {})
          );
          return i ? prev.map((x) => (x === i ? { ...x, qty: x.qty + n.qty } : x)) : [...prev, n];
        }),
      remove: (id) => setItems((prev) => prev.filter((x) => x.id !== id)),
      setQty: (id, qty) => setItems((prev) => prev.map((x) => (x.id === id ? { ...x, qty: Math.max(1, qty) } : x))),
      clear: () => setItems([]),
      subtotal,
      fee,
      total,
    }),
    [items, subtotal, fee, total]
  );

  return <CartCtx.Provider value={api}>{children}</CartCtx.Provider>;
}
