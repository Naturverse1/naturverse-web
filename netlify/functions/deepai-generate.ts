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
    const API_KEY = process.env.DEEPAI_API_KEY || "";
    if (!API_KEY) return json({ ok: false, error: "missing_deepai_key" }, 500);

    const { prompt = "" }: { prompt?: string } = JSON.parse(event.body || "{}");
    if (!prompt) return json({ ok: false, error: "missing_prompt" }, 400);

    const res = await fetch("https://api.deepai.org/api/text2img", {
      method: "POST",
      headers: {
        "api-key": API_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ text: prompt }).toString(),
    });

    if (!res.ok) {
      let raw = "";
      try {
        raw = await res.text();
      } catch (error) {
        console.error("Failed to read DeepAI error response", error);
      }
      const tag =
        res.status === 402 || res.status === 429
          ? "deepai_quota"
          : res.status >= 500
            ? "deepai_5xx"
            : "deepai_error";
      return json({ ok: false, error: tag, detail: raw }, 502);
    }

    const data = (await res.json()) as { output_url?: string };
    if (!data.output_url) return json({ ok: false, error: "deepai_bad_response" }, 502);

    const imgRes = await fetch(data.output_url);
    const buf = Buffer.from(await imgRes.arrayBuffer());
    return json({ ok: true, provider: "deepai", image: `data:image/png;base64,${buf.toString("base64")}` });
  } catch (e: any) {
    const msg = String(e?.message || e || "");
    const tag = /timeout|504/i.test(msg) ? "timeout_504" : "deepai_exception";
    return json({ ok: false, error: tag, detail: msg }, 502);
  }
};
