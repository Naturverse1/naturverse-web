import type { Handler } from "@netlify/functions";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { BUNDLES } from "../../src/lib/bundles";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: "2024-06-20" });
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

const SITE = process.env.PUBLIC_SITE_URL || process.env.URL || "http://localhost:8888";

// Catalog (server truth)
const PRODUCTS: Record<string, { name: string; price: number; physical: boolean }> = {
  "navatar-style-kit": { name: "Navatar Style Kit", price: 999, physical: false },
  "breathwork-starter": { name: "Breathwork Starter Pack", price: 900, physical: false },
  "naturverse-plushie": { name: "Naturverse Plushie", price: 2800, physical: true },
  "naturverse-tshirt": { name: "Naturverse T-Shirt", price: 2400, physical: true },
  "sticker-pack": { name: "Sticker Pack", price: 1200, physical: true },
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
  const body = JSON.parse(event.body || "{}") as {
    items: { id: string; qty: number }[];
    allow_promotion_codes?: boolean;
    metadata?: Record<string, string>;
    returnPath?: string;
    customer_email?: string;
  };

  // Resolve user from Supabase token (optional)
  const token = (event.headers["x-supabase-token"] || event.headers["X-Supabase-Token"]) as
    | string
    | undefined;
  let userId: string | null = null;
  let userEmail: string | undefined = body.customer_email;
  if (token) {
    const { data } = await supabaseAdmin.auth.getUser(token);
    userId = data.user?.id ?? null;
    userEmail = userEmail || data.user?.email || undefined;
  }

  // Build line items
  const line_items = (body.items || [])
    .map(({ id, qty }) => {
      const p = PRODUCTS[id];
      if (!p) return null;
      return {
        quantity: Math.max(1, qty || 1),
        price_data: {
          currency: "usd",
          unit_amount: p.price,
          product_data: {
            name: p.name,
            metadata: { sku: id, kind: p.physical ? "physical" : "digital" },
          },
        },
      } as Stripe.Checkout.SessionCreateParams.LineItem;
    })
    .filter(Boolean) as Stripe.Checkout.SessionCreateParams.LineItem[];

  if (!line_items.length) return { statusCode: 400, body: "No valid items" };

  const hasPhysical = (body.items || []).some((i) => PRODUCTS[i.id]?.physical);

  // Bundle detection
  const ids = (body.items || []).flatMap((i: any) =>
    Array(i.qty || 1).fill(i.id)
  );
  const applicable = BUNDLES.find((b) => b.skus.every((s) => ids.includes(s)));
  let discounts: { coupon: string }[] | undefined = undefined;
  if (applicable) {
    const couponId = process.env[applicable.couponEnv] as string | undefined;
    if (couponId) discounts = [{ coupon: couponId }];
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items,
    allow_promotion_codes: body.allow_promotion_codes ?? true,
    discounts,
    shipping_address_collection: hasPhysical ? { allowed_countries: ["US", "CA", "GB", "AU"] } : undefined,
    customer_email: userEmail,
    success_url: `${SITE}${body.returnPath || "/"}?checkout=success`,
    cancel_url: `${SITE}${body.returnPath || "/"}?checkout=cancel`,
    metadata: { ...(body.metadata || {}), user_id: userId || "" },
    expand: ["line_items.data.price.product"],
  });

  return { statusCode: 200, body: JSON.stringify({ id: session.id }) };
};

