import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MarketTabs from "../../components/MarketTabs";
import AddToCartButton from "../../components/AddToCartButton";
import SaveButton from "../../components/SaveButton";
import "../../styles/_cards.css";
import "../../styles/marketplace.css";
import { useToast } from "@/components/Toast";
import { useAuthUser } from "@/lib/useAuthUser";
import { addToWishlist, getWishlist, removeFromWishlist } from "@/services/wishlist";
import type { MarketProduct, WishlistItem } from "@/types/market";

type ProductCardData = MarketProduct & { price: number; image: string; href: string };

const PRODUCTS: ProductCardData[] = [
  { id: "turian-plush", name: "Turian Plush", price: 24, image: "/Marketplace/Turianplushie.png", href: "/marketplace/turian-plush" },
  { id: "navatar-tee", name: "Navatar Tee", price: 18, image: "/Marketplace/Turiantshirt.png", href: "/marketplace/navatar-tee" },
  { id: "stickers", name: "Sticker Pack", price: 6, image: "/Marketplace/Stickerpack.png", href: "/marketplace/stickers" },
];

export default function MarketplaceShop() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState(true);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const toast = useToast();
  const { user, loading: authLoading } = useAuthUser();

  const wishlistNames = useMemo(() => new Set(wishlist.map((item) => item.product_name)), [wishlist]);

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
          console.warn("wishlist", error);
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

  const toggleWishlist = async (product: ProductCardData) => {
    if (!user) {
      toast({ text: "Sign in to use your wishlist.", kind: "warn" });
      return;
    }

    try {
      setPendingId(product.id);

      const existing = wishlist.find((item) => item.product_name === product.name);

      if (existing) {
        await removeFromWishlist(existing.id);
        setWishlist((prev) => prev.filter((item) => item.id !== existing.id));
        toast({ text: "Removed from wishlist", kind: "warn" });
      } else {
        const created = await addToWishlist(product);
        setWishlist((prev) => [created, ...prev]);
        toast({ text: "Added to wishlist", kind: "ok" });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not update wishlist";
      toast({ text: message, kind: "err" });
    } finally {
      setPendingId((prev) => (prev === product.id ? null : prev));
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
        {PRODUCTS.map(p => (
          <article key={p.id} className="mp-card nv-card">
            <div className="mp-image nv-image">
              <img src={p.image} alt={p.name} loading="lazy" />
            </div>
            <h3><Link to={p.href}>{p.name}</Link></h3>
            <p className="price">${p.price.toFixed(2)}</p>
            <div className="actions">
              <AddToCartButton id={p.id} name={p.name} price={p.price} image={p.image} />
              <SaveButton id={`product:${p.id}`} kind="product" title={p.name} href={p.href} />
            </div>
            <button
              className="btn-secondary w-full"
              disabled={(loadingWishlist && !wishlist.length) || pendingId === p.id}
              onClick={() => toggleWishlist(p)}
              aria-pressed={wishlistNames.has(p.name)}
            >
              {wishlistNames.has(p.name) ? "In Wishlist" : "Add to Wishlist"}
            </button>
          </article>
        ))}
      </div>
      <p style={{ textAlign: "center", marginTop: "1.5rem", opacity: 0.8 }}>
        More products unlock as we hit funding goals.
      </p>
    </main>
  );
}
