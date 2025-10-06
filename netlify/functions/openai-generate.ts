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

function clampSize(size: string | undefined) {
  const s = (size || "1024x1024").toLowerCase();
  const [w, h] = s
    .split("x")
    .map((n) => Math.max(256, Math.min(2048, Math.floor(Number(n) || 1024))));
  return `${w}x${h}`;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return json({}, 204);

  try {
    const API_KEY = process.env.OPENAI_API_KEY || "";
    if (!API_KEY) return json({ ok: false, error: "missing_openai_key" }, 500);

    const { prompt = "", size }: { prompt?: string; size?: string } = JSON.parse(
      event.body || "{}",
    );
    if (!prompt || typeof prompt !== "string")
      return json({ ok: false, error: "missing_prompt" }, 400);

    const finalSize = clampSize(size);
    const resp = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model: "gpt-image-1", prompt, size: finalSize }),
    });

    if (!resp.ok) {
      let raw = "";
      try {
        raw = await resp.text();
      } catch (error) {
        console.error("Failed to read OpenAI error response", error);
      }
      const code = resp.status;
      const tag =
        code === 400
          ? "openai_400"
          : code === 401
            ? "openai_401"
            : code === 429
              ? "openai_quota"
              : code >= 500
                ? "openai_5xx"
                : "openai_error";
      return json({ ok: false, error: tag, detail: raw }, 502);
    }

    const data = (await resp.json()) as { data?: { b64_json: string }[] };
    const b64 = data?.data?.[0]?.b64_json;
    if (!b64) return json({ ok: false, error: "openai_bad_response" }, 502);

    return json({ ok: true, provider: "openai", image: `data:image/png;base64,${b64}` });
  } catch (err: any) {
    const msg = String(err?.message || err || "");
    const tag = /504|timeout/i.test(msg) ? "timeout_504" : "openai_exception";
    return json({ ok: false, error: tag, detail: msg }, 502);
  }
};
