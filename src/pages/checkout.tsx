import React, { useEffect, useMemo, useState } from "react";
import { useCart } from "@/lib/cart";
import { useStripe, PaymentRequestButtonElement } from "@stripe/react-stripe-js";
import type {
  PaymentRequest,
  PaymentRequestCanMakePaymentResult,
  PaymentRequestPaymentMethodEvent,
} from "@stripe/stripe-js";
import { startCheckout } from "@/lib/checkout";

export default function CheckoutPage() {
  const { items, setQty, removeFromCart, totalCents } = useCart();
  const stripe = useStripe();
  const [pr, setPr] = useState<PaymentRequest | null>(null);

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
  }, [pr, stripe, items]);

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
      <div>Subtotal ${(totalCents / 100).toFixed(2)}</div>
      <button onClick={() => startCheckout({ items, returnPath: "/checkout" })}>
        Pay with card
      </button>
    </main>
  );
}
