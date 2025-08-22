import React from "react";
import { useCart } from "../../hooks/useCart";

export default function AddToCartButton({ id, name, price, image, variant, qty = 1 }:{
  id: string; name: string; price: number; image?: string; variant?: string; qty?: number;
}) {
  const cart = useCart();
  return (
    <button className="btn add-to-cart" onClick={() => cart.add({ id, name, price, image, variant }, qty)}>
      Add to cart
    </button>
  );
}
