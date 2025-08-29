import { stripePromise } from "./stripe";
import type { CartItem } from "./cart";

export async function startCheckout(params: {
  items: CartItem[];
  email?: string;
  metadata?: Record<string, string>;
  allowPromotionCodes?: boolean;
}) {
  // Map CartItem -> function payload shape
  const items = params.items.map((it) =>
    it.type === "price"
      ? { price: it.price, quantity: it.qty, metadata: it.meta }
      : { price_data: it.price_data, quantity: it.qty, metadata: it.meta }
  );

  const res = await fetch("/.netlify/functions/create-checkout-session", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      items,
      customer_email: params.email,
      allow_promotion_codes: params.allowPromotionCodes ?? true,
      metadata: params.metadata,
      mode: "payment",
    }),
  });

  if (!res.ok) throw new Error(await res.text());
  const { id } = await res.json();
  const stripe = await stripePromise;
  await stripe?.redirectToCheckout({ sessionId: id });
}
