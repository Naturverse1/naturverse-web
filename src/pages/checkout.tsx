import React, { useEffect, useMemo, useState } from "react";
import { useCart, addToCart } from "@/lib/cart";
import { useStripe, PaymentRequestButtonElement } from "@stripe/react-stripe-js";
import { bundlesForCart } from "@/lib/bundles";
import type {
  PaymentRequest,
  PaymentRequestCanMakePaymentResult,
  PaymentRequestPaymentMethodEvent,
} from "@stripe/stripe-js";
import { startCheckout } from "@/lib/checkout";

function GiftCardApply({ totalCents, onCoupon }: { totalCents: number; onCoupon: (couponId: string) => void }) {
  const [code, setCode] = React.useState("");
  const [status, setStatus] = React.useState<string>("");

  async function apply() {
    setStatus("Applying…");
    const res = await fetch("/.netlify/functions/redeem-gift-card", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code: code.trim().toUpperCase(), total_cents: totalCents })
    });
    if (!res.ok) { setStatus(await res.text()); return; }
    const { coupon_id, applied_cents } = await res.json();
    onCoupon(coupon_id);
    setStatus(`Applied $${(applied_cents/100).toFixed(2)}`);
  }

  return (
    <div style={{ marginTop: 12 }}>
      <input value={code} onChange={(e)=>setCode(e.target.value)} placeholder="Gift card code" />
      <button onClick={apply} disabled={!code}>Apply</button>
      <div className="muted" style={{ marginTop: 4 }}>{status}</div>
    </div>
  );
}

function Estimator({ items, subtotalCents }: { items: any[]; subtotalCents: number }) {
  const [country, setCountry] = React.useState("US");
  const [zip, setZip] = React.useState("");
  const [estimate, setEstimate] = React.useState<{
    tax: number;
    shipping: number;
    total: number;
  } | null>(null);

  const hasPhysical = React.useMemo(
    () => items.some((it) => /plushie|tshirt|sticker|journal/i.test(it.id || it.name)),
    [items]
  );

  function calc() {
    // super simple demo rules:
    const taxRate = country === "US" ? 0.07 : 0.0; // pretend 7% US, 0% elsewhere (placeholder)
    const shipping = hasPhysical ? (subtotalCents >= 5000 ? 0 : 600) : 0; // free >= $50, else $6
    const tax = Math.round(subtotalCents * taxRate);
    const total = subtotalCents + tax + shipping;
    setEstimate({ tax, shipping, total });
  }

  return (
    <div style={{ marginTop: 16, borderTop: "1px solid #e5e7eb", paddingTop: 12 }}>
      <h3>Estimate tax & shipping</h3>
      <div
        style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}
      >
        <label>Country</label>
        <select value={country} onChange={(e) => setCountry(e.target.value)}>
          <option>US</option>
          <option>CA</option>
          <option>GB</option>
          <option>AU</option>
          <option>TH</option>
        </select>
        <label>ZIP/Postal</label>
        <input value={zip} onChange={(e) => setZip(e.target.value)} placeholder="e.g. 94110" />
        <button onClick={calc}>Estimate</button>
      </div>
      {estimate && (
        <div style={{ marginTop: 8 }}>
          <div>Tax: ${(estimate.tax / 100).toFixed(2)}</div>
          <div>Shipping: ${(estimate.shipping / 100).toFixed(2)}</div>
          <strong>Total: ${(estimate.total / 100).toFixed(2)}</strong>
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
            * Estimates only. Final amounts shown at payment.
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  const { items, setQty, removeFromCart, totalCents } = useCart();
  const stripe = useStripe();
  const [pr, setPr] = useState<PaymentRequest | null>(null);
  const [couponId, setCouponId] = useState<string | null>(null);
  const cartIds = items.map((i) => i.id);
  const suggestions = bundlesForCart(cartIds);

  const amount = useMemo(() => totalCents, [totalCents]);
  const currency = "usd";

  useEffect(() => {
    if (!stripe) return;
    const paymentRequest = stripe.paymentRequest({
      country: "US",
      currency,
      total: { label: "Naturverse", amount },
      requestPayerName: true,
      requestPayerEmail: true,
    });
      paymentRequest.canMakePayment().then((res: PaymentRequestCanMakePaymentResult | null) => {
      if (res) setPr(paymentRequest);
      else setPr(null);
    });
  }, [stripe, amount]);

  useEffect(() => {
    if (!pr) return;
      pr.on("paymentmethod", async (ev: PaymentRequestPaymentMethodEvent) => {
      try {
        const res = await fetch("/.netlify/functions/create-checkout-session", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            items: items.map((i) => ({ id: i.id, qty: i.qty })),
            customer_email: ev.payerEmail,
            allow_promotion_codes: true,
            returnPath: "/checkout",
            coupon_id: couponId || undefined,
          }),
        });
        if (!res.ok) throw new Error(await res.text());
        const { id } = await res.json();
        await stripe?.redirectToCheckout({ sessionId: id });
        ev.complete("success");
      } catch (e) {
        ev.complete("fail");
      }
    });
  }, [pr, stripe, items, couponId]);

  return (
    <main className="container" style={{ maxWidth: 760, margin: "40px auto" }}>
      <h1>Checkout</h1>

      {pr && (
        <div style={{ margin: "12px 0" }}>
          <PaymentRequestButtonElement options={{ paymentRequest: pr }} />
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
            Express checkout via Apple Pay / Google Pay when supported.
          </div>
        </div>
      )}

      <ul>
      {items.map((i) => (
        <li key={i.id}>
          <strong>{i.name}</strong> ${(i.price / 100).toFixed(2)} x {i.qty}
          <button onClick={() => setQty(i.id, i.qty - 1)}>-</button>
          <button onClick={() => setQty(i.id, i.qty + 1)}>+</button>
          <button onClick={() => removeFromCart(i.id)}>Remove</button>
        </li>
      ))}
    </ul>
      {suggestions.length > 0 && (
        <section style={{ marginTop: 16, borderTop: "1px solid #e5e7eb", paddingTop: 12 }}>
          <h3>Bundle &amp; Save</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {suggestions.map((b) => (
              <div key={b.id} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <strong>{b.title}</strong>
                  {b.blurb && <div className="muted">{b.blurb}</div>}
                </div>
                <button
                  onClick={() => {
                    b.skus.forEach((sku) =>
                      addToCart({ id: sku, name: sku, price: 0, type: "physical" } as any, 1)
                    );
                    window.dispatchEvent(
                      new CustomEvent("nv:toast", { detail: { text: "Bundle added" } })
                    );
                  }}
                >
                  Add bundle
                </button>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
            Bundle items added at regular price; your discount is applied at payment.
          </div>
        </section>
      )}
      <div>Subtotal ${(totalCents / 100).toFixed(2)}</div>
      <GiftCardApply totalCents={totalCents} onCoupon={(id)=>setCouponId(id)} />
      <Estimator items={items} subtotalCents={totalCents} />
      <button onClick={() => startCheckout({ items, returnPath: "/checkout", couponId: couponId || undefined })}>
        Pay with card
      </button>
    </main>
  );
}
