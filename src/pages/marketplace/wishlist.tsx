import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import AddToCartButton from "../../components/AddToCartButton";
import MarketTabs from "../../components/MarketTabs";
import SaveButton from "../../components/SaveButton";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../lib/auth-context";
import { listWishlistProducts, type WishlistProduct } from "../../services/wishlist";
import "../../styles/marketplace.css";

export default function MarketplaceWishlist() {
  const { ready, user } = useAuth();
  const wishlist = useWishlist();
  const [items, setItems] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    listWishlistProducts()
      .then((rows) => setItems(rows))
      .catch((err) => {
        console.error("wishlist_fetch_failed", err);
        setError("Unable to load your wishlist right now.");
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, [user, wishlist.items]);

  let content: JSX.Element;
  if (!ready) {
    content = <p style={{ textAlign: "center", marginTop: "1.5rem" }}>Loading your wishlist…</p>;
  } else if (!user) {
    content = (
      <p style={{ textAlign: "center", marginTop: "1.5rem" }}>
        Sign in to save items to your wishlist.
      </p>
    );
  } else if (loading) {
    content = <p style={{ textAlign: "center", marginTop: "1.5rem" }}>Loading your wishlist…</p>;
  } else if (error) {
    content = (
      <p style={{ textAlign: "center", marginTop: "1.5rem" }}>
        {error}
      </p>
    );
  } else if (items.length === 0) {
    content = <p style={{ textAlign: "center", marginTop: "1.5rem" }}>No saved items yet.</p>;
  } else {
    content = (
      <div className="mp-grid nv-card-grid">
        {items.map((product) => {
          const price = product.priceCents / 100;
          return (
            <article key={product.slug} className="mp-card nv-card">
              <div className="mp-image nv-image">
                <img src={product.imageUrl} alt={product.title} loading="lazy" />
              </div>
              <h3>
                <Link to={`/marketplace/${product.slug}`}>{product.title}</Link>
              </h3>
              <p className="price">${price.toFixed(2)}</p>
              <div className="actions">
                <AddToCartButton
                  id={product.slug}
                  name={product.title}
                  price={price}
                  image={product.imageUrl}
                />
                <SaveButton
                  id={`product:${product.slug}`}
                  kind="product"
                  title={product.title}
                  href={`/marketplace/${product.slug}`}
                />
              </div>
            </article>
          );
        })}
      </div>
    );
  }

  return (
    <main className="container">
      <div className="mk-head">
        <div className="mk-breadcrumbs">
          <Link to="/">Home</Link> / <Link to="/marketplace">Marketplace</Link> / <span>Wishlist</span>
        </div>
        <h1>Marketplace</h1>
      </div>

      <MarketTabs />
      {content}
    </main>
  );
}
