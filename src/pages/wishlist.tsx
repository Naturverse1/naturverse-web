import { useCart } from "../lib/cart";
import { Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";

const LOOKUP: Record<string,{name:string; image:string; href:string}> = {
  "turian-plush": { name:"Turian Plush", image:"/public/Marketplace/Turianplushie.png", href:"/marketplace/turian-plush" },
  "navatar-tee":  { name:"Navatar Tee",  image:"/public/Marketplace/Turiantshirt.png",  href:"/marketplace/navatar-tee" },
  "stickers":     { name:"Sticker Pack", image:"/public/Marketplace/Stickerpack.png", href:"/marketplace/stickers" },
};

export default function WishlistPage(){
  const { saved, toggleSave } = useCart();
  const ids = Object.keys(saved).filter(k=>saved[k]);
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
      <h1>Wishlist</h1>
      {ids.length===0? <p>No saved items yet.</p> :
        <div className="nv-grid">
          {ids.map(id=>{
            const p = LOOKUP[id]; if (!p) return null;
            return (
              <article key={id} className="nv-card">
                <Link to={p.href} className="nv-imgbox"><img src={p.image} alt="" /></Link>
                <h3><Link to={p.href}>{p.name}</Link></h3>
                <button className="btn-danger" onClick={()=>toggleSave(id)}>Remove</button>
              </article>
            );
          })}
        </div>}
    </>
  );
}
