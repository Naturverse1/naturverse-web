// netlify/functions/openai-generate.ts
import type { Handler } from "@netlify/functions";

const ok = (data: any, status = 200) => ({
  statusCode: status,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
  body: JSON.stringify({ ok: true, provider: "openai", ...data })
});

const fail = (message: string, code = "openai_error", status = 400, raw?: any) => ({
  statusCode: status,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
  body: JSON.stringify({ ok: false, provider: "openai", error: { code, message, raw } })
});

type Req = { prompt?: string; size?: string | number };

function normalizeSize(s?: string | number) {
  if (!s) return { width: 1024, height: 1024 };
  if (typeof s === "number") return { width: s, height: s };
  // "WxH" or single number as string
  const m = String(s).toLowerCase().match(/^(\d+)(?:x(\d+))?$/);
  if (!m) return { width: 1024, height: 1024 };
  const w = parseInt(m[1], 10);
  const h = parseInt(m[2] ?? m[1], 10);
  return { width: w, height: h };
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS")
    return ok({}, 204);
  if (event.httpMethod !== "POST")
    return fail("Method not allowed", "method_not_allowed", 405);

  let body: Req = {};
  try { body = JSON.parse(event.body || "{}"); }
  catch { return fail("Bad JSON body", "bad_json", 400); }

  const { prompt } = body;
  const { width, height } = normalizeSize(body.size);

  if (!process.env.OPENAI_API_KEY) return fail("Missing OPENAI_API_KEY", "missing_key", 500);
  if (!prompt || !prompt.trim()) return fail("Prompt is required", "missing_prompt", 400);

  try {
    const r = await fetch("https://api.openai.com/v1/images/edits/../generations", {
      // ^ using generations; path left generic in case of library routing
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        size: `${width}x${height}`,
        response_format: "b64_json"
      })
    });

    // If provider ever returns HTML (rate-limit/proxy), surface as JSON error
    const text = await r.text();
    if (!r.ok) return fail("Provider responded with error", "openai_http", r.status, text);

    let data: any;
    try { data = JSON.parse(text); }
    catch { return fail("Non-JSON response from provider", "non_json_response", 502, text); }

    const b64 = data?.data?.[0]?.b64_json;
    if (!b64) return fail("No image data returned", "no_image", 502, data);

    return ok({ image: { base64: b64, mime: "image/png", width, height } });
  } catch (err: any) {
    return fail(err?.message || "Unknown error", "openai_exception", 500);
  }
};
