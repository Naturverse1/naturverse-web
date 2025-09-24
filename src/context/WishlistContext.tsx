import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const KEY = "naturverse_wishlist_v1";
const LEGACY_KEY = "nv:wishlist";

const readStored = () => {
  if (typeof window === "undefined") return [] as string[];
  try {
    const raw = localStorage.getItem(KEY) ?? localStorage.getItem(LEGACY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
};

const persist = (items: string[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("wishlist:changed"));
};

type Wish = {
  items: string[];
  toggle: (slug: string) => void;
  has: (slug: string) => boolean;
};

const Ctx = createContext<Wish>(null!);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<string[]>(() => readStored());

  useEffect(() => {
    const update = () => {
      setItems(readStored());
    };
    window.addEventListener("wishlist:changed", update);
    return () => window.removeEventListener("wishlist:changed", update);
  }, []);

  const toggle = (slug: string) => {
    setItems((prev) => {
      const next = prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug];
      persist(next);
      return next;
    });
  };
  const has = (slug: string) => items.includes(slug);
  return <Ctx.Provider value={{ items, toggle, has }}>{children}</Ctx.Provider>;
};

export const useWishlist = () => useContext(Ctx);
