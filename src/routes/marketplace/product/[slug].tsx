import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../../../components/Breadcrumbs";
import AddToCart from "../../../components/commerce/AddToCart";
import Price from "../../../components/commerce/Price";
import WishlistButton from "../../../components/commerce/WishlistButton";
import { fetchProductBySlug } from "../../../lib/commerce/products";
import type { Product } from "../../../lib/commerce/types";

export default function ProductPage() {
  const { slug = "" } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = slug ? await fetchProductBySlug(slug) : null;
        if (!cancelled) {
          setProduct(data);
          setError(data ? null : "Product not found.");
        }
      } catch (err) {
        console.error("Failed to load product", err);
        if (!cancelled) {
          setProduct(null);
          setError("Unable to load this product.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <section>
        <p>Loading product…</p>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section>
        <p>{error ?? "Product not found."}</p>
      </section>
    );
  }

  return (
    <section>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Marketplace", href: "/marketplace" },
          { label: product.name, href: `/marketplace/${product.slug}` },
        ]}
      />
      <h1>{product.name}</h1>
      <div className="card">
        <div className="img-wrap">
          <img src={product.image} alt={product.name} />
        </div>
        <p>
          <Price amount={product.price} />
        </p>
        {product.description ? <p>{product.description}</p> : null}
        <AddToCart product={product} /> <WishlistButton productId={product.id} />
      </div>
    </section>
  );
}
