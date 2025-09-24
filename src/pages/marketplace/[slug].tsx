import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import AddToCartButton from '../../components/AddToCartButton';
import SaveButton from '../../components/SaveButton';
import Breadcrumbs from '../../components/Breadcrumbs';
import './../../styles/marketplace.css';
import { useToast } from '@/components/Toast';
import { useAuthUser } from '@/lib/useAuthUser';
import { addToWishlist, listWishlist, removeFromWishlist } from '@/features/wishlist/api';
import type { MarketProduct, WishlistItem } from '@/types/market';
import { fetchProducts, FALLBACK_PRODUCTS, formatPrice, type Product } from '@/hooks/useProducts';
import { track } from '@/lib/analytics';

export default function ProductPage() {
  const { slug = '' } = useParams();
  const [product, setProduct] = useState<Product | null>(() => FALLBACK_PRODUCTS.find((item) => item.slug === slug) ?? null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const toast = useToast();
  const { user, loading: authLoading } = useAuthUser();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState(true);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let active = true;
    setLoadingProduct(true);
    const fallback = FALLBACK_PRODUCTS.find((item) => item.slug === slug) ?? null;
    setProduct(fallback);
    fetchProducts()
      .then((items) => {
        if (!active) return;
        const found = items.find((item) => item.slug === slug) ?? fallback ?? null;
        setProduct(found);
      })
      .catch((error) => {
        if (import.meta.env.DEV) console.warn(error);
      })
      .finally(() => {
        if (active) setLoadingProduct(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    let active = true;
    if (authLoading) {
      return () => {
        active = false;
      };
    }

    if (!user) {
      setWishlist([]);
      setPending(false);
      setLoadingWishlist(false);
      return () => {
        active = false;
      };
    }

    setLoadingWishlist(true);
    setPending(false);

    listWishlist()
      .then((items) => {
        if (active) setWishlist(items);
      })
      .catch((error) => {
        if (import.meta.env.DEV) console.warn(error);
        if (active) setWishlist([]);
      })
      .finally(() => {
        if (active) setLoadingWishlist(false);
      });

    return () => {
      active = false;
    };
  }, [user, authLoading]);

  const marketProduct = useMemo<MarketProduct | null>(() => {
    if (!product) return null;
    return {
      id: product.slug,
      name: product.name,
      price: product.price_cents / 100,
      image: product.image_url,
    };
  }, [product]);

  const priceLabel = product ? formatPrice(product.price_cents) : '';
  const priceValue = product ? product.price_cents / 100 : 0;
  const inWishlist = slug ? wishlist.some((item) => item.product_slug === slug) : false;

  const onToggleWishlist = async () => {
    if (!user) {
      toast({ text: 'Sign in to use your wishlist.', kind: 'warn' });
      return;
    }
    if (!marketProduct) return;
    try {
      setPending(true);
      const productSlug = marketProduct.id;
      const existing = wishlist.find((item) => item.product_slug === productSlug);

      if (existing) {
        await removeFromWishlist(productSlug);
        setWishlist((prev) => prev.filter((item) => item.product_slug !== productSlug));
        toast({ text: 'Removed from wishlist', kind: 'warn' });
        track('wishlist_remove', { slug: productSlug, name: marketProduct.name });
      } else {
        const priceCents =
          typeof product?.price_cents === 'number'
            ? product.price_cents
            : marketProduct.price != null
            ? Math.round(marketProduct.price * 100)
            : 0;

        const created = await addToWishlist({
          slug: productSlug,
          name: marketProduct.name,
          price_cents: priceCents,
          image_url: product?.image_url ?? marketProduct.image,
        });

        if (created) {
          setWishlist((prev) => [created, ...prev.filter((item) => item.product_slug !== productSlug)]);
        } else {
          const latest = await listWishlist();
          setWishlist(latest);
        }

        toast({ text: 'Added to wishlist', kind: 'ok' });
        track('wishlist_add', { slug: productSlug, name: marketProduct.name });
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'SIGN_IN_REQUIRED') {
        toast({ text: 'Sign in to use your wishlist.', kind: 'warn' });
        return;
      }
      const message = error instanceof Error ? error.message : 'Could not update wishlist';
      toast({ text: message, kind: 'err' });
    } finally {
      setPending(false);
    }
  };

  if (!product && !loadingProduct) {
    return null;
  }

  return (
    <main id="main" data-page="marketplace" className="nvrs-section marketplace nv-secondary-scope">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Marketplace', href: '/marketplace' }, { label: product?.name ?? 'Product' }]} />
      {product ? (
        <article className="nv-card">
          <div className="mp-hero">
            <img className="mp-img" src={product.image_url} alt={product.name} />
          </div>
          <h1>{product.name}</h1>
          <div>{priceLabel}</div>
          {product.description ? <p>{product.description}</p> : null}
          {marketProduct && (
            <div className="nv-cta">
              <AddToCartButton
                id={marketProduct.id}
                name={marketProduct.name}
                price={priceValue}
                image={marketProduct.image ?? ''}
              />
              <SaveButton id={`product:${marketProduct.id}`} kind="product" title={marketProduct.name} href={`/marketplace/${marketProduct.id}`} />
            </div>
          )}
          <button
            className="btn-secondary w-full"
            disabled={(loadingWishlist && !wishlist.length) || pending}
            onClick={onToggleWishlist}
            aria-pressed={inWishlist}
            style={{ marginTop: '1rem' }}
          >
            {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
          </button>
        </article>
      ) : (
        <p style={{ marginTop: '2rem' }}>Loading product…</p>
      )}
    </main>
  );
}
