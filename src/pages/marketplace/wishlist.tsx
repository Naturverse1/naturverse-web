import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MarketTabs from "../../components/MarketTabs";
import "../../styles/marketplace.css";
import { useToast } from "@/components/Toast";
import { useAuthUser } from "@/lib/useAuthUser";
import { getWishlist, removeFromWishlist } from "@/services/wishlist";
import type { WishlistItem } from "@/types/market";

type LookupEntry = { name: string; image: string; href: string; price: number };

const LOOKUP: Record<string, LookupEntry> = {
  "turian-plush": { name: "Turian Plush", image: "/Marketplace/Turianplushie.png", href: "/marketplace/turian-plush", price: 24 },
  "navatar-tee": { name: "Navatar Tee", image: "/Marketplace/Turiantshirt.png", href: "/marketplace/navatar-tee", price: 18 },
  stickers: { name: "Sticker Pack", image: "/Marketplace/Stickerpack.png", href: "/marketplace/stickers", price: 6 },
};

const LOOKUP_BY_NAME: Record<string, LookupEntry & { id: string }> = Object.entries(LOOKUP).reduce(
  (acc, [id, data]) => {
    acc[data.name] = { ...data, id };
    return acc;
  },
  {} as Record<string, LookupEntry & { id: string }>
);

export default function MarketplaceWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const toast = useToast();
  const { user, loading: authLoading } = useAuthUser();

  useEffect(() => {
    let active = true;
    if (authLoading) {
      return () => {
        active = false;
      };
    }

    if (!user) {
      setItems([]);
      setError(null);
      setPendingId(null);
      setLoading(false);
      return () => {
        active = false;
      };
    }

    setLoading(true);
    setError(null);
    setPendingId(null);
    setItems([]);

    getWishlist()
      .then((data) => {
        if (active) setItems(data);
      })
      .catch((err) => {
        if (import.meta.env.DEV) console.warn(err);
        if (active) {
          setItems([]);
          setError(err instanceof Error ? err.message : "Could not load wishlist");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user, authLoading]);

  const products = useMemo(
    () =>
      items.map((item) => {
        const meta = LOOKUP_BY_NAME[item.product_name];
        return {
          item,
          meta,
          image: item.product_image ?? meta?.image ?? null,
          price: item.product_price ?? meta?.price ?? null,
        };
      }),
    [items]
  );

  const handleRemove = async (entry: WishlistItem) => {
    if (!user) {
      toast({ text: "Sign in to update your wishlist.", kind: "warn" });
      return;
    }
    try {
      setPendingId(entry.id);
      await removeFromWishlist(entry.id);
      setItems((prev) => prev.filter((item) => item.id !== entry.id));
      toast({ text: "Removed from wishlist", kind: "warn" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not update wishlist";
      toast({ text: message, kind: "err" });
    } finally {
      setPendingId((prev) => (prev === entry.id ? null : prev));
    }
  };

  return (
    <main className="container">
      <div className="mk-head">
        <div className="mk-breadcrumbs">
          <Link to="/">Home</Link> / <Link to="/marketplace">Marketplace</Link> / <span>Wishlist</span>
        </div>
        <h1>Marketplace</h1>
      </div>

      <MarketTabs />

      {loading ? (
        <p style={{ textAlign: "center", marginTop: "1.5rem" }}>Loading wishlist…</p>
      ) : !user ? (
        <p style={{ textAlign: "center", marginTop: "1.5rem" }}>Sign in to view your wishlist.</p>
      ) : error ? (
        <p style={{ textAlign: "center", marginTop: "1.5rem" }}>{error}</p>
      ) : products.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "1.5rem" }}>
          No saved items yet. More products unlock as we hit funding goals.
        </p>
      ) : (
        <div className="mp-grid nv-card-grid" style={{ marginTop: "1.5rem" }}>
          {products.map(({ item, meta, image, price }) => (
            <article key={item.id} className="mp-card nv-card">
              <div className="mp-image nv-image">
                {image ? <img src={image} alt={item.product_name} loading="lazy" /> : null}
              </div>
              <h3>
                {meta ? <Link to={meta.href}>{item.product_name}</Link> : item.product_name}
              </h3>
              {price != null ? <p className="price">${Number(price).toFixed(2)}</p> : null}
              <button
                className="btn-secondary"
                onClick={() => handleRemove(item)}
                disabled={pendingId === item.id}
              >
                Remove from Wishlist
              </button>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
