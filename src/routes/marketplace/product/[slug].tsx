import { useParams } from "react-router-dom";
import Breadcrumbs from "../../../components/Breadcrumbs";
import AddToCart from "../../../components/commerce/AddToCart";
import Price from "../../../components/commerce/Price";
import WishlistButton from "../../../components/commerce/WishlistButton";
import LazyImage from "../../../components/LazyImage";
import { bySlug } from "../../../lib/commerce/products";

export default function ProductPage() {
  const { slug = "" } = useParams();
  const p = bySlug(slug);
  return (
    <section>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Marketplace", href: "/marketplace" },
          { label: p.name, href: `/marketplace/${p.slug}` },
        ]}
      />
      <h1>{p.name}</h1>
      <div className="card">
        <div className="img-wrap">
          <LazyImage src={p.image} alt={p.name} className="prod-thumb" width={320} height={320} />
        </div>
        <p>
          <Price amount={p.price} />
        </p>
        <p>{p.description}</p>
        <AddToCart product={p} /> <WishlistButton slug={p.slug} />
      </div>
    </section>
  );
}
