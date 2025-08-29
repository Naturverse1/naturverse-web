import React, { useState } from "react";
import { useCart } from "@/lib/cart";
import { startCheckout } from "@/lib/checkout";

export default function CheckoutPage() {
  const { items, setQty, remove, total, clear } = useCart();
  const [email, setEmail] = useState("");
  const [promo, setPromo] = useState("");
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

          <div style={{ marginTop: 12 }}>
            <label>Promo code (optional): </label>{" "}
            <input value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="e.g. LAUNCH10" />
            <small style={{ marginLeft: 8, opacity: 0.7 }}>applies on Stripe</small>
          </div>

          <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
            <button onClick={clear} disabled={busy}>Clear</button>
            <button
              onClick={async () => {
                try {
                  setBusy(true);
                  await startCheckout({
                    items,
                    email: email || undefined,
                    metadata: { source: "naturverse", entered_code: promo || "" },
                    allowPromotionCodes: true,
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
