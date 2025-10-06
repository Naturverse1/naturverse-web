import type { Handler } from "@netlify/functions";

type ReqBody = {
  prompt: string;
  provider?: "openai" | "stability" | "deepai" | "huggingface" | "multiavatar" | "auto";
  size?: number | string;
  seed?: string | number;
};

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "content-type,authorization",
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: cors, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return json({ ok: false, error: "Method not allowed" }, 405);
  }

  try {
    const body: ReqBody = JSON.parse(event.body || "{}");

    const providerIn = (body.provider || process.env.VITE_IMAGE_PROVIDER || "auto")
      .toString()
      .toLowerCase() as ReqBody["provider"];

    const prompt = (body.prompt || "").trim();
    if (!prompt) return json({ ok: false, error: "Missing prompt" }, 400);

    let width = 1024;
    let height = 1024;
    if (body.size) {
      const s = String(body.size).toLowerCase();
      if (s.includes("x")) {
        const [w, h] = s.split("x").map((v) => Number(v));
        if (Number.isFinite(w) && Number.isFinite(h)) {
          width = clampSize(w);
          height = clampSize(h);
        }
      } else {
        const n = Number(s);
        if (Number.isFinite(n)) width = height = clampSize(n);
      }
    }

    const tried: string[] = [];
    const errors: string[] = [];

    async function tryProvider(p: NonNullable<ReqBody["provider"]>) {
      tried.push(p);
      try {
        switch (p) {
          case "openai":
            return await viaOpenAI(prompt, width, height);
          case "stability":
            return await viaStability(prompt, width, height, body.seed);
          case "deepai":
            return await viaDeepAI(prompt, width, height);
          case "huggingface":
            return await viaHuggingFace(prompt, width, height, body.seed);
          case "multiavatar":
            return await viaMultiavatar(prompt, body.seed);
          default:
            throw new Error("Unknown provider");
        }
      } catch (e: any) {
        errors.push(`${p}: ${e?.status || e?.code || ""} ${e?.message || String(e)}`.trim());
        return null;
      }
    }

    if (providerIn === "auto") {
      for (const p of ["openai", "stability", "deepai", "huggingface", "multiavatar"] as const) {
        const out = await tryProvider(p);
        if (out) return json({ ok: true, dataUrl: out, provider: p });
      }
      return json({ ok: false, error: `All providers failed: ${errors.join(" | ")}` }, 502);
    }

    const out = await tryProvider(providerIn);
    if (out) return json({ ok: true, dataUrl: out, provider: providerIn });
    return json({ ok: false, error: errors.join(" | ") || "Generation failed" }, 502);
  } catch (err: any) {
    return json({ ok: false, error: String(err?.message || err) }, 500);
  }
};

function json(body: any, statusCode = 200) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json", ...cors },
    body: JSON.stringify(body),
  };
}

function clampSize(n: number) {
  return Math.max(128, Math.min(2048, Math.floor(n)));
}

async function viaOpenAI(prompt: string, width: number, height: number): Promise<string> {
  const key = process.env.OPENAI_API_KEY || "";
  if (!key) throw new Error("Missing OPENAI_API_KEY");

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt,
      size: `${width}x${height}`,
      response_format: "b64_json",
    }),
  });

  const raw = await res.text();
  if (!res.ok) {
    const msg = safeMsg(raw);
    const err: any = new Error(`openai ${res.status} ${msg}`);
    err.status = res.status;
    throw err;
  }
  const data = JSON.parse(raw);
  const b64 = data?.data?.[0]?.b64_json;
  if (!b64) throw new Error("openai empty response");
  return `data:image/png;base64,${b64}`;
}

