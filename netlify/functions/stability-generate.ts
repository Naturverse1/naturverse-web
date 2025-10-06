// netlify/functions/stability-generate.ts
import type { Handler } from "@netlify/functions";

const respond = (ok: boolean, payload: any, status = 200) => ({
  statusCode: status,
  headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  body: JSON.stringify({ provider: "stability", ok, ...payload })
});
type Req = { prompt?: string; size?: string | number };

function normSize(s?: string | number) {
  if (!s) return "1024x1024";
  if (typeof s === "number") return `${s}x${s}`;
  const m = String(s).match(/^(\d+)(?:x(\d+))?$/);
  return m ? `${m[1]}x${m[2] ?? m[1]}` : "1024x1024";
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return respond(true, {}, 204);
  if (event.httpMethod !== "POST") return respond(false, { error: { code: "method_not_allowed", message: "Method not allowed" } }, 405);

  let body: Req = {};
  try { body = JSON.parse(event.body || "{}"); }
  catch { return respond(false, { error: { code: "bad_json", message: "Bad JSON body" } }, 400); }

  if (!process.env.STABILITY_API_KEY)
    return respond(false, { error: { code: "missing_key", message: "Missing STABILITY_API_KEY" } }, 500);

  const prompt = body.prompt?.trim();
  if (!prompt) return respond(false, { error: { code: "missing_prompt", message: "Prompt is required" } }, 400);

  const size = normSize(body.size);

  try {
    const r = await fetch("https://api.stability.ai/v2beta/stable-image/generate/core", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.STABILITY_API_KEY}`,
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt, output_format: "png", size
      })
    });

    const text = await r.text();
    if (!r.ok) return respond(false, { error: { code: "stability_http", message: "Provider responded with error", raw: text } }, r.status);

    let data: any;
    try { data = JSON.parse(text); } catch { return respond(false, { error: { code: "non_json_response", message: "Non-JSON response", raw: text } }, 502); }

    const b64 = data?.image || data?.image_base64 || data?.artifacts?.[0]?.base64;
    if (!b64) return respond(false, { error: { code: "no_image", message: "No image data", raw: data } }, 502);

    return respond(true, { image: { base64: b64, mime: "image/png" } });
  } catch (e: any) {
    return respond(false, { error: { code: "stability_exception", message: e?.message || "Unknown error" } }, 500);
  }
};
