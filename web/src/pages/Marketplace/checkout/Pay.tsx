import { useLocation, useNavigate } from "react-router-dom";
import { readCart, clearCart, cartTotal } from "../../../lib/cart";
import { getDeviceId } from "../../../lib/device";

export default function Pay() {
  const { state } = useLocation() as any;
  const addr = state?.addr;
  const nav = useNavigate();
  const cart = readCart();
  const total = cartTotal(cart);
  const dev = getDeviceId();

  async function placeOrder() {
    const res = await fetch("/.netlify/functions/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ device_id: dev, address: addr, items: cart, total_tokens: total })
    });
    if (!res.ok) { alert(await res.text()); return; }
    const { order_id } = await res.json();
    clearCart();
    nav("/marketplace/OrderSuccess?order="+encodeURIComponent(order_id));
  }

  return (
    <section>
      <h1>Checkout — Pay</h1>
      <p>Total: <strong>{total} NATUR</strong></p>
      <button onClick={placeOrder}>Confirm & Deduct Tokens</button>
    </section>
  );
}

