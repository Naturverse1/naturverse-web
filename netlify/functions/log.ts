import type { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const ADMIN = process.env.ADMIN_API_TOKEN;

export const handler: Handler = async (event) => {
  if (event.httpMethod === "POST") {
    const { level='info', message='', meta=null } = JSON.parse(event.body || "{}");
    if (!message) return { statusCode: 400, body: "Missing message" };
    const { error } = await supabase.from("app_logs").insert({ level, message, meta });
    if (error) return { statusCode: 500, body: error.message };
    return { statusCode: 200, body: "ok" };
  }
  if (event.httpMethod === "GET") {
    if (event.headers.authorization !== `Bearer ${ADMIN}`) return { statusCode: 401, body: "Unauthorized" };
    const limit = Math.min(parseInt(event.queryStringParameters?.limit || "200", 10), 1000);
    const { data, error } = await supabase.from("app_logs").select("*").order("created_at",{ascending:false}).limit(limit);
    if (error) return { statusCode: 500, body: error.message };
    return { statusCode: 200, body: JSON.stringify(data) };
  }
  return { statusCode: 405, body: "Method Not Allowed" };
};
