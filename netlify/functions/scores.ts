// @ts-ignore
import type { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const url = process.env.VITE_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!; // server-only
const supabase = createClient(url, key);

export const handler: Handler = async (event) => {
  try {
    const method = event.httpMethod;
    const game = (event.queryStringParameters?.game ?? "game1").toString();

    if (method === "GET") {
      const { data, error } = await supabase
        .from("scores")
        .select("*")
        .eq("game", game)
        .order("points", { ascending: false })
        .limit(25);
      if (error) throw error;
      return ok(data);
    }

    if (method === "POST") {
      const { name, points } = JSON.parse(event.body || "{}");
      if (!name || typeof points !== "number") return bad("name & points required");
      const { data, error } = await supabase
        .from("scores")
        .insert([{ game, name, points }])
        .select()
        .single();
      if (error) throw error;
      return ok(data);
    }

    return bad("Unsupported method");
  } catch (e: any) {
    return { statusCode: 500, body: e.message ?? "error" };
  }
};

const ok = (b: any) => ({ statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) });
const bad = (m: string) => ({ statusCode: 400, body: m });

