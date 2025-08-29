import type { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const ADMIN = process.env.ADMIN_API_TOKEN;

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
  if (event.headers.authorization !== `Bearer ${ADMIN}`) return { statusCode: 401, body: "Unauthorized" };
  const { items } = JSON.parse(event.body || "{}") as { items: { id:string; title:string; summary?:string; tags?:string[]; body?:string }[] };
  if (!Array.isArray(items)) return { statusCode: 400, body: "Bad payload" };
  const { error } = await supabase.from("quests_index").upsert(items, { onConflict: "id" });
  if (error) return { statusCode: 500, body: error.message };
  return { statusCode: 200, body: "ok" };
};
