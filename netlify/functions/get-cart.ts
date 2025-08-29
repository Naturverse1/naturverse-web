import type { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const handler: Handler = async (event) => {
  const code = event.queryStringParameters?.code || "";
  if (!code) return { statusCode: 400, body: "Missing code" };
  const { data, error } = await supabase
    .from("saved_carts")
    .select("cart")
    .eq("code", code)
    .maybeSingle();
  if (error) return { statusCode: 500, body: error.message };
  if (!data) return { statusCode: 404, body: "Not found" };
  return { statusCode: 200, body: JSON.stringify(data.cart) };
};
