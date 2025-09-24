import { useCart, cart } from "../lib/cart";
import { logEvent } from "@/lib/activity";
import { track } from "@/lib/analytics";
export default function AddToCartButton({ id, name, price, image }:{
  id:string; name:string; price:number; image:string;
}) {
  const { items, inc, dec, remove } = useCart();
  const line = items.find(i => i.id===id);
  if (!line) {
    return (
      <button
        className="btn-primary w-full"
        onClick={() => {
          cart.add(id, 1, { name, price, image });
          void logEvent("marketplace.add_to_cart", { id, price, name });
          track("cart_add", { slug: id, name, price });
        }}
      >
        Add to cart
      </button>
    );
  }
  return (
    <div className="nv-stepper">
      <button className="btn-ghost" onClick={()=>dec(id)} aria-label="Decrease">−</button>
      <span aria-live="polite">{line.qty}</span>
      <button className="btn-ghost" onClick={()=>inc(id)} aria-label="Increase">+</button>
      <button className="btn-danger ml-auto" onClick={()=>remove(id)}>Remove</button>
    </div>
  );
}
