import { useCart } from "../lib/cart";
import { Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import styles from "./Wishlist.module.css";

const LOOKUP: Record<string,{name:string; image:string; href:string}> = {
  "turian-plush": { name:"Turian Plush", image:"/Marketplace/Turianplushie.png", href:"/marketplace/turian-plush" },
  "navatar-tee":  { name:"Navatar Tee",  image:"/Marketplace/Turiantshirt.png",  href:"/marketplace/navatar-tee" },
  "stickers":     { name:"Sticker Pack", image:"/Marketplace/Stickerpack.png", href:"/marketplace/stickers" },
};

export default function WishlistPage() {
  const { saved, toggleSave } = useCart();
  const ids = Object.keys(saved).filter((k) => saved[k]);
  return (
    <main id="main" data-page="wishlist" className="nvrs-section wishlist page">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]}
      />
      <h1>Wishlist</h1>
      {ids.length === 0 ? (
        <p>No saved items yet.</p>
      ) : (
        <div className="nv-grid">
          {ids.map((id) => {
            const item = LOOKUP[id];
            if (!item) return null;
            return (
              <article
                key={id}
                className={`nv-card wl-card wishlist-card ${styles.card}`}
              >
                <Link
                  to={item.href}
                  className={`${styles.imageWrap} imageWrap`}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className={styles.img}
                  />
                </Link>
                <h3>
                  <Link to={item.href}>{item.name}</Link>
                </h3>
                <button className="remove" onClick={() => toggleSave(id)}>
                  Remove
                </button>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
