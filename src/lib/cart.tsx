import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "./supabaseClient";
import type { Product } from "@/hooks/useProducts";
import { findFallbackProduct } from "@/hooks/useProducts";

export type CartItem = { id: string; name: string; price: number; image: string; qty: number };
type Saved = Record<string, true>;

type CartCtx = {
  items: CartItem[];
  saved: Saved;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  remove: (id: string) => void;
  toggleSave: (id: string) => void;
  count: number; // total qty
  subtotal: number;
};

export type CartSummaryItem = { slug: string; qty: number };

type CartProductMeta = Partial<Pick<CartItem, "name" | "price" | "image">> & {
  price_cents?: number;
  image_url?: string;
  product?: Product;
};

const CartContext = createContext<CartCtx | null>(null);
const CART_KEY = "naturverse_cart_v1";
const LEGACY_CART_KEY = "nv.cart";
const SAVE_KEY = "naturverse_saved_v1";
const LEGACY_SAVE_KEY = "nv.wishlist";

const parseJSON = <T,>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const readCartStorage = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  const current = parseJSON<CartItem[]>(localStorage.getItem(CART_KEY), []);
  if (current.length) return current;
  const legacy = parseJSON<CartItem[]>(localStorage.getItem(LEGACY_CART_KEY), []);
  if (legacy.length) {
    localStorage.setItem(CART_KEY, JSON.stringify(legacy));
    return legacy;
  }
  return [];
};

const readSavedStorage = (): Saved => {
  if (typeof window === "undefined") return {};
  const current = parseJSON<Saved>(localStorage.getItem(SAVE_KEY), {});
  if (Object.keys(current).length) return current;
  const legacy = parseJSON<Saved>(localStorage.getItem(LEGACY_SAVE_KEY), {});
  if (Object.keys(legacy).length) {
    localStorage.setItem(SAVE_KEY, JSON.stringify(legacy));
    return legacy;
  }
  return {};
};

const persistCart = (items: CartItem[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

const persistSaved = (saved: Saved) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(SAVE_KEY, JSON.stringify(saved));
};

const sanitizeQty = (qty: number) => {
  const n = Number.isFinite(qty) ? Math.floor(qty) : 0;
  return n > 0 ? n : 1;
};

const resolveCartItem = (slug: string, qty: number, meta?: CartProductMeta): CartItem => {
  const fallback = meta?.product ?? findFallbackProduct(slug);
  const price =
    typeof meta?.price === "number"
      ? meta.price
      : typeof meta?.price_cents === "number"
      ? meta.price_cents / 100
      : fallback
      ? fallback.price_cents / 100
      : 0;
  const image =
    meta?.image ?? meta?.image_url ?? (fallback ? fallback.image_url : "");
  const name = meta?.name ?? fallback?.name ?? slug;
  return { id: slug, name, price, image, qty: sanitizeQty(qty) };
};

let setCartItemsRef: React.Dispatch<React.SetStateAction<CartItem[]>> | null = null;

const updateCart = (updater: (items: CartItem[]) => CartItem[]) => {
  if (typeof window === "undefined") return;
  if (setCartItemsRef) {
    setCartItemsRef((prev) => {
      const base = Array.isArray(prev) ? prev : [];
      const next = updater(base);
      persistCart(next);
      return next;
    });
  } else {
    const next = updater(readCartStorage());
    persistCart(next);
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => (typeof window !== "undefined" ? readCartStorage() : []));
  const [saved, setSaved] = useState<Saved>(() => (typeof window !== "undefined" ? readSavedStorage() : {}));

  useEffect(() => {
    setCartItemsRef = setItems;
    return () => {
      setCartItemsRef = null;
    };
  }, []);

  useEffect(() => {
    persistCart(items);
  }, [items]);

  useEffect(() => {
    persistSaved(saved);
  }, [saved]);

  const api = useMemo<CartCtx>(() => {
    const add: CartCtx["add"] = (item, qty = 1) =>
      setItems((prev) => {
        const list = Array.isArray(prev) ? prev : [];
        const index = list.findIndex((p) => p.id === item.id);
        if (index >= 0) {
          const copy = [...list];
          copy[index] = { ...copy[index], qty: copy[index].qty + qty };
          return copy;
        }
        return [...list, { ...item, qty }];
      });
    const inc: CartCtx["inc"] = (id) =>
      setItems((prev) => prev.map((it) => (it.id === id ? { ...it, qty: it.qty + 1 } : it)));
    const dec: CartCtx["dec"] = (id) =>
      setItems((prev) =>
        prev.flatMap((it) => (it.id === id ? (it.qty > 1 ? [{ ...it, qty: it.qty - 1 }] : []) : [it]))
      );
    const remove: CartCtx["remove"] = (id) => setItems((prev) => prev.filter((it) => it.id !== id));
    const toggleSave: CartCtx["toggleSave"] = (id) =>
      setSaved((prev) => {
        const next = { ...prev } as Saved;
        if (next[id]) {
          delete next[id];
        } else {
          next[id] = true;
        }
        return next;
      });
    const count = items.reduce((n, i) => n + i.qty, 0);
    const subtotal = items.reduce((n, i) => n + i.qty * i.price, 0);
    return { items, saved, add, inc, dec, remove, toggleSave, count, subtotal };
  }, [items, saved]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
};

type AddMeta = CartProductMeta;

export const cart = {
  list(): CartSummaryItem[] {
    return readCartStorage().map((item) => ({ slug: item.id, qty: item.qty }));
  },
  add(slug: string, qty = 1, meta?: AddMeta) {
    updateCart((items) => {
      const index = items.findIndex((entry) => entry.id === slug);
      if (index >= 0) {
        const copy = [...items];
        copy[index] = { ...copy[index], qty: copy[index].qty + sanitizeQty(qty) };
        return copy;
      }
      return [...items, resolveCartItem(slug, qty, meta)];
    });
  },
  remove(slug: string) {
    updateCart((items) => items.filter((entry) => entry.id !== slug));
  },
  clear() {
    updateCart(() => []);
  },
  async syncToServer(userId: string) {
    const items = cart.list();
    if (!items.length) return;
    for (const it of items) {
      try {
        await supabase
          .from("cart")
          .upsert(
            { user_id: userId, product_slug: it.slug, qty: it.qty },
            { onConflict: "user_id,product_slug" }
          );
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn("cart sync failed", error);
        }
      }
    }
  },
};
