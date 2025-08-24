import AddToCartButton from "./AddToCartButton";
import SaveButton from "./SaveButton";
import { Link } from "react-router-dom";

export default function ProductCard({ p }:{ p:{id:string; name:string; price:number; image:string; href:string} }) {
  return (
    <article className="nv-card">
      <Link to={p.href} className="nv-imgbox" aria-label={p.name}>
        <img src={p.image} alt="" loading="lazy" />
      </Link>
      <h3><Link to={p.href}>{p.name}</Link></h3>
      <div>${p.price.toFixed(2)}</div>
      <div className="nv-cta">
        <AddToCartButton id={p.id} name={p.name} price={p.price} image={p.image}/>
        <SaveButton id={p.id}/>
      </div>
    </article>
  );
}
