import { stripePromise } from "@/lib/stripe";

export type CartItem =
  | { price: string; quantity?: number; metadata?: Record<string, string> }
  | {
      price_data: {
        currency: string;
        unit_amount: number;
        product_data: { name: string; description?: string };
      };
      quantity?: number;
      metadata?: Record<string, string>;
    };

export async function checkout(
  items: CartItem[],
  opts?: {
    email?: string;
    metadata?: Record<string, string>;
    mode?: "payment" | "subscription";
  }
) {
  const res = await fetch("/.netlify/functions/create-checkout-session", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      items,
      customer_email: opts?.email,
      metadata: opts?.metadata,
      mode: opts?.mode ?? "payment",
    }),
  });

  if (!res.ok) throw new Error(await res.text());
  const { id } = await res.json();

  const stripe = await stripePromise;
  await stripe?.redirectToCheckout({ sessionId: id });
}
