import Breadcrumbs from "../../components/Breadcrumbs";
import AddToCartButton from "../../components/AddToCartButton";
import SaveButton from "../../components/SaveButton";
import { Link } from "react-router-dom";
import "./../../styles/marketplace.css";

const PRODUCTS = [
  { id:"turian-plush", name:"Turian Plush", price:24, image:"/Marketplace/Turianplushie.png", href:"/marketplace/turian-plush" },
  { id:"navatar-tee",  name:"Navatar Tee",  price:18, image:"/Marketplace/Turiantshirt.png",  href:"/marketplace/navatar-tee" },
  { id:"stickers",     name:"Sticker Pack", price:6,  image:"/Marketplace/Stickerpack.png", href:"/marketplace/stickers" },
];

export default function MarketplacePage(){
  return (
    <div className="nvrs-section marketplace">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Marketplace" }]} />
      <h1>Marketplace</h1>
      <div className="nv-grid">
        {PRODUCTS.map(p => (
          <article key={p.id} className="nv-card">
            <Link to={p.href} className="mp-thumb" aria-label={p.name}>
              <img className="mp-img" src={p.image} alt={p.name} loading="lazy" />
            </Link>
            <h3><Link to={p.href}>{p.name}</Link></h3>
            <div>${p.price.toFixed(2)}</div>
            <div className="nv-cta">
              <AddToCartButton id={p.id} name={p.name} price={p.price} image={p.image}/>
              <SaveButton id={p.id}/>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
