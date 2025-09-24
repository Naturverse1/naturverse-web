import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MarketTabs from "../../components/MarketTabs";
import "../../styles/marketplace.css";
import { fetchWishlistItems, toggleWishlistItem, type WishlistItem } from "@/lib/marketplace";
import { useToast } from "@/components/Toast";
import { useAuthUser } from "@/lib/useAuthUser";

export default function MarketplaceWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const { user, loading: authLoading } = useAuthUser();

  useEffect(() => {
    let active = true;

    if (!user) {
      if (!authLoading) {
        setItems([]);
        setLoading(false);
      } else {
        setLoading(true);
      }
      return () => {
        active = false;
      };
    }

    (async () => {
      try {
        setLoading(true);
        const data = await fetchWishlistItems();
        if (active) setItems(data);
      } catch (error) {
        if (import.meta.env.DEV) console.warn(error);
        if (active) setItems([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [user, authLoading]);

  const handleRemove = async (item: WishlistItem) => {
    if (!user) {
      toast({ text: "Sign in to update your wishlist.", kind: "warn" });
      return;
    }
    try {
      const { saved } = await toggleWishlistItem({
        id: item.itemId,
        name: item.name,
        price: item.price ?? undefined,
        image: item.image ?? undefined,
        href: item.href ?? undefined,
      });
      if (!saved) {
        setItems((prev) => prev.filter((x) => x.itemId !== item.itemId));
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

      {!authLoading && !user ? (
        <p style={{ textAlign: "center", marginTop: "1.5rem" }}>
          Please sign in to view your wishlist.
        </p>
      ) : loading ? (
        <p style={{ textAlign: "center", marginTop: "1.5rem" }}>Loading wishlist…</p>
      ) : items.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "1.5rem" }}>
          No saved items yet. More products unlock as we hit funding goals.
        </p>
      ) : (
        <div className="mp-grid nv-card-grid" style={{ marginTop: "1.5rem" }}>
          {items.map((item) => (
            <article key={item.id} className="mp-card nv-card">
              <div className="mp-image nv-image">
                {item.image ? (
                  <img src={item.image} alt={item.name} loading="lazy" />
                ) : (
                  <div
                    style={{
                      alignItems: "center",
                      display: "flex",
                      justifyContent: "center",
                      height: "100%",
                      width: "100%",
                      fontSize: "0.875rem",
                      opacity: 0.7,
                    }}
                  >
                    No image
                  </div>
                )}
              </div>
              <h3>
                <Link to={item.href ?? `/marketplace/${item.itemId}`}>{item.name}</Link>
              </h3>
              {typeof item.price === "number" ? (
                <p className="price">${item.price.toFixed(2)}</p>
              ) : (
                <p className="price">Price unavailable</p>
              )}
              {(() => {
                if (!item.addedAt) return null;
                const parsed = new Date(item.addedAt);
                if (Number.isNaN(parsed.getTime())) return null;
                return (
                  <small style={{ display: "block", marginBottom: "0.75rem" }}>
                    Added on {parsed.toLocaleDateString()}
                  </small>
                );
              })()}
              <button className="btn-secondary" onClick={() => handleRemove(item)}>
                Remove from Wishlist
              </button>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
