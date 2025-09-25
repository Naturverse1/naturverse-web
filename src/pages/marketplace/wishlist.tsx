import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MarketTabs from '../../components/MarketTabs';
import '../../styles/marketplace.css';
import { useToast } from '@/components/Toast';
import { useAuthUser } from '@/lib/useAuthUser';
import { fetchWishlist, removeFromWishlist, type ProductSummary } from '@/lib/wishlist';
import { formatPrice, resolveProductImage, DEFAULT_PRODUCT_IMAGE } from '@/hooks/useProducts';
import resolveImageUrl from '@/utils/resolveImageUrl';
import { cart } from '@/lib/cart';
import { track } from '@/lib/analytics';

export default function MarketplaceWishlist() {
  const [items, setItems] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);
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
      setPendingSlug(null);
      setLoading(false);
      return () => {
        active = false;
      };
    }

    setLoading(true);
    setError(null);
    setPendingSlug(null);
    setItems([]);

    fetchWishlist()
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

  const removeWishlistEntry = async (
    entry: ProductSummary,
    options: { message: string; toastKind: 'ok' | 'warn' | 'err'; trackEvent: string; trackExtra?: Record<string, unknown>; onSuccess?: () => void }
  ) => {
    if (!user) {
      toast({ text: 'Sign in to update your wishlist.', kind: 'warn' });
      return;
    }
    try {
      setPendingSlug(entry.slug);
      const res = await removeFromWishlist(entry.slug);
      if (!res.ok) {
        const message =
          res.reason === 'auth'
            ? 'Sign in to update your wishlist.'
            : 'Could not update wishlist';
        toast({ text: message, kind: res.reason === 'db' ? 'err' : 'warn' });
        if (res.reason === 'auth') {
          setItems([]);
        }
        return;
      }
      setItems((prev) => prev.filter((item) => item.slug !== entry.slug));
      options.onSuccess?.();
      toast({ text: options.message, kind: options.toastKind });
      track(options.trackEvent, { slug: entry.slug, name: entry.name, ...options.trackExtra });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not update wishlist';
      toast({ text: message, kind: 'err' });
    } finally {
      setPendingSlug((prev) => (prev === entry.slug ? null : prev));
    }
  };

  const handleRemove = (entry: ProductSummary) =>
    removeWishlistEntry(entry, { message: 'Removed from wishlist', toastKind: 'warn', trackEvent: 'wishlist_remove' });

  const handleMoveToCart = (entry: ProductSummary) =>
    removeWishlistEntry(entry, {
      message: 'Moved to cart',
      toastKind: 'ok',
      trackEvent: 'wishlist_move_to_cart',
      onSuccess: () => {
        cart.add(entry.slug, 1, {
          name: entry.name,
          price_cents: entry.price_cents,
          image_url: entry.image_url ?? undefined,
        });
      },
    });

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
      ) : items.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          No saved items yet. More products unlock as we hit funding goals.
        </p>
      ) : (
        <div className="mp-grid nv-card-grid" style={{ marginTop: '1.5rem' }}>
          {items.map((entry) => {
            const fallbackImage = resolveProductImage(entry.slug);
            const imageSrc = resolveImageUrl(entry.image_url ?? fallbackImage);
            return (
              <article key={entry.id} className="mp-card nv-card">
                <div className="mp-image nv-image">
                  <img
                    src={imageSrc}
                    alt={entry.name}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
                    }}
                  />
                </div>
                <h3>
                  <Link to={`/marketplace/${entry.slug}`}>{entry.name}</Link>
                </h3>
                <p className="price">{formatPrice(entry.price_cents)}</p>
                <div className="wishlist-actions">
                  <button className="btn-secondary" onClick={() => void handleRemove(entry)} disabled={pendingSlug === entry.slug}>
                    Remove
                  </button>
                  <button
                    className="btn-primary"
                    onClick={() => void handleMoveToCart(entry)}
                    disabled={pendingSlug === entry.slug}
                  >
                    Move to cart
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
