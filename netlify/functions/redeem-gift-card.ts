import type { Handler } from "@netlify/functions";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: "2024-06-20" });
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export const handler: Handler = async (event) => {
  const { code, total_cents } = JSON.parse(event.body || "{}");
  if (!code || typeof total_cents !== "number") return { statusCode: 400, body: "Missing" };

  const { data: gc } = await supabase.from("gift_cards").select("*").eq("code", code).maybeSingle();
  if (!gc || gc.balance_cents <= 0) return { statusCode: 404, body: "Invalid or empty gift card" };

  const discount = Math.min(gc.balance_cents, total_cents);
  if (discount <= 0) return { statusCode: 400, body: "Nothing to apply" };

  const coupon = await stripe.coupons.create({ amount_off: discount, currency: "usd", duration: "once" });

  await supabase.from("gift_cards").update({ balance_cents: gc.balance_cents - discount }).eq("id", gc.id);

  return { statusCode: 200, body: JSON.stringify({ coupon_id: coupon.id, applied_cents: discount }) };
};
