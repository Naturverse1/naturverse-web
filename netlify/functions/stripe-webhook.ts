import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export async function handler(event: any) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const sig = event.headers["stripe-signature"];
  let stripeEvent: Stripe.Event;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig as string,
      webhookSecret
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  if (stripeEvent.type === "checkout.session.completed") {
    const session = stripeEvent.data.object as Stripe.Checkout.Session;

    try {
      const userEmail = (
        session.customer_details?.email || session.customer_email || ""
      ).toLowerCase();

      const lineItems = (await stripe.checkout.sessions.listLineItems(session.id)).data;

      for (const li of lineItems) {
        const productName =
          typeof li.description === "string" && li.description.length
            ? li.description
            : (li.price?.nickname || li.price?.product?.toString() || "unknown");

        await supabase
          .from("purchases")
          .upsert(
            {
              user_email: userEmail,
              session_id: session.id,
              price_id: li.price?.id,
              product_name: productName,
              quantity: li.quantity || 1,
              amount_total: session.amount_total ?? null,
              currency: session.currency?.toUpperCase(),
              status: "paid",
              metadata: session.metadata || {},
            },
            { onConflict: "session_id" }
          );
      }
    } catch (e) {
      console.error("Supabase upsert failed", e);
    }
  }

  return { statusCode: 200, body: "ok" };
}
