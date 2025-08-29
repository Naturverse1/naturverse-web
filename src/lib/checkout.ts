import { stripePromise } from "./stripe";
import type { CartItem } from "./cart";
import { supabase } from "./supabase";

export async function startCheckout(params: {
  items: CartItem[];
  email?: string;
  metadata?: Record<string, string>;
  allowPromotionCodes?: boolean;
  returnPath?: string; // e.g. '/marketplace'
}) {
  const items = params.items.map((it) => ({ id: it.id, qty: it.qty }));

  const { data: session } = await supabase!.auth.getSession();
  const token = session.session?.access_token || "";

  const res = await fetch("/.netlify/functions/create-checkout-session", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-supabase-token": token,
    },
    body: JSON.stringify({
      items,
      allow_promotion_codes: params.allowPromotionCodes ?? true,
      metadata: params.metadata,
      returnPath: params.returnPath || "/",
      customer_email: params.email,
    }),
  });

  if (!res.ok) throw new Error(await res.text());
  const { id } = await res.json();
  const stripe = await stripePromise;
  await stripe?.redirectToCheckout({ sessionId: id });
}

