import { useLocation, Link } from "react-router-dom";
import { readCart, cartTotal } from "../../../lib/cart";

export default function Review() {
  const { state } = useLocation() as any;
  const addr = state?.addr;
  const cart = readCart();
  return (
    <section>
      <h1>Checkout — Review</h1>
      <pre>{JSON.stringify(addr,null,2)}</pre>
      <ul>{cart.map(c=> <li key={c.product_id}>{c.title} × {c.qty} — {c.price_tokens*c.qty} NATUR</li>)}</ul>
      <p><strong>Total: {cartTotal(cart)} NATUR</strong></p>
      <Link to="/marketplace/checkout/Pay" state={{ addr }}>Pay with NATUR</Link>
    </section>
  );
}

