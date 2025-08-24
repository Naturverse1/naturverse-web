import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { Product } from "../lib/commerce/types";
import { load, save } from "../lib/commerce/storage";

type Item = { product: Product; qty: number };
type Cart = {
  items: Item[];
  add: (p: Product, q?: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  total: number;
};

const Ctx = createContext<Cart>(null!);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, set] = useState<Item[]>(() => load("cart", []));
  const persist = (v: Item[]) => {
    set(v);
    save("cart", v);
  };
  const add = (p: Product, q = 1) => {
    const v = [...items];
    const i = v.findIndex((it) => it.product.slug === p.slug);
    i > -1 ? (v[i] = { ...v[i], qty: v[i].qty + q }) : v.push({ product: p, qty: q });
    persist(v);
  };
  const remove = (slug: string) => persist(items.filter((i) => i.product.slug !== slug));
  const clear = () => persist([]);
  const total = useMemo(() => items.reduce((s, i) => s + i.product.price * i.qty, 0), [items]);
  return (
    <Ctx.Provider value={{ items, add, remove, clear, total }}>{children}</Ctx.Provider>
  );
};

export const useCart = () => useContext(Ctx);
