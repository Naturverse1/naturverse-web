import type { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const ADMIN_TOKEN = process.env.ADMIN_API_TOKEN;

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
  if (event.headers.authorization !== `Bearer ${ADMIN_TOKEN}`) return { statusCode: 401, body: "Unauthorized" };

  const { order_id, status, note } = JSON.parse(event.body || "{}");
  if (!order_id || !["packed","shipped","delivered"].includes(status)) return { statusCode: 400, body: "Bad input" };

  const { error } = await supabase.from("order_events").insert({ order_id, status, note: note || null });
  if (error) return { statusCode: 500, body: error.message };
  return { statusCode: 200, body: "ok" };
};
