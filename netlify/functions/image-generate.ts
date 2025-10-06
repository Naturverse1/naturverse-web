// netlify/functions/image-generate.ts
import type { Handler } from "@netlify/functions";

// Netlify's hard cap is 26s on Pro; set a bit under
export const config = {
  timeout: 25,
};

type Provider = "openai" | "huggingface" | "stability" | "deepai";
type Req = {
  provider: Provider;
  prompt: string;
  size?: string | number; // "1024x1024" or 512|1024|2048
};

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "content-type,authorization",
  };
}

function ok(body: any, statusCode = 200) {
  return { statusCode, headers: { "Content-Type": "application/json", ...cors() }, body: JSON.stringify(body) };
}
function fail(message: string, statusCode = 400, meta: any = {}) {
  return ok({ ok: false, error: message, ...meta }, statusCode);
}

function normSize(size: Req["size"]) {
  // Accept 512|1024|2048 or "WxH"
  if (!size) return { width: 1024, height: 1024, sizeStr: "1024x1024" };
  if (typeof size === "number") return { width: size, height: size, sizeStr: `${size}x${size}` };
  const m = String(size).match(/^(\d+)\s*x\s*(\d+)$/);
  if (m) return { width: +m[1], height: +m[2], sizeStr: `${+m[1]}x${+m[2]}` };
  const n = Number(size);
  if (Number.isFinite(n)) return { width: n, height: n, sizeStr: `${n}x${n}` };
  return { width: 1024, height: 1024, sizeStr: "1024x1024" };
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return ok("");
  if (event.httpMethod !== "POST") return fail("Method not allowed", 405);

  let body: Req | undefined;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return fail("bad_json");
  }

  const provider = body?.provider;
  const prompt = (body?.prompt || "").trim();
  if (!provider || !prompt) return fail("missing_fields", 400, { need: { provider: true, prompt: true } });

  const { width, height, sizeStr } = normSize(body?.size);

  try {
    switch (provider) {
      case "openai": {
        const key = process.env.OPENAI_API_KEY || "";
        if (!key) return fail("openai_key_missing", 500);
        const project = process.env.OPENAI_PROJECT_ID || undefined;

        const res = await fetch("https://api.openai.com/v1/images/generations", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
            ...(project ? { "OpenAI-Project": project } : {}),
          },
          body: JSON.stringify({
            model: "gpt-image-1",
            prompt,
            size: sizeStr,
            // quality: "standard",
            // style: "vivid",
          }),
        });

        const raw = await res.text();
        if (!res.ok) return fail("openai_error", res.status, { raw });

        // OpenAI returns {data:[{b64_json: "..."}]}
        const data = JSON.parse(raw);
        const b64 = data?.data?.[0]?.b64_json;
        if (!b64) return fail("openai_empty", 502, { raw });

        return ok({ ok: true, provider, dataUrl: `data:image/png;base64,${b64}` });
      }

      case "huggingface": {
        const key = process.env.HF_API_TOKEN || process.env.HUGGINGFACE_API_KEY || "";
        if (!key) return fail("huggingface_key_missing", 500);
        const model = process.env.HF_MODEL_ID || "black-forest-labs/FLUX.1-dev";

        const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
            Accept: "image/png",
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              width,
              height,
              guidance_scale: 5,
              num_inference_steps: 28,
            },
          }),
        });

        // HF returns image bytes when ok; text (error json or HTML) when not
        const ct = res.headers.get("content-type") || "";
        if (!res.ok || !ct.startsWith("image/")) {
          const raw = await res.text();
          return fail("huggingface_error", res.status, { raw });
        }
        const buf = Buffer.from(await res.arrayBuffer());
        return ok({ ok: true, provider, dataUrl: `data:image/png;base64,${buf.toString("base64")}` });
      }

      case "stability": {
        const key = process.env.STABILITY_API_KEY || process.env.VITE_STABILITY_API_KEY || "";
        if (!key) return fail("stability_key_missing", 500);

        const res = await fetch("https://api.stability.ai/v2beta/stable-image/generate/core", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
            Accept: "image/png",
          },
          body: JSON.stringify({
            prompt,
            output_format: "png",
            width,
            height,
          }),
        });

        const ct = res.headers.get("content-type") || "";
        if (!res.ok || !ct.startsWith("image/")) {
          const raw = await res.text();
          return fail("stability_error", res.status, { raw });
        }

        const buf = Buffer.from(await res.arrayBuffer());
        return ok({ ok: true, provider, dataUrl: `data:image/png;base64,${buf.toString("base64")}` });
      }

      case "deepai": {
        const key = process.env.DEEPAI_API_KEY || process.env.VITE_DEEPAI_API_KEY || "";
        if (!key) return fail("deepai_key_missing", 500);

        // DeepAI needs form-data
        const fd = new FormData();
        fd.set("text", prompt);
        // optional: grid_size, width/height not supported for all models

        const res = await fetch("https://api.deepai.org/api/text2img", {
          method: "POST",
          headers: { "api-key": key },
          body: fd as any,
        });

        const raw = await res.text();
        if (!res.ok) return fail("deepai_error", res.status, { raw });

        const data = JSON.parse(raw);
        // DeepAI returns a URL; fetch it and convert to dataURL for uniformity
        const imgUrl = data?.output_url;
        if (!imgUrl) return fail("deepai_empty", 502, { raw });

        const imgRes = await fetch(imgUrl);
        const buf = Buffer.from(await imgRes.arrayBuffer());
        return ok({ ok: true, provider, dataUrl: `data:image/png;base64,${buf.toString("base64")}` });
      }
    }

    return fail("unknown_provider", 400, { provider });
  } catch (err: any) {
    return fail("server_exception", 500, { message: String(err?.message || err) });
  }
};
