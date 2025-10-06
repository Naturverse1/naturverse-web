// netlify/functions/deepai-generate.ts
import type { Handler } from "@netlify/functions";
const res = (ok: boolean, payload: any, status = 200) => ({
  statusCode: status,
  headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  body: JSON.stringify({ ok, provider: "deepai", ...payload })
});
type Req = { prompt?: string; size?: string | number };

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return res(true, {}, 204);
  if (event.httpMethod !== "POST") return res(false, { error: { code: "method_not_allowed", message: "Method not allowed" } }, 405);

  let body: Req = {};
  try { body = JSON.parse(event.body || "{}"); } catch { return res(false, { error: { code: "bad_json", message: "Bad JSON" } }, 400); }

  if (!process.env.DEEPAI_API_KEY) return res(false, { error: { code: "missing_key", message: "Missing DEEPAI_API_KEY" } }, 500);
  const prompt = body.prompt?.trim();
  if (!prompt) return res(false, { error: { code: "missing_prompt", message: "Prompt required" } }, 400);

  try {
    const r = await fetch("https://api.deepai.org/api/text2img", {
      method: "POST",
      headers: { "Api-Key": process.env.DEEPAI_API_KEY!, "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ text: prompt })
    });
    const data = await r.json().catch(async () => ({ error: await r.text() }));
    if (!r.ok) return res(false, { error: { code: "deepai_http", message: "Provider error", raw: data } }, r.status);

    const url = data?.output_url;
    if (!url) return res(false, { error: { code: "no_image", message: "No output_url", raw: data } }, 502);

    const img = await fetch(url);
    const base64 = Buffer.from(await img.arrayBuffer()).toString("base64");
    return res(true, { image: { base64, mime: img.headers.get("content-type") || "image/png" } });
  } catch (e: any) {
    return res(false, { error: { code: "deepai_exception", message: e?.message || "Unknown error" } }, 500);
  }
};
