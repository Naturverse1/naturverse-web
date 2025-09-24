import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MarketTabs from "../../components/MarketTabs";
import AddToCartButton from "../../components/AddToCartButton";
import SaveButton from "../../components/SaveButton";
import "../../styles/_cards.css";
import "../../styles/marketplace.css";
import { toggleWishlistItem, fetchWishlistItems, type WishlistItem } from "@/lib/marketplace";
import { useToast } from "@/components/Toast";
import { useAuthUser } from "@/lib/useAuthUser";

const PRODUCTS = [
  { id:"turian-plush", name:"Turian Plush", price:24, image:"/Marketplace/Turianplushie.png", href:"/marketplace/turian-plush" },
  { id:"navatar-tee",  name:"Navatar Tee",  price:18, image:"/Marketplace/Turiantshirt.png",  href:"/marketplace/navatar-tee" },
  { id:"stickers",     name:"Sticker Pack", price:6,  image:"/Marketplace/Stickerpack.png", href:"/marketplace/stickers" },
];

export default function MarketplaceShop() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState(true);
  const toast = useToast();
  const { user } = useAuthUser();

  useEffect(() => {
    let active = true;

    if (!user) {
      setWishlist([]);
      setLoadingWishlist(false);
      return () => {
        active = false;
      };
    }

    (async () => {
      try {
        setLoadingWishlist(true);
        const items = await fetchWishlistItems();
        if (active) setWishlist(items);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn("wishlist", error);
        }
        if (active) setWishlist([]);
      } finally {
        if (active) setLoadingWishlist(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [user]);

  const toggleWishlist = async (product: (typeof PRODUCTS)[number]) => {
    if (!user) {
      toast({ text: "Sign in to use your wishlist.", kind: "warn" });
      return;
    }

    try {
      const { saved, item } = await toggleWishlistItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        href: product.href,
      });
      setWishlist((prev) => {
        if (saved && item) {
          const map = new Map(prev.map((entry) => [entry.itemId, entry] as const));
          let price: number | null = null;
          if (typeof item.product_price === "number") {
            price = item.product_price;
          } else if (typeof item.product_price === "string") {
            const parsed = Number(item.product_price);
            price = Number.isFinite(parsed) ? parsed : null;
          }

          map.set(item.item_id, {
            id: item.id,
            itemId: item.item_id,
            name: item.product_name,
            price,
            image: item.product_image ?? null,
            href: item.product_href ?? null,
            addedAt: item.added_at ?? item.created_at ?? null,
          });
          return Array.from(map.values()).sort((a, b) => {
            const left = a.addedAt ? new Date(a.addedAt).getTime() : 0;
            const right = b.addedAt ? new Date(b.addedAt).getTime() : 0;
            return right - left;
          });
        }

        if (!saved) {
          return prev.filter((entry) => entry.itemId !== product.id);
        }

        return prev;
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
              onClick={() => toggleWishlist(p)}
              aria-pressed={wishlist.some((entry) => entry.itemId === p.id)}
            >
              {wishlist.some((entry) => entry.itemId === p.id) ? "In Wishlist" : "Add to Wishlist"}
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
