import { Product } from "../../lib/commerce/types";
import { useCart } from "../../context/CartContext";

export default function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  return (
    <button className="btn" onClick={() => add(product)}>
      Add to cart
    </button>
  );
}
