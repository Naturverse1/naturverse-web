import { Link } from "react-router-dom";
import Price from "./Price";
import WishlistButton from "./WishlistButton";
import { Product } from "../../lib/commerce/types";

export default function ProductCard({ p }: { p: Product }) {
  return (
    <article className="card">
      <Link to={`/marketplace/${p.slug}`} className="img-wrap">
        <img src={p.image} alt={p.name} loading="lazy" />
      </Link>
      <div className="meta">
        <h3>
          <Link to={`/marketplace/${p.slug}`}>{p.name}</Link>
        </h3>
        <Price amount={p.price} />
        <WishlistButton slug={p.slug} />
      </div>
    </article>
  );
}
