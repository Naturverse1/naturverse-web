import { useParams } from "react-router-dom";
import AddToCartButton from "../../components/AddToCartButton";
import SaveButton from "../../components/SaveButton";
import Breadcrumbs from "../../components/Breadcrumbs";
import "./../../styles/marketplace.css";

const MAP:any = {
  "turian-plush": { id:"turian-plush", name:"Turian Plush", price:24, image:"/Marketplace/Turianplushie.png", blurb:"Cuddly plush of Turian." },
  "navatar-tee":  { id:"navatar-tee",  name:"Navatar Tee",  price:18, image:"/Marketplace/Turiantshirt.png",  blurb:"Soft tee with Navatar." },
  "stickers":     { id:"stickers",     name:"Sticker Pack", price:6,  image:"/Marketplace/Stickerpack.png", blurb:"Six vinyl stickers." },
};

export default function ProductPage(){
  const { slug="" } = useParams();
  const p = MAP[slug];
  if (!p) return null;
  return (
    <div className="nvrs-section marketplace">
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
          <SaveButton id={p.id}/>
        </div>
      </article>
    </div>
  );
}
