import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { PRODUCTS } from "@/data/products";
import { addToCart } from "@/lib/cart";
import { pushRecent } from "@/lib/recent";
import RecentCarousel from "@/components/RecentCarousel";

export default function ProductPage() {
  const { sku = "" } = useParams<{ sku: string }>();
  const product = PRODUCTS.find((p) => p.id === sku);

  useEffect(() => {
    if (sku) pushRecent(sku);
  }, [sku]);

  if (!product)
    return (
      <main className="container" style={{ padding: 24 }}>
        <p>Product not found</p>
      </main>
    );

  return (
    <main className="container" style={{ padding: 24 }}>
      <h2>{product.name}</h2>
      <p>${(product.price / 100).toFixed(2)}</p>
      <button onClick={() => addToCart(product)}>Add to cart</button>
      <RecentCarousel />
    </main>
  );
}
