import type { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
const db = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export const handler: Handler = async (e) => {
  const device = (e.queryStringParameters?.device || JSON.parse(e.body||"{}").device_id || "").toString();
  if (!device) return bad("device required");

  if (e.httpMethod === "GET") {
    const bal = await ensure(device);
    return ok(bal);
  }
  if (e.httpMethod === "POST") {
    const { delta } = JSON.parse(e.body || "{}");
    if (typeof delta !== "number") return bad("delta number required");
    const bal = await ensure(device);
    const next = bal.balance + delta;
    if (next < 0) return bad("insufficient balance");
    const { data, error } = await db.from("token_balances").update({ balance: next }).eq("device_id", device).select().single();
    if (error) return fail(error);
    return ok({ device_id: device, balance: data.balance });
  }
  return bad("method");
};

async function ensure(device_id: string) {
  const got = await db.from("token_balances").select("*").eq("device_id", device_id).maybeSingle();
  if (got.data) return { device_id, balance: got.data.balance };
  const ins = await db.from("token_balances").insert({ device_id }).select().single();
  return { device_id, balance: ins.data?.balance ?? 1000 };
}
const ok = (b:any)=>({ statusCode:200, headers:{ "Content-Type":"application/json" }, body: JSON.stringify(b) });
const bad = (m:string)=>({ statusCode:400, body: m });
const fail = (e:any)=>({ statusCode:500, body: e.message||"error" });
