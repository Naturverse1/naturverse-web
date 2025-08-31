import type { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
  const { exp, variant, event: kind, meta } = JSON.parse(event.body || "{}");
  if (!exp || !variant || !["expose","convert"].includes(kind)) return { statusCode: 400, body: "Bad input" };

  const { error } = await supabase.from("experiment_events").insert({
    exp, variant, user_id: null, event: kind, meta: meta || null
  });
  if (error) return { statusCode: 500, body: error.message };
  return { statusCode: 200, body: "ok" };
};
