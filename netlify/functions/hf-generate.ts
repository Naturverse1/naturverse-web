import type { Handler } from "@netlify/functions";

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

const MODEL = process.env.HF_MODEL_ID || "black-forest-labs/FLUX.1-dev";

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return json("", 204);

  const API_KEY = process.env.HUGGINGFACE_API_KEY || process.env.HF_API_TOKEN || "";
  if (!API_KEY) return json({ ok: false, error: "Missing HUGGINGFACE_API_KEY" }, 500);

  try {
    const { prompt, size = "1024x1024" } = JSON.parse(event.body || "{}");
    if (!prompt || typeof prompt !== "string") return json({ ok: false, error: "Missing prompt" }, 400);

    const [w, h] = String(size).split("x").map((n) => Math.max(256, Math.min(1536, Math.floor(Number(n) || 1024))));

    const res = await fetch(`https://api-inference.huggingface.co/models/${MODEL}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json", Accept: "image/png" },
      body: JSON.stringify({ inputs: prompt, parameters: { width: w, height: h } }),
    });

    const ct = res.headers.get("content-type") || "";
    if (ct.startsWith("image/")) {
      const buf = Buffer.from(await res.arrayBuffer());
      return json({ ok: true, provider: "huggingface", image: `data:image/png;base64,${buf.toString("base64")}` });
    }

    const raw = await res.text().catch(() => "");
    const msg =
      res.status === 402 || /quota|credit/i.test(raw) ? "huggingface_quota" : `huggingface_${res.status}`;
    return json({ ok: false, error: msg, detail: raw || undefined }, res.status);
  } catch (e: any) {
    return json({ ok: false, error: "huggingface_exception", detail: String(e?.message || e) }, 500);
  }
};
