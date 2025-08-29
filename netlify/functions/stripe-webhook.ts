import type { Handler } from "@netlify/functions";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: "2024-06-20" });
const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

const SITE = process.env.PUBLIC_SITE_URL || process.env.URL || "http://localhost:8888";
const DOWNLOADS_BUCKET = process.env.SUPABASE_DOWNLOADS_BUCKET || "downloads";
const RESEND_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM || "Naturverse <no-reply@naturverse.com>";

// Fallback name->sku (in case metadata missing)
const NAME_TO_SKU: Record<string, string> = {
  "Navatar Style Kit": "navatar-style-kit",
  "Breathwork Starter Pack": "breathwork-starter",
};

const DIGITAL = new Set(["navatar-style-kit", "breathwork-starter"]);

export const handler: Handler = async (event) => {
  try {
    const sig = event.headers["stripe-signature"] as string;
    const payload = event.body as string;
    const secret = process.env.STRIPE_WEBHOOK_SECRET as string;

    const evt = stripe.webhooks.constructEvent(payload, sig, secret);

    if (evt.type === "checkout.session.completed") {
      const session = evt.data.object as Stripe.Checkout.Session;

      // Expand items (need product metadata)
      const items = await stripe.checkout.sessions.listLineItems(session.id, {
        expand: ["data.price.product"],
        limit: 100,
      });

      const line_items = items.data.map((li) => ({
        quantity: li.quantity,
        amount_total: li.amount_total,
        description: li.description,
        price_id: li.price?.id,
        product_name: (li.price?.product as any)?.name,
        sku:
          ((li.price?.product as any)?.metadata?.sku as string) ||
          NAME_TO_SKU[(li.price?.product as any)?.name as string] ||
          null,
      }));

      const user_id = session.metadata?.user_id || null;

      // Upsert order row
      const record = {
        stripe_session_id: session.id,
        user_id,
        email: session.customer_details?.email ?? null,
        amount_total: session.amount_total ?? 0,
        currency: session.currency ?? "usd",
        status: session.payment_status,
        line_items,
      };
      const { error } = await supabase.from("orders").upsert(record, { onConflict: "stripe_session_id" });
      if (error) console.error("orders upsert error", error);

      // Prepare short-lived signed URLs for DIGITAL goods (48h) — optional
      const downloadLinks: { sku: string; url: string }[] = [];
      for (const li of line_items) {
        const sku = li.sku;
        if (!sku || !DIGITAL.has(sku)) continue;
        const path = `${sku}.zip`;
        const { data, error: signErr } = await supabase.storage
          .from(DOWNLOADS_BUCKET)
          .createSignedUrl(path, 60 * 60 * 24 * 2);
        if (!signErr && data?.signedUrl) {
          downloadLinks.push({ sku, url: data.signedUrl });
        }
      }

      // Send receipt email (optional)
      if (RESEND_KEY && session.customer_details?.email) {
        const to = session.customer_details.email;
        const html = `
          <div style="font-family:system-ui,Segoe UI,Arial">
            <h2>Thanks for your purchase 🌀</h2>
            <p>Total: <strong>${(record.amount_total / 100).toFixed(2)} ${record.currency?.toUpperCase()}</strong></p>
            <p>You can always view your order at <a href="${SITE}/orders">${SITE}/orders</a>.</p>
            ${
              downloadLinks.length
                ? `<h3>Downloads</h3><ul>${downloadLinks
                    .map((d) => `<li>${d.sku}: <a href="${d.url}">Download</a></li>`)
                    .join("")}</ul>`
                : ""
            }
          </div>`;

        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${RESEND_KEY}`, "content-type": "application/json" },
          body: JSON.stringify({ from: RESEND_FROM, to, subject: "Your Naturverse order", html }),
        }).catch((e) => console.error("Resend email error", e));
      }
    }

    return { statusCode: 200, body: "ok" };
  } catch (e: any) {
    console.error("Webhook error", e);
    return { statusCode: 400, body: `Webhook Error: ${e.message}` };
  }
};

