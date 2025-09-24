import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MarketTabs from "../../components/MarketTabs";
import "../../styles/marketplace.css";
import { fetchWishlistIds, toggleWishlistItem } from "@/lib/marketplace";
import { useToast } from "@/components/Toast";
import { useAuthUser } from "@/lib/useAuthUser";

const LOOKUP: Record<string, { name: string; image: string; href: string; price: number }> = {
  "turian-plush": { name: "Turian Plush", image: "/Marketplace/Turianplushie.png", href: "/marketplace/turian-plush", price: 24 },
  "navatar-tee": { name: "Navatar Tee", image: "/Marketplace/Turiantshirt.png", href: "/marketplace/navatar-tee", price: 18 },
  stickers: { name: "Sticker Pack", image: "/Marketplace/Stickerpack.png", href: "/marketplace/stickers", price: 6 },
};

export default function MarketplaceWishlist() {
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const { user } = useAuthUser();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const ids = await fetchWishlistIds();
        if (active) setItems(ids);
      } catch (error) {
        if (import.meta.env.DEV) console.warn(error);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const products = useMemo(() => items.map((id) => ({ id, data: LOOKUP[id] })).filter((p) => p.data), [items]);

  const handleRemove = async (id: string) => {
    if (!user) {
      toast({ text: "Sign in to update your wishlist.", kind: "warn" });
      return;
    }
    try {
      const { saved } = await toggleWishlistItem(id);
      if (!saved) {
        setItems((prev) => prev.filter((x) => x !== id));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not update wishlist";
      toast({ text: message, kind: "err" });
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
      ) : products.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "1.5rem" }}>
          No saved items yet. More products unlock as we hit funding goals.
        </p>
      ) : (
        <div className="mp-grid nv-card-grid" style={{ marginTop: "1.5rem" }}>
          {products.map(({ id, data }) => (
            <article key={id} className="mp-card nv-card">
              <div className="mp-image nv-image">
                <img src={data.image} alt={data.name} loading="lazy" />
              </div>
              <h3>
                <Link to={data.href}>{data.name}</Link>
              </h3>
              <p className="price">${data.price.toFixed(2)}</p>
              <button className="btn-secondary" onClick={() => handleRemove(id)}>
                Remove from Wishlist
              </button>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
