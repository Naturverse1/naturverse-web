import Breadcrumbs from "../../components/Breadcrumbs";
import AddToCartButton from "../../components/AddToCartButton";
import SaveButton from "../../components/SaveButton";
import { Link } from "react-router-dom";
import "../../styles/_cards.css";
import "../../styles/marketplace.css";

const PRODUCTS = [
  { id:"turian-plush", name:"Turian Plush", price:24, image:"/Marketplace/Turianplushie.png", href:"/marketplace/turian-plush" },
  { id:"navatar-tee",  name:"Navatar Tee",  price:18, image:"/Marketplace/Turiantshirt.png",  href:"/marketplace/navatar-tee" },
  { id:"stickers",     name:"Sticker Pack", price:6,  image:"/Marketplace/Stickerpack.png", href:"/marketplace/stickers" },
];

export default function MarketplacePage(){
  return (
    <main id="main" data-page="marketplace" className="nvrs-section marketplace nv-secondary-scope">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Marketplace" }]} />
      <h1 className="page-title">Marketplace</h1>
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
          </article>
        ))}
      </div>
    </main>
  );
}
