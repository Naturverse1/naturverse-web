import type { Handler } from "@netlify/functions";

type Req = { seed?: string };

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: cors(), body: "" };
  if (event.httpMethod !== "POST") return json({ ok: false, error: "Method not allowed" }, 405);

  try {
    const { seed = "naturverse" }: Req = JSON.parse(event.body || "{}");
    const apiKey = process.env.MULTIAVATAR_API_KEY || ""; // optional

    const url = `https://api.multiavatar.com/${encodeURIComponent(seed)}.svg${apiKey ? `?apikey=${apiKey}` : ""}`;
    const svgRes = await fetch(url);
    if (!svgRes.ok) {
      let raw = "";
      try { raw = await svgRes.text(); } catch {}
      return json({ ok: false, provider: "multiavatar", status: svgRes.status, error: raw || "multiavatar error" }, svgRes.status);
    }
    const svg = await svgRes.text();
    const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg, "utf8").toString("base64")}`;
    return json({ ok: true, provider: "multiavatar", dataUrl });
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
