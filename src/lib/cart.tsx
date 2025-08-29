import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const genId = () => Math.random().toString(36).slice(2, 12);

export type AdhocLine = {
  type: "adhoc";
  id: string; // sku
  qty: number;
  price_data: {
    currency: "usd";
    unit_amount: number;
    product_data: { name: string; description?: string };
  };
  meta?: Record<string, any>;
};

export type PriceLine = {
  type: "price";
  id: string;
  qty: number;
  price: string;
  name?: string;
  meta?: Record<string, any>;
};

export type CartItem = AdhocLine | PriceLine;

export type CartState = { id: string; items: CartItem[]; coupon?: string | null };

const CartCtx = createContext<{
  cart: CartState;
  add: (item: CartItem) => void;
  setQty: (id: string, delta: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  setCoupon: (code: string | null) => void;
}>({} as any);

const LS_KEY = "naturverse.cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartState>(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      return saved ? JSON.parse(saved) : { id: genId(), items: [], coupon: null };
    } catch {
      return { id: genId(), items: [], coupon: null };
    }
  });

  // persist
  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(cart)); } catch {}
  }, [cart]);

  // sync to Supabase when authed
  useEffect(() => {
    const client = supabase;
    if (!client) return;
    client.auth.getUser().then(({ data }) => {
      if (!data.user) return;
      client.from("carts").upsert({
        user_id: data.user.id,
        cart_json: cart,
        updated_at: new Date().toISOString(),
      });
    });
  }, [cart]);

  const api = useMemo(
    () => ({
      add(item: CartItem) {
        setCart((c) => {
          const i = c.items.findIndex((x) => x.id === item.id);
          if (i >= 0) {
            const copy = [...c.items];
            copy[i] = { ...copy[i], qty: copy[i].qty + item.qty } as CartItem;
            return { ...c, items: copy };
          }
          return { ...c, items: [...c.items, item] };
        });
        window.dispatchEvent(new CustomEvent("nv:cart_add", { detail: { id: item.id } }));
      },
      setQty(id: string, delta: number) {
        setCart((c) => {
          const items = c.items
            .map((x) => (x.id === id ? { ...x, qty: x.qty + delta } as CartItem : x))
            .filter((x) => x.qty > 0);
          return { ...c, items };
        });
      },
      remove(id: string) {
        setCart((c) => ({ ...c, items: c.items.filter((x) => x.id !== id) }));
        window.dispatchEvent(new CustomEvent("nv:cart_remove", { detail: { id } }));
      },
      clear() {
        setCart((c) => ({ ...c, items: [], coupon: null }));
      },
      setCoupon(code: string | null) {
        setCart((c) => ({ ...c, coupon: code }));
      },
    }),
    []
  );

  return <CartCtx.Provider value={{ cart, ...api }}>{children}</CartCtx.Provider>;
}

export const useCart = () => useContext(CartCtx);

export const cartSubtotal = (items: CartItem[]) =>
  items.reduce(
    (s, it) => s + (it.type === "adhoc" ? it.price_data.unit_amount * it.qty : 0),
    0
  );
