import type { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

// short code generator (URL-friendly)
const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
const codeGen = (n = 6) =>
  Array.from({ length: n }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
  const { items } = JSON.parse(event.body || "{}") as {
    items: { id: string; qty: number }[];
  };
  if (!Array.isArray(items) || !items.length) return { statusCode: 400, body: "No items" };

  const code = codeGen();
  const { error } = await supabase.from("saved_carts").insert({ code, cart: items });
  if (error) return { statusCode: 500, body: error.message };
  return {
    statusCode: 200,
    body: JSON.stringify({
      code,
      url: `${process.env.PUBLIC_SITE_URL || process.env.URL}/c/${code}`,
    }),
  };
};
