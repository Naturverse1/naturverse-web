import type { Handler } from "@netlify/functions";

type Req = { prompt?: string; size?: number | string };

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: cors(), body: "" };
  if (event.httpMethod !== "POST") return json({ ok: false, error: "Method not allowed" }, 405);

  try {
    const API_KEY = process.env.DEEPAI_API_KEY || "";
    if (!API_KEY) return json({ ok: false, error: "Missing DEEPAI_API_KEY" }, 500);

    const { prompt, size = 1024 }: Req = JSON.parse(event.body || "{}");
    if (!prompt || typeof prompt !== "string") return json({ ok: false, error: "Missing prompt" }, 400);

    const form = new URLSearchParams();
    form.set("text", prompt);

    const res = await fetch("https://api.deepai.org/api/text2img", {
      method: "POST",
      headers: { "api-key": API_KEY, Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });

    if (!res.ok) {
      let raw = "";
      try { raw = await res.text(); } catch {}
      return json({ ok: false, provider: "deepai", status: res.status, error: raw || "deepai error" }, res.status);
    }

    const out = await res.json() as { output_url?: string };
    const url = out.output_url;
    if (!url) return json({ ok: false, error: "deepai empty response" }, 502);

    const img = await fetch(url);
    const buf = Buffer.from(await img.arrayBuffer());

    // clamp/resize hint only via client display; DeepAI returns fixed size
    return json({ ok: true, provider: "deepai", dataUrl: `data:image/png;base64,${buf.toString("base64")}` });
  } catch (err: any) {
    return json({ ok: false, error: String(err?.message || err) }, 500);
  }
};

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "content-type,authorization",
  };
}
function json(body: any, statusCode = 200) {
  return { statusCode, headers: { "Content-Type": "application/json", ...cors() }, body: JSON.stringify(body) };
}
