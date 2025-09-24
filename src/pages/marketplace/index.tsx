import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import MarketTabs from '../../components/MarketTabs';
import AddToCartButton from '../../components/AddToCartButton';
import SaveButton from '../../components/SaveButton';
import '../../styles/_cards.css';
import '../../styles/marketplace.css';
import { useToast } from '@/components/Toast';
import { useAuthUser } from '@/lib/useAuthUser';
import { fetchProducts, FALLBACK_PRODUCTS, formatPrice, type Product } from '@/hooks/useProducts';
import { addToWishlist, getWishlist, removeFromWishlist } from '@/services/wishlist';
import { track } from '@/lib/analytics';
import type { MarketProduct, WishlistItem } from '@/types/market';

type ProductCard = {
  product: Product;
  marketProduct: MarketProduct;
  price: number;
  priceLabel: string;
  href: string;
};

export default function MarketplaceShop() {
  const [catalog, setCatalog] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState(true);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const toast = useToast();
  const { user, loading: authLoading } = useAuthUser();

  useEffect(() => {
    let active = true;
    fetchProducts()
      .then((items) => {
        if (active) setCatalog(items);
      })
      .catch((error) => {
        if (import.meta.env.DEV) {
          console.warn('products', error);
        }
      })
      .finally(() => {
        if (active) setLoadingProducts(false);
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
      setWishlist([]);
      setLoadingWishlist(false);
      return () => {
        active = false;
      };
    }

    setLoadingWishlist(true);
    getWishlist()
      .then((items) => {
        if (active) setWishlist(items);
      })
      .catch((error) => {
        if (import.meta.env.DEV) {
          console.warn('wishlist', error);
        }
        if (active) setWishlist([]);
      })
      .finally(() => {
        if (active) setLoadingWishlist(false);
      });

    return () => {
      active = false;
    };
  }, [user, authLoading]);

  const wishlistKeys = useMemo(() => {
    const keys = new Set<string>();
    for (const item of wishlist) {
      if (item.product_id) keys.add(item.product_id);
      const slug = item.product?.slug;
      if (slug) keys.add(slug);
    }
    return keys;
  }, [wishlist]);

  const cards = useMemo<ProductCard[]>(
    () =>
      catalog.map((product) => {
        const price = product.price_cents / 100;
        const marketProduct: MarketProduct = {
          id: product.slug,
          productId: product.id,
          name: product.name,
          price,
          image: product.image_url,
        };
        return {
          product,
          marketProduct,
          price,
          priceLabel: formatPrice(product.price_cents),
          href: `/marketplace/${product.slug}`,
        };
      }),
    [catalog]
  );

  const toggleWishlist = async (card: ProductCard) => {
    if (!user) {
      toast({ text: 'Sign in to use your wishlist.', kind: 'warn' });
      return;
    }

    try {
      setPendingId(card.product.slug);

      const existing = wishlist.find((item) => {
        if (card.marketProduct.productId && item.product_id === card.marketProduct.productId) {
          return true;
        }
        const slug = item.product?.slug;
        return slug ? slug === card.marketProduct.id : false;
      });

      if (existing) {
        await removeFromWishlist(existing.id, card.marketProduct.id);
        setWishlist((prev) => prev.filter((item) => item.id !== existing.id));
        toast({ text: 'Removed from wishlist', kind: 'warn' });
        track('wishlist_remove', { slug: card.product.slug, name: card.product.name });
      } else {
        const created = await addToWishlist(card.marketProduct);
        setWishlist((prev) => [created, ...prev]);
        toast({ text: 'Added to wishlist', kind: 'ok' });
        track('wishlist_add', { slug: card.product.slug, name: card.product.name });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not update wishlist';
      toast({ text: message, kind: 'err' });
    } finally {
      setPendingId((prev) => (prev === card.product.slug ? null : prev));
    }
  };

  return (
    <main className="container">
      <div className="mk-head">
        <div className="mk-breadcrumbs">
          <Link to="/">Home</Link> / <span>Marketplace</span>
        </div>
        <h1>Marketplace</h1>
      </div>

      <MarketTabs />

      <div className="mp-grid nv-card-grid">
        {cards.map((card) => (
          <article key={card.product.slug} className="mp-card nv-card">
            <div className="mp-image nv-image">
              <img src={card.product.image_url} alt={card.product.name} loading="lazy" />
            </div>
            <h3>
              <Link to={card.href}>{card.product.name}</Link>
            </h3>
            <p className="price">{card.priceLabel}</p>
            <div className="actions">
              <AddToCartButton
                id={card.marketProduct.id}
                name={card.marketProduct.name}
                price={card.price}
                image={card.marketProduct.image ?? ''}
              />
              <SaveButton id={`product:${card.marketProduct.id}`} kind="product" title={card.marketProduct.name} href={card.href} />
            </div>
            <button
              className="btn-secondary w-full"
              disabled={(loadingWishlist && !wishlist.length) || pendingId === card.product.slug || loadingProducts}
              onClick={() => void toggleWishlist(card)}
              aria-pressed={wishlistKeys.has(card.marketProduct.productId ?? card.marketProduct.id)}
            >
              {wishlistKeys.has(card.marketProduct.productId ?? card.marketProduct.id) ? 'In Wishlist' : 'Add to Wishlist'}
            </button>
          </article>
        ))}
      </div>
      <p style={{ textAlign: 'center', marginTop: '1.5rem', opacity: 0.8 }}>
        More products unlock as we hit funding goals.
      </p>
    </main>
  );
}
