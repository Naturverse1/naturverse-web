import type { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
import { ethers } from "ethers";

const supa = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);
const RPC = process.env.NATUR_RPC_URL!;
const TOKEN = process.env.VITE_NATUR_TOKEN_ADDRESS!;
const DECIMALS = Number(process.env.VITE_NATUR_TOKEN_DECIMALS || 18);
const TREASURY = process.env.VITE_NATUR_TREASURY!;
const USD_PER_NATUR = Number(process.env.VITE_NATUR_USD_RATE || 1);

const ERC20_IFACE = new ethers.Interface([
"event Transfer(address indexed from, address indexed to, uint256 value)"
]);
const TRANSFER_TOPIC = ERC20_IFACE.getEvent("Transfer").topicHash;

export const handler: Handler = async (event) => {
try {
const { order_id, tx_hash } = JSON.parse(event.body || "{}");
if (!order_id || !tx_hash) return j(400, { error: "Missing order_id or tx_hash" });

const { data: order, error: oErr } = await supa.from("orders").select("*").eq("id", order_id).single();
if (oErr || !order) return j(404, { error: "Order not found" });
if (order.status === "paid") return j(200, { ok: true, already: true });

// expected NATUR amount
const usd = Number(order.total_cents) / 100;
const expectedNatur = usd / USD_PER_NATUR;
const minAmount = ethers.parseUnits(expectedNatur.toFixed(6), DECIMALS); // 6 dp tolerance

const provider = new ethers.JsonRpcProvider(RPC);
const receipt = await provider.getTransactionReceipt(tx_hash);
if (!receipt || receipt.status !== 1n) return j(400, { error: "Tx not found or failed" });

// verify a Transfer(TOKEN) to TREASURY with value >= minAmount
const ok = receipt.logs.some((log) => {
  if ((log as any).address?.toLowerCase() !== TOKEN.toLowerCase()) return false;
  if (log.topics[0] !== TRANSFER_TOPIC) return false;
  const parsed = ERC20_IFACE.parseLog({ topics: log.topics as string[], data: log.data });
  const to = (parsed.args as any)[1] as string;
  const val = (parsed.args as any)[2] as bigint;
  return to.toLowerCase() === TREASURY.toLowerCase() && val >= minAmount;
});

if (!ok) return j(400, { error: "Transfer to treasury not found or amount too low" });

const { error: uErr } = await supa.from("orders").update({ status: "paid", payment_method: "natur" }).eq("id", order_id);
if (uErr) return j(500, { error: uErr.message });

return j(200, { ok: true });

} catch (e:any) {
return j(500, { error: e.message || "Server error" });
}
};

function j(code:number, body:any){ return { statusCode: code, headers:{ "Content-Type":"application/json" }, body: JSON.stringify(body) }; }
