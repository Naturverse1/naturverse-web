import type { Handler } from "@netlify/functions";

type Req = { prompt?: string; size?: number | string };

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: cors(), body: "" };
  }
  if (event.httpMethod !== "POST") {
    return json({ ok: false, error: "Method not allowed" }, 405);
  }

  try {
    const API_KEY = process.env.OPENAI_API_KEY || "";
    if (!API_KEY) return json({ ok: false, error: "Missing OPENAI_API_KEY" }, 500);

    const { prompt, size = 1024 }: Req = JSON.parse(event.body || "{}");
    if (!prompt || typeof prompt !== "string") return json({ ok: false, error: "Missing prompt" }, 400);

    const px = normalizeSize(size);

    const res = await fetch("https://api.openai.com/v1/images", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        size: `${px}x${px}`,
        n: 1,
        response_format: "b64_json",
      }),
    });

    if (!res.ok) {
      let raw = "";
      try { raw = await res.text(); } catch {}
      return json({ ok: false, provider: "openai", status: res.status, error: raw || "openai error" }, res.status);
    }

    const data = await res.json() as { data?: { b64_json?: string }[] };
    const b64 = data?.data?.[0]?.b64_json || "";
    if (!b64) return json({ ok: false, error: "openai empty response" }, 502);

    return json({ ok: true, provider: "openai", dataUrl: `data:image/png;base64,${b64}` });
  } catch (err: any) {
    return json({ ok: false, error: String(err?.message || err) }, 500);
  }
};

function normalizeSize(s: number | string) {
  if (typeof s === "number" && Number.isFinite(s)) return Math.max(128, Math.min(2048, Math.floor(s)));
  const str = String(s || "1024").toLowerCase();
  if (str.includes("x")) {
    const [w] = str.split("x");
    const n = Number(w);
    if (Number.isFinite(n)) return Math.max(128, Math.min(2048, Math.floor(n)));
  }
  const n = Number(str);
  return Number.isFinite(n) ? Math.max(128, Math.min(2048, Math.floor(n))) : 1024;
}

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
