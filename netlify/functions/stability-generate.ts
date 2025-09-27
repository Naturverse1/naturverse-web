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

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return json("", 204);

  const API_KEY = process.env.STABILITY_API_KEY || "";
  if (!API_KEY) return json({ ok: false, error: "Missing STABILITY_API_KEY" }, 500);

  try {
    const { prompt, size = "1024x1024" } = JSON.parse(event.body || "{}");
    if (!prompt || typeof prompt !== "string") return json({ ok: false, error: "Missing prompt" }, 400);

    const [w, h] = String(size).split("x").map((n) => Math.max(128, Math.min(2048, Math.floor(Number(n) || 1024))));
    const form = new FormData();
    form.append("prompt", prompt);
    form.append("output_format", "png");
    form.append("width", String(w));
    form.append("height", String(h));

    const res = await fetch("https://api.stability.ai/v2beta/stable-image/generate/core", {
      method: "POST",
      headers: { Authorization: `Bearer ${API_KEY}`, Accept: "image/*" },
      body: form,
    });

    if (!res.ok) {
      const err = await res.text().catch(() => "");
      return json({ ok: false, error: "stability_error", detail: err || undefined }, res.status);
    }

    const buf = Buffer.from(await res.arrayBuffer());
    return json({ ok: true, provider: "stability", image: `data:image/png;base64,${buf.toString("base64")}` });
  } catch (e: any) {
    return json({ ok: false, error: "stability_exception", detail: String(e?.message || e) }, 500);
  }
};
