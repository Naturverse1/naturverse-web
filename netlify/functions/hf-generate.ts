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

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, Math.floor(n)));
}

function parseSize(s?: string) {
  const size = (s || "1024x1024").toLowerCase();
  const [w, h] = size.split("x").map(Number);
  return {
    width: clamp(w || 1024, 256, 2048),
    height: clamp(h || 1024, 256, 2048),
  };
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return json({}, 204);

  try {
    const API_KEY =
      process.env.HUGGINGFACE_API_KEY || process.env.HF_API_TOKEN || "";
    const MODEL = process.env.HF_MODEL_ID || "black-forest-labs/FLUX.1-dev";
    if (!API_KEY) return json({ ok: false, error: "missing_hf_key" }, 500);

    const { prompt = "", size }: { prompt?: string; size?: string } = JSON.parse(
      event.body || "{}",
    );
    if (!prompt) return json({ ok: false, error: "missing_prompt" }, 400);

    const { width, height } = parseSize(size);
    const res = await fetch(`https://api-inference.huggingface.co/models/${MODEL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        Accept: "image/png",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { width, height, guidance_scale: 5, num_inference_steps: 28 },
      }),
    });

    if (!res.ok) {
      let raw = "";
      try {
        raw = await res.text();
      } catch (error) {
        console.error("Failed to read HF error response", error);
      }
      const tag =
        res.status === 402 || res.status === 429
          ? "hf_quota"
          : res.status >= 500
            ? "hf_5xx"
            : "hf_error";
      return json({ ok: false, error: tag, detail: raw }, 502);
    }

    const buf = Buffer.from(await res.arrayBuffer());
    return json({ ok: true, provider: "huggingface", image: `data:image/png;base64,${buf.toString("base64")}` });
  } catch (e: any) {
    const msg = String(e?.message || e || "");
    const tag = /timeout|504/i.test(msg) ? "timeout_504" : "hf_exception";
    return json({ ok: false, error: tag, detail: msg }, 502);
  }
};
