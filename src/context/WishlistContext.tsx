import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuthUser } from "../lib/useAuthUser";
import {
  fetchWishlistEntries,
  toggleWishlist as toggleWishlistItem,
  type WishlistEntry,
  type WishlistMap,
} from "@/services/wishlist";

type Wish = {
  items: string[];
  loading: boolean;
  has: (productId: string) => boolean;
  toggle: (productId: string) => Promise<boolean>;
  refresh: () => Promise<void>;
  entries: WishlistEntry[];
};

const Ctx = createContext<Wish>(null!);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthUser();
  const [map, setMap] = useState<WishlistMap>({});
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<WishlistEntry[]>([]);

  const loadEntries = useCallback(async () => {
    if (!user?.id) {
      setEntries([]);
      setMap({});
      return;
    }
    try {
      const list = await fetchWishlistEntries();
      setEntries(list);
      const next: WishlistMap = {};
      for (const entry of list) {
        next[entry.product.id] = true;
      }
      setMap(next);
    } catch (err) {
      console.error("Failed to load wishlist entries", err);
      throw err;
    }
  }, [user?.id]);

  const refresh = useCallback(async () => {
    await loadEntries();
  }, [loadEntries]);

  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      setLoading(true);
      try {
        await refresh();
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to refresh wishlist", err);
          setMap({});
          setEntries([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  const items = useMemo(() => Object.keys(map), [map]);

  const has = useCallback((productId: string) => Boolean(map[productId]), [map]);

  const toggle = useCallback(async (productId: string) => {
    let previous = false;
    setMap((prev) => {
      previous = Boolean(prev[productId]);
      const next = { ...prev };
      if (previous) {
        delete next[productId];
      } else {
        next[productId] = true;
      }
      return next;
    });

    try {
      const saved = await toggleWishlistItem(productId);
      setMap((prev) => {
        const next = { ...prev };
        if (saved) {
          next[productId] = true;
        } else {
          delete next[productId];
        }
        return next;
      });
      try {
        await loadEntries();
      } catch (err) {
        console.error("Failed to refresh wishlist entries after toggle", err);
      }
      return saved;
    } catch (err) {
      setMap((prev) => {
        const next = { ...prev };
        if (previous) {
          next[productId] = true;
        } else {
          delete next[productId];
        }
        return next;
      });
      throw err;
    }
  }, [loadEntries]);

  const value = useMemo(
    () => ({ items, loading, has, toggle, refresh, entries }),
    [entries, has, items, loading, refresh, toggle]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useWishlist = () => useContext(Ctx);
