import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddToCartButton from "../../components/AddToCartButton";
import SaveButton from "../../components/SaveButton";
import Breadcrumbs from "../../components/Breadcrumbs";
import "./../../styles/marketplace.css";
import { useToast } from "@/components/Toast";
import { useAuthUser } from "@/lib/useAuthUser";
import { addToWishlist, getWishlist, removeFromWishlist } from "@/services/wishlist";
import type { MarketProduct, WishlistItem } from "@/types/market";

type ProductDetail = MarketProduct & { price: number; image: string; blurb: string };

const MAP: Record<string, ProductDetail> = {
  "turian-plush": { id: "turian-plush", name: "Turian Plush", price: 24, image: "/Marketplace/Turianplushie.png", blurb: "Cuddly plush of Turian." },
  "navatar-tee": { id: "navatar-tee", name: "Navatar Tee", price: 18, image: "/Marketplace/Turiantshirt.png", blurb: "Soft tee with Navatar." },
  "stickers": { id: "stickers", name: "Sticker Pack", price: 6, image: "/Marketplace/Stickerpack.png", blurb: "Six vinyl stickers." },
};

export default function ProductPage(){
  const { slug="" } = useParams();
  const p = MAP[slug];
  const toast = useToast();
  const { user, loading: authLoading } = useAuthUser();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState(true);
  const [pending, setPending] = useState(false);

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

    getWishlist()
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

  if (!p) return null;

  const inWishlist = wishlist.some((item) => item.product_name === p.name);

  const onToggleWishlist = async () => {
    if (!user) {
      toast({ text: "Sign in to use your wishlist.", kind: "warn" });
      return;
    }
    try {
      setPending(true);
      const existing = wishlist.find((item) => item.product_name === p.name);

      if (existing) {
        await removeFromWishlist(existing.id);
        setWishlist((prev) => prev.filter((item) => item.id !== existing.id));
        toast({ text: "Removed from wishlist", kind: "warn" });
      } else {
        const created = await addToWishlist(p);
        setWishlist((prev) => [created, ...prev]);
        toast({ text: "Added to wishlist", kind: "ok" });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not update wishlist";
      toast({ text: message, kind: "err" });
    } finally {
      setPending(false);
    }
  };
  return (
    <main id="main" data-page="marketplace" className="nvrs-section marketplace nv-secondary-scope">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Marketplace", href: "/marketplace" }, { label: p.name }]} />
      <article className="nv-card">
        <div className="mp-hero">
          <img className="mp-img" src={p.image} alt={p.name} />
        </div>
        <h1>{p.name}</h1>
        <div>${p.price.toFixed(2)}</div>
        <p>{p.blurb}</p>
        <div className="nv-cta">
          <AddToCartButton id={p.id} name={p.name} price={p.price} image={p.image}/>
          <SaveButton id={`product:${p.id}`} kind="product" title={p.name} href={`/marketplace/${p.id}`} />
        </div>
        <button
          className="btn-secondary w-full"
          disabled={(loadingWishlist && !wishlist.length) || pending}
          onClick={onToggleWishlist}
          aria-pressed={inWishlist}
          style={{ marginTop: "1rem" }}
        >
          {inWishlist ? "In Wishlist" : "Add to Wishlist"}
        </button>
      </article>
    </main>
  );
}
