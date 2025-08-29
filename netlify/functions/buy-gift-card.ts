import type { Handler } from "@netlify/functions";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: "2024-06-20" });

const AMOUNTS = [1000, 2500, 5000]; // $10, $25, $50

export const handler: Handler = async (event) => {
  const { amount_cents = 2500, email } = JSON.parse(event.body || "{}");
  if (!AMOUNTS.includes(amount_cents)) return { statusCode: 400, body: "Invalid amount" };
  const site = process.env.PUBLIC_SITE_URL || process.env.URL;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price_data: { currency: "usd", product_data: { name: `Gift Card $${(amount_cents/100).toFixed(0)}` }, unit_amount: amount_cents }, quantity: 1 }],
    success_url: `${site}/?gift=success`,
    cancel_url: `${site}/?gift=cancel`,
    metadata: { kind: "gift_card", amount_cents: String(amount_cents), purchaser_email: email || "" }
  });
  return { statusCode: 200, body: JSON.stringify({ id: session.id, url: session.url }) };
};
