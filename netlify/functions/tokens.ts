import type { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export const handler: Handler = async (e) => {
  try {
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
      const { data, error } = await supabase.from("token_balances")
        .update({ balance: next }).eq("device_id", device).select().single();
      if (error) throw error;
      return ok({ device_id: device, balance: data.balance });
    }

    return bad("method");
  } catch (err:any) {
    return { statusCode: 500, body: err.message || "error" };
  }
};

async function ensure(device_id: string) {
  const { data } = await supabase.from("token_balances").select("*").eq("device_id", device_id).maybeSingle();
  if (data) return { device_id, balance: data.balance };
  const ins = await supabase.from("token_balances").insert({ device_id }).select().single();
  return { device_id, balance: ins.data?.balance ?? 1000 };
}
const ok = (b:any)=>({ statusCode:200, headers:{ "Content-Type":"application/json" }, body: JSON.stringify(b) });
const bad = (m:string)=>({ statusCode:400, body: m });

