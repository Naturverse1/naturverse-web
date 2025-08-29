import { useParams } from "react-router-dom";
import { PRODUCTS } from "../../data/products";
import BuyNavatar from "../../components/BuyNavatar";

export default function ProductPage() {
  const { slug = "" } = useParams();
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) return null;

  return (
    <main style={{ maxWidth: 600, margin: "24px auto", padding: "0 20px" }}>
      <h1>{product.name}</h1>
      <p>{product.summary}</p>
      <p>${product.price.toFixed(2)}</p>
      {product.slug === "navatar-style-kit" ? (
        <BuyNavatar />
      ) : (
        <p>Checkout coming soon</p>
      )}
    </main>
  );
}