async function viaStability(
  prompt: string,
  width: number,
  height: number,
  seed?: string | number,
): Promise<string> {
  const key = process.env.STABILITY_API_KEY || "";
  if (!key) throw new Error("Missing STABILITY_API_KEY");

  const form = new FormData();
  form.append("prompt", prompt);
  form.append("output_format", "png");
  form.append("width", String(width));
  form.append("height", String(height));
  if (seed !== undefined && seed !== null) form.append("seed", String(seed));
  form.append("cfg_scale", "5");

  const res = await fetch("https://api.stability.ai/v2beta/stable-image/generate/core", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      Accept: "image/*",
    },
    body: form,
  });

  const okAsImage = (res.headers.get("content-type") || "").startsWith("image/");
  const raw = okAsImage ? null : await res.text();
  if (!res.ok || !okAsImage) {
    const err: any = new Error(`stability ${res.status} ${safeMsg(raw || "")}`);
    err.status = res.status;
    throw err;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  return `data:image/png;base64,${buf.toString("base64")}`;
}

async function viaDeepAI(prompt: string, width: number, height: number): Promise<string> {
  const key = process.env.DEEPAI_API_KEY || "";
  if (!key) throw new Error("Missing DEEPAI_API_KEY");

  const form = new URLSearchParams();
  form.set("text", prompt);
  form.set("width", String(width));
  form.set("height", String(height));

  const res = await fetch("https://api.deepai.org/api/text2img", {
    method: "POST",
    headers: { "api-key": key, "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });

  const raw = await res.text();
  if (!res.ok) {
    const err: any = new Error(`deepai ${res.status} ${safeMsg(raw)}`);
    err.status = res.status;
    throw err;
  }
  const data = JSON.parse(raw);
  const url = data?.output_url;
  if (!url) throw new Error("deepai empty response");

  const img = await fetch(url);
  if (!img.ok) throw new Error(`deepai fetch ${img.status}`);
  const buf = Buffer.from(await img.arrayBuffer());
  return `data:image/png;base64,${buf.toString("base64")}`;
}

async function viaHuggingFace(
  prompt: string,
  width: number,
  height: number,
  seed?: string | number,
): Promise<string> {
  const key = process.env.HUGGINGFACE_API_KEY || process.env.HF_API_TOKEN || "";
  if (!key) throw new Error("Missing HUGGINGFACE_API_KEY");

  const model = process.env.HF_MODEL_ID || "black-forest-labs/FLUX.1-dev";
  const payload = {
    inputs: prompt,
    parameters: {
      width,
      height,
      guidance_scale: 5,
      num_inference_steps: 28,
      ...(seed !== undefined ? { seed } : {}),
      negative_prompt:
        "photo, photorealistic, watermark, logo, signature, text, letters, gore, violence, guns, extra limbs, deformed",
    },
  };

  const res = await fetch(`https://api-inference.huggingface.co/models/${encodeURIComponent(model)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Accept: "image/png",
    },
    body: JSON.stringify(payload),
  });

  const ct = res.headers.get("content-type") || "";
  if (!res.ok || !ct.startsWith("image/")) {
    const raw = await res.text().catch(() => "");
    const err: any = new Error(`hf ${res.status} ${safeMsg(raw)}`);
    err.status = res.status;
    throw err;
  }

  const buf = Buffer.from(await res.arrayBuffer());
  return `data:image/png;base64,${buf.toString("base64")}`;
}

async function viaMultiavatar(prompt: string, seed?: string | number): Promise<string> {
  const s = seed ?? simpleHash(prompt);
  const res = await fetch(`https://api.multiavatar.com/${encodeURIComponent(String(s))}.svg`);
  const svg = await res.text();
  if (!res.ok || !svg) {
    const err: any = new Error(`multiavatar ${res.status}`);
    err.status = res.status;
    throw err;
  }
  const svgEnc = encodeURIComponent(svg.replace(/\n+/g, ""));
  return `data:image/svg+xml;utf8,${svgEnc}`;
}

function simpleHash(str: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16);
}

function safeMsg(s: string) {
  try {
    const j = JSON.parse(s);
    return j?.error?.message || j?.error || j?.message || s;
  } catch {
    return s;
  }
}
