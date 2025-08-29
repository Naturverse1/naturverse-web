import type { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const RESEND = process.env.RESEND_API_KEY;
const FROM = process.env.RESEND_FROM || "Naturverse <no-reply@naturverse.com>";

export const handler: Handler = async (event) => {
  const sku = event.queryStringParameters?.sku;
  if (!sku) return { statusCode: 400, body: "Missing sku" };

  // Fetch subscribers not yet notified
  const { data: subs, error } = await supabase
    .from("back_in_stock")
    .select("*")
    .eq("sku", sku)
    .eq("notified", false);

  if (error) return { statusCode: 500, body: error.message };
  if (!subs?.length) return { statusCode: 200, body: "No subscribers" };

  if (RESEND) {
    await Promise.all(
      subs.map((s: any) =>
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${RESEND}`, "content-type": "application/json" },
          body: JSON.stringify({
            from: FROM,
            to: s.email,
            subject: "Back in stock ✨",
            html: `<p>${sku} is back in stock at <a href="${process.env.PUBLIC_SITE_URL || process.env.URL}/marketplace/${sku}">Naturverse</a>. Grab it while it lasts!</p>`
          })
        })
      )
    );
  }

  // Mark notified
  const ids = subs.map((s: any) => s.id);
  await supabase.from("back_in_stock").update({ notified: true }).in("id", ids);

  return { statusCode: 200, body: `Notified ${subs.length}` };
};
