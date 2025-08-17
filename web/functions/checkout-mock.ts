import type { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

export const handler: Handler = async (event) => {
  try {
    const { email, items, total_cents, method } = JSON.parse(event.body || "{}");
    if(!email || !Array.isArray(items) || !total_cents) return resp(400, { error: "Invalid payload" });
    const { data: order, error: orderErr } = await supabase.from("orders").insert({
      email, total_cents, status: method==="mock" ? "paid":"created", payment_method: method
    }).select().single();
    if(orderErr) return resp(500, { error: orderErr.message });
    const payload = items.map((it:any)=>({
      order_id: order.id,
      product_id: it.product.id,
      variant_id: it.variant.id,
      qty: it.qty,
      unit_price_cents: it.variant.price_cents,
      navatar_url: it.navatar_url || null,
      personalization: it.personalization || null
    }));
    const { error: itemErr } = await supabase.from("order_items").insert(payload);
    if(itemErr) return resp(500, { error: itemErr.message });
    return resp(200, { ok: true, order_id: order.id });
  } catch(err:any) {
    return resp(500, { error: err.message || "Server error" });
  }
};

function resp(code:number, body:any){
  return { statusCode: code, headers: { "Content-Type":"application/json" }, body: JSON.stringify(body) };
}
