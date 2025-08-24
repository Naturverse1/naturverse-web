import Breadcrumbs from "../../components/Breadcrumbs";
import ProductCard from "../../components/ProductCard";
import "./../../styles/marketplace.css";

const PRODUCTS = [
  { id:"turian-plush", name:"Turian Plush", price:24, image:"/public/Marketplace/Turianplushie.png", href:"/marketplace/turian-plush" },
  { id:"navatar-tee",  name:"Navatar Tee",  price:18, image:"/public/Marketplace/Turiantshirt.png",  href:"/marketplace/navatar-tee" },
  { id:"stickers",     name:"Sticker Pack", price:6,  image:"/public/Marketplace/Stickerpack.png", href:"/marketplace/stickers" },
];

export default function MarketplacePage(){
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Marketplace" }]} />
      <h1>Marketplace</h1>
      <div className="nv-grid">
        {PRODUCTS.map(p => <ProductCard key={p.id} p={p}/>)}
      </div>
    </>
  );
}
