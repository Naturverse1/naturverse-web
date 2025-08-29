import React, { useState } from "react";
import { useCart, cartSubtotal } from "@/lib/cart";
import { startCheckout } from "@/lib/checkout";

function PromoBox() {
  const { cart, setCoupon } = useCart();
  const [code, setCode] = React.useState(cart.coupon ?? "");
  return (
    <div style={{ marginTop: 12 }}>
      <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Promo code" />
      <button onClick={() => setCoupon(code || null)}>Apply</button>
    </div>
  );
}

export default function CheckoutPage() {
  const { cart, setQty, remove, clear } = useCart();
  const items = cart.items;
  const total = cartSubtotal(items);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const empty = items.length === 0;

  return (
    <main className="container" style={{ maxWidth: 760, margin: "40px auto" }}>
      <h1>Checkout</h1>
      {empty ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr><th align="left">Item</th><th>Qty</th><th align="right">Price</th><th/></tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id}>
                  <td style={{ padding: "8px 0" }}>
                    {it.type === "adhoc" ? it.price_data.product_data.name : (it as any).name || "Product"}
                  </td>
                  <td align="center">
                    <input
                      type="number" min={1} value={it.qty}
                      onChange={(e) => setQty(it.id, Math.max(1, Number(e.target.value)))}
                      style={{ width: 64 }}
                    />
                  </td>
                  <td align="right">
                    {it.type === "adhoc"
                      ? `$${((it.price_data.unit_amount * it.qty) / 100).toFixed(2)}`
                      : "—"}
                  </td>
                  <td align="right">
                    <button onClick={() => remove(it.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td/>
                <td align="right"><strong>Total</strong></td>
                <td align="right"><strong>${(total / 100).toFixed(2)}</strong></td>
                <td/>
              </tr>
            </tfoot>
          </table>

          <div style={{ marginTop: 24 }}>
            <label>Email (for receipt): </label>{" "}
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>

          <PromoBox />

          <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
            <button onClick={clear} disabled={busy}>Clear</button>
            <button
              onClick={async () => {
                try {
                  setBusy(true);
                  await startCheckout({
                    items,
                    email: email || undefined,
                    metadata: { source: "naturverse", entered_code: cart.coupon || "" },
                    allowPromotionCodes: true,
                    coupon: cart.coupon || undefined,
                  });
                } finally {
                  setBusy(false);
                }
              }}
              disabled={busy}
            >
              {busy ? "Redirecting…" : "Pay with card"}
            </button>
          </div>
        </>
      )}
    </main>
  );
}
