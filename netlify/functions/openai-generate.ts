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

  const API_KEY = process.env.OPENAI_API_KEY || "";
  if (!API_KEY) return json({ ok: false, error: "Missing OPENAI_API_KEY" }, 500);

  try {
    const { prompt, size = "1024x1024" } = JSON.parse(event.body || "{}");
    if (!prompt || typeof prompt !== "string") return json({ ok: false, error: "Missing prompt" }, 400);

    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "gpt-image-1", prompt, size }),
    });

    if (!res.ok) {
      const err = await res.text().catch(() => "");
      return json({ ok: false, error: `openai_${res.status}`, detail: err || undefined }, res.status);
    }

    const data = await res.json();
    const b64 = data?.data?.[0]?.b64_json;
    if (!b64) return json({ ok: false, error: "openai_empty" }, 502);

    return json({ ok: true, provider: "openai", image: `data:image/png;base64,${b64}` });
  } catch (e: any) {
    return json({ ok: false, error: "openai_exception", detail: String(e?.message || e) }, 500);
  }
};
