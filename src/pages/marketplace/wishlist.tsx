import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MarketTabs from "../../components/MarketTabs";
import "../../styles/marketplace.css";
import { listWishlistProducts, toggleWishlist as toggleWishlistService, type WishlistProduct } from "@/services/wishlist";
import { useToast } from "@/components/Toast";
import { useAuthUser } from "@/lib/useAuthUser";

function formatPrice(cents: number | null | undefined) {
  if (typeof cents !== "number") return "";
  return `$${(cents / 100).toFixed(2)}`;
}

export default function MarketplaceWishlist() {
  const [items, setItems] = useState<WishlistProduct[] | null>(null);
  const [removing, setRemoving] = useState<Set<string>>(() => new Set());
  const toast = useToast();
  const { user } = useAuthUser();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const products = await listWishlistProducts();
        if (active) setItems(products);
      } catch (error) {
        if (import.meta.env.DEV) console.warn(error);
        if (active) setItems([]);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleRemove = async (slug: string) => {
    if (!user) {
      toast({ text: "Sign in to update your wishlist.", kind: "warn" });
      return;
    }

    setRemoving((prev) => {
      const next = new Set(prev);
      next.add(slug);
      return next;
    });

    try {
      const saved = await toggleWishlistService(slug);
      if (!saved) {
        setItems((prev) => (prev ?? []).filter((item) => item.slug !== slug));
        toast({ text: "Removed from wishlist", kind: "warn" });
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message === "not_signed_in"
            ? "Sign in to update your wishlist."
            : error.message === "product_not_found"
              ? "Product unavailable."
              : error.message
          : "Could not update wishlist";
      toast({ text: message, kind: error instanceof Error && error.message === "not_signed_in" ? "warn" : "err" });
    } finally {
      setRemoving((prev) => {
        const next = new Set(prev);
        next.delete(slug);
        return next;
      });
    }
  };

  const isLoading = items === null;
  const hasItems = Array.isArray(items) && items.length > 0;

  return (
    <main className="container">
      <div className="mk-head">
        <div className="mk-breadcrumbs">
          <Link to="/">Home</Link> / <Link to="/marketplace">Marketplace</Link> / <span>Wishlist</span>
        </div>
        <h1>Marketplace</h1>
      </div>

      <MarketTabs />

      {isLoading ? (
        <p style={{ textAlign: "center", marginTop: "1.5rem" }}>Loading wishlist…</p>
      ) : !hasItems ? (
        <p style={{ textAlign: "center", marginTop: "1.5rem" }}>
          No saved items yet. More products unlock as we hit funding goals.
        </p>
      ) : (
        <div className="mp-grid nv-card-grid" style={{ marginTop: "1.5rem" }}>
          {items.map((product) => {
            const disabled = removing.has(product.slug);
            return (
              <article key={product.id} className="mp-card nv-card">
                <div className="mp-image nv-image">
                  <img src={product.image_url} alt={product.title} loading="lazy" />
                </div>
                <h3>
                  <Link to={`/marketplace/${product.slug}`}>{product.title}</Link>
                </h3>
                {product.price_cents != null && (
                  <p className="price">{formatPrice(product.price_cents)}</p>
                )}
                <button className="btn-secondary" onClick={() => handleRemove(product.slug)} disabled={disabled}>
                  {disabled ? "Removing…" : "Remove from Wishlist"}
                </button>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
