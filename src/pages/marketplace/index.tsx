import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MarketTabs from "../../components/MarketTabs";
import AddToCartButton from "../../components/AddToCartButton";
import SaveButton from "../../components/SaveButton";
import "../../styles/_cards.css";
import "../../styles/marketplace.css";
import { getWishlistIds, toggleWishlist as toggleWishlistService } from "@/services/wishlist";
import { useToast } from "@/components/Toast";
import { useAuthUser } from "@/lib/useAuthUser";

const PRODUCTS = [
  { id:"turian-plush", name:"Turian Plush", price:24, image:"/Marketplace/Turianplushie.png", href:"/marketplace/turian-plush" },
  { id:"navatar-tee",  name:"Navatar Tee",  price:18, image:"/Marketplace/Turiantshirt.png",  href:"/marketplace/navatar-tee" },
  { id:"stickers",     name:"Sticker Pack", price:6,  image:"/Marketplace/Stickerpack.png", href:"/marketplace/stickers" },
];

export default function MarketplaceShop() {
  const [wishlist, setWishlist] = useState<Set<string>>(() => new Set());
  const [loadingWishlist, setLoadingWishlist] = useState(true);
  const [busyIds, setBusyIds] = useState<Set<string>>(() => new Set());
  const toast = useToast();
  const { user } = useAuthUser();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const ids = await getWishlistIds();
        if (active) setWishlist(new Set(ids));
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn("wishlist", error);
        }
      } finally {
        if (active) setLoadingWishlist(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleToggleWishlist = async (itemId: string) => {
    if (!user) {
      toast({ text: "Sign in to use your wishlist.", kind: "warn" });
      return;
    }

    try {
      setBusyIds((prev) => {
        const next = new Set(prev);
        next.add(itemId);
        return next;
      });
      const saved = await toggleWishlistService(itemId);
      setWishlist((prev) => {
        const next = new Set(prev);
        if (saved) next.add(itemId);
        else next.delete(itemId);
        return next;
      });
      toast({ text: saved ? "Added to wishlist" : "Removed from wishlist", kind: saved ? "ok" : "warn" });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message === "not_signed_in"
            ? "Sign in to use your wishlist."
            : error.message === "product_not_found"
              ? "Product unavailable."
              : error.message
          : "Could not update wishlist";
      toast({ text: message, kind: error instanceof Error && error.message === "not_signed_in" ? "warn" : "err" });
    } finally {
      setBusyIds((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
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
        {PRODUCTS.map((p) => {
          const isSaved = wishlist.has(p.id);
          const isBusy = busyIds.has(p.id);
          return (
            <article key={p.id} className="mp-card nv-card">
              <div className="mp-image nv-image">
                <img src={p.image} alt={p.name} loading="lazy" />
              </div>
              <h3>
                <Link to={p.href}>{p.name}</Link>
              </h3>
              <p className="price">${p.price.toFixed(2)}</p>
              <div className="actions">
                <AddToCartButton id={p.id} name={p.name} price={p.price} image={p.image} />
                <SaveButton id={`product:${p.id}`} kind="product" title={p.name} href={p.href} />
              </div>
              <button
                className="btn-secondary w-full"
                disabled={isBusy || (loadingWishlist && wishlist.size === 0)}
                onClick={() => handleToggleWishlist(p.id)}
                aria-pressed={isSaved}
              >
                {isSaved ? "Saved" : "Add to Wishlist"}
              </button>
            </article>
          );
        })}
      </div>
      <p style={{ textAlign: "center", marginTop: "1.5rem", opacity: 0.8 }}>
        More products unlock as we hit funding goals.
      </p>
    </main>
  );
}
