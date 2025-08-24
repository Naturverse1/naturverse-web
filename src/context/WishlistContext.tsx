import { createContext, useContext, useState, ReactNode } from "react";
import { load, save } from "../lib/commerce/storage";

type Wish = {
  items: string[];
  toggle: (slug: string) => void;
  has: (slug: string) => boolean;
};

const Ctx = createContext<Wish>(null!);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, set] = useState<string[]>(() => load("wishlist", []));
  const toggle = (slug: string) => {
    const v = items.includes(slug)
      ? items.filter((s) => s !== slug)
      : [...items, slug];
    set(v);
    save("wishlist", v);
  };
  const has = (slug: string) => items.includes(slug);
  return <Ctx.Provider value={{ items, toggle, has }}>{children}</Ctx.Provider>;
};

export const useWishlist = () => useContext(Ctx);
