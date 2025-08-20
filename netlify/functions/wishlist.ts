import type { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
const db = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export const handler: Handler = async (e) => {
  try {
    if (e.httpMethod === "GET") {
      const device = (e.queryStringParameters?.device||"").toString();
      if (!device) return bad("device required");
      const { data, error } = await db.from("wishlists").select("product_id").eq("device_id", device);
      if (error) throw error;
      return ok(data);
    }
    if (e.httpMethod === "POST") {
      const { device_id, product_id } = JSON.parse(e.body || "{}");
      if (!device_id || !product_id) return bad("device_id & product_id required");
      const existing = await db.from("wishlists").select("id").eq("device_id", device_id).eq("product_id", product_id).maybeSingle();
      if (existing.data) {
        await db.from("wishlists").delete().eq("id", existing.data.id);
        return ok({ status: "removed" });
      }
      await db.from("wishlists").insert({ device_id, product_id });
      return ok({ status: "added" });
    }
    return bad("method");
  } catch (e:any) { return { statusCode: 500, body: e.message || "error" }; }
};
const ok = (b:any)=>({ statusCode:200, headers:{ "Content-Type":"application/json" }, body: JSON.stringify(b) });
const bad = (m:string)=>({ statusCode:400, body: m });
