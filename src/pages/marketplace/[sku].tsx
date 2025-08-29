import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { PRODUCTS } from "@/data/products";
import { addToCart } from "@/lib/cart";
import { pushRecent } from "@/lib/recent";
import RecentCarousel from "@/components/RecentCarousel";
import BackInStockForm from "@/components/BackInStockForm";
import { getStock, isDigital } from "@/data/inventory";

export default function ProductPage() {
  const { sku = "" } = useParams<{ sku: string }>();
  const product = PRODUCTS.find((p) => p.id === sku);
  const s = getStock(product?.id || "");
  const qty = s?.qty ?? 0;
  const soldOut = product ? !isDigital(product.id) && qty <= 0 : false;

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
      <button
        onClick={() => addToCart(product)}
        disabled={soldOut}
        aria-disabled={soldOut}
      >
        {soldOut ? "Sold out" : "Add to cart"}
      </button>
      {soldOut && <BackInStockForm sku={product.id} />}
      <RecentCarousel />
    </main>
  );
}
