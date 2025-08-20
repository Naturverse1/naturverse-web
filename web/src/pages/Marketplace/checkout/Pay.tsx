import { useLocation, useNavigate } from "react-router-dom";
import { readCart, clearCart, cartTotal } from "../../../lib/cart";
import { getDeviceId } from "../../../lib/device";

export default function Pay() {
  const nav = useNavigate();
  const { state } = useLocation() as any;
  const addr = state?.addr;
  const cart = readCart();
  const total = cartTotal(cart);
  const dev = getDeviceId();

  async function place() {
    const r = await fetch("/.netlify/functions/orders", {
      method: "POST", headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ device_id: dev, items: cart, address: addr, total_tokens: total })
    });
    if (!r.ok) { alert(await r.text()); return; }
    const { order_id } = await r.json();
    clearCart();
    nav("/marketplace/OrderSuccess?order="+encodeURIComponent(order_id));
  }

  return (<section><h1>Checkout — Pay</h1><p>Total: <strong>{total} NATUR</strong></p><button onClick={place}>Confirm & Deduct Tokens</button></section>);
}
