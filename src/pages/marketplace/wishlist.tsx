import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import MarketTabs from '../../components/MarketTabs';
import '../../styles/marketplace.css';
import { useToast } from '@/components/Toast';
import { useAuthUser } from '@/lib/useAuthUser';
import { getWishlist, removeFromWishlist } from '@/services/wishlist';
import type { WishlistItem } from '@/types/market';
import { fetchProducts, FALLBACK_PRODUCTS, formatPrice, type Product } from '@/hooks/useProducts';
import { cart } from '@/lib/cart';
import { track } from '@/lib/analytics';

interface WishlistProductMeta {
  item: WishlistItem;
  product?: Product;
  image: string | null;
  priceCents: number | null;
  href?: string;
}

export default function MarketplaceWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [catalog, setCatalog] = useState<Product[]>(FALLBACK_PRODUCTS);
  const toast = useToast();
  const { user, loading: authLoading } = useAuthUser();

  useEffect(() => {
    let active = true;
    fetchProducts()
      .then((products) => {
        if (active) setCatalog(products);
      })
      .catch((err) => {
        if (import.meta.env.DEV) console.warn(err);
      });
    return () => {
      active = false;
    };
  }, []);

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
          setError(err instanceof Error ? err.message : 'Could not load wishlist');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user, authLoading]);

  const productsByName = useMemo(() => {
    const map = new Map<string, Product>();
    for (const product of catalog) {
      map.set(product.name, product);
    }
    return map;
  }, [catalog]);

  const derived = useMemo<WishlistProductMeta[]>(
    () =>
      items.map((item) => {
        const product = productsByName.get(item.product_name);
        const priceCents = product?.price_cents ?? (typeof item.product_price === 'number' ? Math.round(item.product_price * 100) : null);
        const image = item.product_image ?? product?.image_url ?? null;
        const href = product ? `/marketplace/${product.slug}` : undefined;
        return { item, product, image, priceCents, href };
      }),
    [items, productsByName]
  );

  const handleRemove = async (entry: WishlistProductMeta) => {
    if (!user) {
      toast({ text: 'Sign in to update your wishlist.', kind: 'warn' });
      return;
    }
    try {
      setPendingId(entry.item.id);
      await removeFromWishlist(entry.item.id, entry.item.product_name);
      setItems((prev) => prev.filter((item) => item.id !== entry.item.id));
      toast({ text: 'Removed from wishlist', kind: 'warn' });
      track('wishlist_remove', { name: entry.item.product_name });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not update wishlist';
      toast({ text: message, kind: 'err' });
    } finally {
      setPendingId((prev) => (prev === entry.item.id ? null : prev));
    }
  };

  const handleMoveToCart = (entry: WishlistProductMeta) => {
    if (!entry.product) {
      toast({ text: 'Product not available yet.', kind: 'warn' });
      return;
    }
    cart.add(entry.product.slug, 1, {
      name: entry.product.name,
      price_cents: entry.product.price_cents,
      image_url: entry.product.image_url,
      product: entry.product,
    });
    void handleRemove(entry);
    track('wishlist_move_to_cart', { slug: entry.product.slug, name: entry.product.name });
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
        <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>Loading wishlist…</p>
      ) : !user ? (
        <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>Sign in to view your wishlist.</p>
      ) : error ? (
        <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>{error}</p>
      ) : derived.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          No saved items yet. More products unlock as we hit funding goals.
        </p>
      ) : (
        <div className="mp-grid nv-card-grid" style={{ marginTop: '1.5rem' }}>
          {derived.map((entry) => (
            <article key={entry.item.id} className="mp-card nv-card">
              <div className="mp-image nv-image">
                {entry.image ? <img src={entry.image} alt={entry.item.product_name} loading="lazy" /> : null}
              </div>
              <h3>{entry.href ? <Link to={entry.href}>{entry.item.product_name}</Link> : entry.item.product_name}</h3>
              {entry.priceCents != null ? <p className="price">{formatPrice(entry.priceCents)}</p> : null}
              <div className="wishlist-actions">
                <button className="btn-secondary" onClick={() => handleRemove(entry)} disabled={pendingId === entry.item.id}>
                  Remove
                </button>
                <button
                  className="btn-primary"
                  onClick={() => handleMoveToCart(entry)}
                  disabled={!entry.product || pendingId === entry.item.id}
                >
                  Move to cart
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
