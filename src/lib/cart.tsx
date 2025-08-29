import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem =
  | { id: string; type: "price"; price: string; name?: string; qty: number; meta?: Record<string, string> }
  | {
      id: string;
      type: "adhoc";
      price_data: { currency: string; unit_amount: number; product_data: { name: string; description?: string } };
      qty: number;
      meta?: Record<string, string>;
    };

type CartState = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  total: number; // cents (adhoc only; price ids shown as "—" in UI)
};

const KEY = "naturverse.cart.v1";
const Ctx = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
  });

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(items)); }, [items]);

  const api = useMemo<CartState>(() => ({
    items,
    add: (it) => {
      setItems((prev) => {
        const i = prev.findIndex(p => p.id === it.id);
        if (i >= 0) {
          const copy = [...prev];
          // bump qty
          copy[i] = { ...copy[i], qty: copy[i].qty + it.qty };
          return copy;
        }
        return [...prev, it];
      });
    },
    remove: (id) => setItems((p) => p.filter((x) => x.id !== id)),
    setQty: (id, qty) => setItems((p) => p.map((x) => x.id === id ? { ...x, qty } : x)),
    clear: () => setItems([]),
    total: items.reduce((sum, it) =>
      it.type === "adhoc" ? sum + it.qty * it.price_data.unit_amount : sum, 0),
  }), [items]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
