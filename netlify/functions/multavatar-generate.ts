import type { Handler } from "@netlify/functions";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "content-type,authorization",
  };
}

function json(body: any, status = 200) {
  return {
    statusCode: status,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
    body: JSON.stringify(body),
  };
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return json({}, 204);

  try {
    const { seed = "navatar" }: { seed?: string } = JSON.parse(event.body || "{}");

    const url = `https://api.multiavatar.com/${encodeURIComponent(seed)}.png`;
    const res = await fetch(url, { headers: { Accept: "image/png" } });
    if (!res.ok)
      return json({ ok: false, error: "basic_error", detail: await res.text().catch(() => "") }, 502);

    const buf = Buffer.from(await res.arrayBuffer());
    return json({ ok: true, provider: "basic", image: `data:image/png;base64,${buf.toString("base64")}` });
  } catch (e: any) {
    return json({ ok: false, error: "basic_exception", detail: String(e?.message || e || "") }, 502);
  }
};
