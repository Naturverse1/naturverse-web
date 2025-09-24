import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { supabase } from "@/lib/supabaseClient";
import { getWishlistMap, toggleWishlist } from "@/services/wishlist";

type WishlistContextValue = {
  items: string[];
  has: (slug: string) => boolean;
  toggle: (slug: string) => Promise<boolean>;
  loading: boolean;
  refresh: () => Promise<void>;
};

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const next = await getWishlistMap();
      setMap(next);
    } catch (error) {
      console.error("wishlist_refresh_failed", error);
      setMap({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        void refresh();
      } else {
        setMap({});
        setLoading(false);
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [refresh]);

  const toggle = useCallback(async (slug: string) => {
    const saved = await toggleWishlist(slug);
    setMap((prev) => {
      const next = { ...prev };
      if (saved) {
        next[slug] = true;
      } else {
        delete next[slug];
      }
      return next;
    });
    return saved;
  }, []);

  const has = useCallback((slug: string) => Boolean(map[slug]), [map]);

  const items = useMemo(() => Object.keys(map), [map]);

  const value = useMemo(
    () => ({ items, has, toggle, loading, refresh }),
    [items, has, toggle, loading, refresh],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return ctx;
}
