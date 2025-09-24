import { useEffect, useState } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import ProductCard from "../../components/ProductCard";
import { fetchProducts } from "../../lib/commerce/products";
import type { Product } from "../../lib/commerce/types";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

export default function Marketplace() {
  const { add } = useCart();
  const wishlist = useWishlist();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await fetchProducts();
        if (!cancelled) {
          setItems(data);
          setError(null);
        }
      } catch (err) {
        console.error("Failed to load marketplace products", err);
        if (!cancelled) {
          setItems([]);
          setError("Unable to load marketplace products.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Marketplace", href: "/marketplace" },
        ]}
      />
      <h1>Marketplace</h1>
      {loading ? (
        <p>Loading products…</p>
      ) : error ? (
        <p className="text-red-700">{error}</p>
      ) : items.length === 0 ? (
        <p>No products available right now.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <ProductCard
              key={p.id}
              product={{ ...p, saved: wishlist.has(p.id) }}
              onAddToCart={(item) => add(item)}
              onToggleSave={(item) => wishlist.toggle(item.id)}
              showCartButton
              showSaveButton
            />
          ))}
        </div>
      )}
    </section>
  );
}
