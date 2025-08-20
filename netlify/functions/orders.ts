import type { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
const db = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export const handler: Handler = async (e) => {
  try {
    if (e.httpMethod === "GET") {
      const device = (e.queryStringParameters?.device||"").toString();
      if (!device) return bad("device required");
      const { data, error } = await db.from("orders").select("*").eq("device_id", device).order("created_at",{ascending:false});
      if (error) throw error;
      return ok(data);
    }

    if (e.httpMethod === "POST") {
      const { device_id, items, address, total_tokens } = JSON.parse(e.body || "{}");
      if (!device_id || !Array.isArray(items) || typeof total_tokens !== "number") return bad("invalid payload");

      const bal = await db.from("token_balances").select("*").eq("device_id", device_id).maybeSingle();
      const balance = bal.data?.balance ?? 1000;
      if (balance < total_tokens) return bad("insufficient balance");
      await db.from("token_balances").upsert({ device_id, balance: balance - total_tokens }, { onConflict:"device_id" });

      const o = await db.from("orders").insert({
        device_id, total_tokens,
        name: address?.name, email: address?.email, phone: address?.phone,
        address1: address?.address1, address2: address?.address2,
        city: address?.city, region: address?.region, postal: address?.postal, country: address?.country
      }).select().single();
      if (o.error) throw o.error;

      if (items.length) {
        await db.from("order_items").insert(items.map((it:any)=>({
          order_id: o.data!.id, product_id: it.product_id, title: it.title, qty: it.qty, price_tokens: it.price_tokens
        })));
      }
      return ok({ order_id: o.data!.id });
    }

    return bad("method");
  } catch (e:any) { return { statusCode: 500, body: e.message || "error" }; }
};
const ok = (b:any)=>({ statusCode:200, headers:{ "Content-Type":"application/json" }, body: JSON.stringify(b) });
const bad = (m:string)=>({ statusCode:400, body: m });
