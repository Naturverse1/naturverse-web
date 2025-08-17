import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getNavatar } from '../lib/navatar';
import { ensureBucket, uploadOrderPreview } from '../lib/orderStorage';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  options?: Record<string, string>;
  thumb?: string;
  previewUrl?: string;
  navatar?: { id: string; image: string } | null;
};
type Cart = {
  items: CartItem[];
  add: (i: CartItem) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  subtotal: number;
  fee: number;
  total: number;
  placeOrder: (totalNatur: number) => any;
};

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
          const navatar = getNavatar();
          const item: CartItem = { ...n, navatar };
          const i = prev.find(
            (x) => x.id === item.id && JSON.stringify(x.options || {}) === JSON.stringify(item.options || {})
          );
          return i
            ? prev.map((x) =>
                x === i
                  ? {
                      ...x,
                      qty: x.qty + item.qty,
                      navatar: item.navatar,
                      previewUrl: item.previewUrl,
                    }
                  : x
              )
            : [...prev, item];
        }),
      remove: (id) => setItems((prev) => prev.filter((x) => x.id !== id)),
      setQty: (id, qty) => setItems((prev) => prev.map((x) => (x.id === id ? { ...x, qty: Math.max(1, qty) } : x))),
      clear: () => setItems([]),
      subtotal,
      fee,
      total,
      placeOrder: (totalNatur) => {
        const order = {
          id: `ord_${Date.now()}`,
          createdAt: new Date().toISOString(),
          items,
          totalNatur,
          navatar: getNavatar(),
        };
        try {
          const all = JSON.parse(localStorage.getItem('natur_orders') || '[]');
          all.unshift(order);
          localStorage.setItem('natur_orders', JSON.stringify(all));
        } catch {
          /* ignore */
        }

        (async () => {
          try {
            await ensureBucket();
            let changed = false;
            for (const line of order.items) {
              if (line.previewUrl?.startsWith('data:image')) {
                const url = await uploadOrderPreview(order.id, line.id, line.previewUrl);
                if (url) {
                  line.previewUrl = url;
                  changed = true;
                }
              }
            }
            if (changed) {
              const all = JSON.parse(localStorage.getItem('natur_orders') || '[]');
              const idx = all.findIndex((o: any) => o.id === order.id);
              if (idx !== -1) {
                all[idx] = order;
                localStorage.setItem('natur_orders', JSON.stringify(all));
              }
            }
          } catch {
            /* ignore */
          }
        })();

        setItems([]);
        return order;
      },
    }),
    [items, subtotal, fee, total]
  );

  return <CartCtx.Provider value={api}>{children}</CartCtx.Provider>;
}
