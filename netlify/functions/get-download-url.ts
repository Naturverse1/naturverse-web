import type { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);
const DOWNLOADS_BUCKET = process.env.SUPABASE_DOWNLOADS_BUCKET || "downloads";

export const handler: Handler = async (event) => {
  try {
    const sku = (event.queryStringParameters?.sku || "").toString();
    const orderId = (event.queryStringParameters?.order || "").toString();
    const token = (event.headers["x-supabase-token"] || event.headers["X-Supabase-Token"]) as
      | string
      | undefined;
    if (!sku || !orderId || !token) return { statusCode: 400, body: "Missing sku/order/token" };

    // Who is calling?
    const { data } = await supabase.auth.getUser(token);
    const userId = data.user?.id;
    if (!userId) return { statusCode: 401, body: "Unauthorized" };

    // Does this order belong to them and contain the sku?
    const { data: orders } = await supabase.from("orders").select("*").eq("id", orderId).limit(1);
    const order = orders?.[0];
    if (!order || order.user_id !== userId) return { statusCode: 403, body: "Forbidden" };

    const hasSku = (order.line_items || []).some((li: any) => li?.sku === sku);
    if (!hasSku) return { statusCode: 404, body: "Item not in order" };

    // Signed URL (1 min)
    const path = `${sku}.zip`;
    const { data: link, error } = await supabase.storage
      .from(DOWNLOADS_BUCKET)
      .createSignedUrl(path, 60);
    if (error) return { statusCode: 404, body: "Download not found" };

    return { statusCode: 200, body: JSON.stringify({ url: link.signedUrl }) };
  } catch (e: any) {
    return { statusCode: 500, body: e.message || "Server error" };
  }
};

