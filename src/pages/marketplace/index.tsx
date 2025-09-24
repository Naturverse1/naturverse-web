import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MarketTabs from "../../components/MarketTabs";
import AddToCartButton from "../../components/AddToCartButton";
import SaveButton from "../../components/SaveButton";
import "../../styles/_cards.css";
import "../../styles/marketplace.css";
import { toggleWishlistItem, fetchWishlistIds } from "@/lib/marketplace";
import { useToast } from "@/components/Toast";
import { useAuthUser } from "@/lib/useAuthUser";

const PRODUCTS = [
  { id:"turian-plush", name:"Turian Plush", price:24, image:"/Marketplace/Turianplushie.png", href:"/marketplace/turian-plush" },
  { id:"navatar-tee",  name:"Navatar Tee",  price:18, image:"/Marketplace/Turiantshirt.png",  href:"/marketplace/navatar-tee" },
  { id:"stickers",     name:"Sticker Pack", price:6,  image:"/Marketplace/Stickerpack.png", href:"/marketplace/stickers" },
];

export default function MarketplaceShop() {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState(true);
  const toast = useToast();
  const { user } = useAuthUser();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const ids = await fetchWishlistIds();
        if (active) setWishlist(ids);
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

  const toggleWishlist = async (itemId: string) => {
    if (!user) {
      toast({ text: "Sign in to use your wishlist.", kind: "warn" });
      return;
    }

    try {
      const { saved } = await toggleWishlistItem(itemId);
      setWishlist((prev) => {
        const set = new Set(prev);
        if (saved) set.add(itemId);
        else set.delete(itemId);
        return Array.from(set);
      });
      toast({ text: saved ? "Added to wishlist" : "Removed from wishlist", kind: saved ? "ok" : "warn" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not update wishlist";
      toast({ text: message, kind: "err" });
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
              disabled={loadingWishlist && !wishlist.length}
              onClick={() => toggleWishlist(p.id)}
              aria-pressed={wishlist.includes(p.id)}
            >
              {wishlist.includes(p.id) ? "In Wishlist" : "Add to Wishlist"}
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
