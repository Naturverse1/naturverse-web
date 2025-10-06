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

  const API_KEY = process.env.DEEPAI_API_KEY || "";
  if (!API_KEY) return json({ ok: false, error: "Missing DEEPAI_API_KEY" }, 500);

  try {
    const { prompt } = JSON.parse(event.body || "{}");
    if (!prompt || typeof prompt !== "string") return json({ ok: false, error: "Missing prompt" }, 400);

    const form = new FormData();
    form.append("text", prompt);

    const res = await fetch("https://api.deepai.org/api/text2img", {
      method: "POST",
      headers: { "Api-Key": API_KEY },
      body: form,
    });

    if (!res.ok) {
      const raw = await res.text().catch(() => "");
      const msg = res.status === 402 || /Out of API credits/i.test(raw) ? "deepai_quota" : `deepai_${res.status}`;
      return json({ ok: false, error: msg, detail: raw || undefined }, res.status);
    }

    const data = await res.json();
    const url = data?.output_url;
    if (!url) return json({ ok: false, error: "deepai_empty" }, 502);

    const img = await fetch(url);
    const buf = Buffer.from(await img.arrayBuffer());
    return json({ ok: true, provider: "deepai", image: `data:image/png;base64,${buf.toString("base64")}` });
  } catch (e: any) {
    return json({ ok: false, error: "deepai_exception", detail: String(e?.message || e) }, 500);
  }
};
