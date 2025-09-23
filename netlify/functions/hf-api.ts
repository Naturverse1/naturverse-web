import type { Handler } from "@netlify/functions";

// Minimal shape for the client request
type GenRequest = {
  prompt: string;
  negative_prompt?: string;
  width?: number;
  height?: number;
  num_inference_steps?: number;
  guidance_scale?: number;
  seed?: number | null;
};

const HF_KEY = process.env.HUGGINGFACE_API_KEY;
const MODEL_ID = process.env.HF_MODEL_ID || "black-forest-labs/FLUX.1-dev";

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
      "access-control-allow-origin": "*",
    },
  }) as unknown as Response & { statusCode?: number };
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "POST,OPTIONS",
        "access-control-allow-headers": "content-type",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return json(405, { error: "Use POST" });
  }
  if (!HF_KEY) return json(500, { error: "HUGGINGFACE_API_KEY is not set" });

  let body: GenRequest;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { error: "Bad JSON body" });
  }
  const {
    prompt,
    negative_prompt = "",
    width = 1024,
    height = 1024,
    num_inference_steps = 25,
    guidance_scale = 3.0,
    seed = null,
  } = body;

  if (!prompt || typeof prompt !== "string") {
    return json(400, { error: "Missing 'prompt' string" });
  }

  // HF Inference API (text-to-image) — returns binary image
  const url = `https://api-inference.huggingface.co/models/${encodeURIComponent(
    MODEL_ID
  )}?wait_for_model=true`;

  const payload = {
    inputs: prompt,
    parameters: {
      negative_prompt,
      width,
      height,
      num_inference_steps,
      guidance_scale,
      seed,
    },
  };

  // Abort near Netlify timeout so we can return a clean error
  const controller = new AbortController();
  const abortMs = 55_000;
  const t = setTimeout(() => controller.abort(), abortMs);

  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    // HF may return JSON error; success is image/* (webp/png/jpeg)
    const ct = resp.headers.get("content-type") || "";
    if (!resp.ok) {
      const err = await resp.text().catch(() => "");
      return json(resp.status, {
        error: "HF request failed",
        status: resp.status,
        contentType: ct,
        detail: err.slice(0, 2000),
      });
    }

    const buf = Buffer.from(await resp.arrayBuffer());

    // Return as data URL to keep it simple (no storage required)
    const mime =
      ct.startsWith("image/") ? ct : "image/webp"; // HF often returns image/webp
    const base64 = `data:${mime};base64,${buf.toString("base64")}`;

    return json(200, {
      ok: true,
      model: MODEL_ID,
      mime,
      dataUrl: base64,
    });
  } catch (e: any) {
    if (e?.name === "AbortError") {
      return json(504, { error: "Generation timed out at edge (client can retry)" });
    }
    return json(500, { error: "Server error calling HF", detail: String(e) });
  } finally {
    clearTimeout(t);
  }
};

export default handler;
