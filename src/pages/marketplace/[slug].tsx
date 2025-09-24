import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddToCartButton from "../../components/AddToCartButton";
import SaveButton from "../../components/SaveButton";
import Breadcrumbs from "../../components/Breadcrumbs";
import "./../../styles/marketplace.css";
import { getWishlistIds, toggleWishlist as toggleWishlistService } from "@/services/wishlist";
import { useToast } from "@/components/Toast";
import { useAuthUser } from "@/lib/useAuthUser";

const MAP:any = {
  "turian-plush": { id:"turian-plush", name:"Turian Plush", price:24, image:"/Marketplace/Turianplushie.png", blurb:"Cuddly plush of Turian." },
  "navatar-tee":  { id:"navatar-tee",  name:"Navatar Tee",  price:18, image:"/Marketplace/Turiantshirt.png",  blurb:"Soft tee with Navatar." },
  "stickers":     { id:"stickers",     name:"Sticker Pack", price:6,  image:"/Marketplace/Stickerpack.png", blurb:"Six vinyl stickers." },
};

export default function ProductPage(){
  const { slug="" } = useParams();
  const p = MAP[slug];
  const toast = useToast();
  const { user } = useAuthUser();
  const [wishlist, setWishlist] = useState<Set<string>>(() => new Set());
  const [loadingWishlist, setLoadingWishlist] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const ids = await getWishlistIds();
        if (active) setWishlist(new Set(ids));
      } catch (error) {
        if (import.meta.env.DEV) console.warn(error);
      } finally {
        if (active) setLoadingWishlist(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (!p) return null;

  const inWishlist = wishlist.has(p.id);

  const onToggleWishlist = async () => {
    if (!user) {
      toast({ text: "Sign in to use your wishlist.", kind: "warn" });
      return;
    }
    try {
      setBusy(true);
      const saved = await toggleWishlistService(p.id);
      setWishlist((prev) => {
        const next = new Set(prev);
        if (saved) next.add(p.id);
        else next.delete(p.id);
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
      setBusy(false);
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
          disabled={busy || (loadingWishlist && wishlist.size === 0)}
          onClick={onToggleWishlist}
          aria-pressed={inWishlist}
          style={{ marginTop: "1rem" }}
        >
          {inWishlist ? "Saved" : "Add to Wishlist"}
        </button>
      </article>
    </main>
  );
}
