import type { Handler } from "@netlify/functions";

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
  };
}
function json(body: any, statusCode = 200) {
  return { statusCode, headers: { "Content-Type": "application/json", ...cors() }, body: JSON.stringify(body) };
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return json("", 204);

  try {
    const { seed = "naturverse" } = JSON.parse(event.body || "{}");
    const url = `https://api.multiavatar.com/${encodeURIComponent(String(seed))}.svg`;

    const res = await fetch(url);
    if (!res.ok) {
      const raw = await res.text().catch(() => "");
      return json({ ok: false, error: `multavatar_${res.status}`, detail: raw || undefined }, res.status);
    }

    const svg = await res.text();
    const b64 = Buffer.from(svg, "utf-8").toString("base64");
    return json({ ok: true, provider: "multavatar", image: `data:image/svg+xml;base64,${b64}` });
  } catch (e: any) {
    return json({ ok: false, error: "multavatar_exception", detail: String(e?.message || e) }, 500);
  }
};
