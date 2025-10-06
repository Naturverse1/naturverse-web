// netlify/functions/hf-generate.ts
import type { Handler } from "@netlify/functions";
const j = (ok: boolean, payload: any, status = 200) => ({
  statusCode: status,
  headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  body: JSON.stringify({ ok, provider: "huggingface", ...payload })
});
type Req = { prompt?: string; model?: string; size?: string | number };

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return j(true, {}, 204);
  if (event.httpMethod !== "POST") return j(false, { error: { code: "method_not_allowed", message: "Method not allowed" } }, 405);

  let body: Req = {};
  try { body = JSON.parse(event.body || "{}"); } catch { return j(false, { error: { code: "bad_json", message: "Bad JSON" } }, 400); }

  const token = process.env.HUGGINGFACE_API_KEY || process.env.HF_API_TOKEN;
  if (!token) return j(false, { error: { code: "missing_key", message: "Missing HUGGINGFACE_API_KEY / HF_API_TOKEN" } }, 500);

  const prompt = body.prompt?.trim();
  const model = body.model || process.env.HF_MODEL_ID || "stabilityai/stable-diffusion-2";
  if (!prompt) return j(false, { error: { code: "missing_prompt", message: "Prompt required" } }, 400);

  try {
    const r = await fetch(`https://api-inference.huggingface.co/models/${encodeURIComponent(model)}`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ inputs: prompt })
    });
    if (!r.ok) return j(false, { error: { code: "hf_http", message: "Provider responded with error", raw: await r.text() } }, r.status);

    const buf = Buffer.from(await r.arrayBuffer()).toString("base64");
    return j(true, { image: { base64: buf, mime: "image/png" } });
  } catch (e: any) {
    return j(false, { error: { code: "hf_exception", message: e?.message || "Unknown error" } }, 500);
  }
};
