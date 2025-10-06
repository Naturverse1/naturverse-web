// netlify/functions/multavatar-generate.ts
import type { Handler } from "@netlify/functions";
const j = (ok: boolean, payload: any, status = 200) => ({
  statusCode: status,
  headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  body: JSON.stringify({ ok, provider: "multavatar", ...payload })
});
type Req = { seed?: string; size?: number };

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return j(true, {}, 204);
  if (event.httpMethod !== "POST") return j(false, { error: { code: "method_not_allowed", message: "Method not allowed" } }, 405);

  let body: Req = {};
  try { body = JSON.parse(event.body || "{}"); } catch { return j(false, { error: { code: "bad_json", message: "Bad JSON" } }, 400); }
  const seed = (body.seed || "navatar").toString();
  const size = Number(body.size || 1024);

  const url = `https://api.multiavatar.com/${encodeURIComponent(seed)}.png`;
  const r = await fetch(url);
  const base64 = Buffer.from(await r.arrayBuffer()).toString("base64");
  return j(true, { image: { base64, mime: r.headers.get("content-type") || "image/png", width: size, height: size } });
};
