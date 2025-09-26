// Netlify Function: /.netlify/functions/image-generate
// Unifies: openai | stability | deepai | hf | multiavatar
// Uses *server* env keys (NO VITE_ prefix). Returns { ok, url, error }.

import type { Handler } from "@netlify/functions";
import fetch, { Headers } from "node-fetch";

// Helpers
const bad = (status: number, error: string) =>
  new Response(JSON.stringify({ ok: false, error }), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const ok = (url: string) =>
  new Response(JSON.stringify({ ok: true, url }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });

// Save a Buffer to a temporary data URL (for quick test) – for prod you likely save to Supabase.
const bufferToDataUrl = (buf: Buffer, mime = "image/png") =>
  `data:${mime};base64,${buf.toString("base64")}`;

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return bad(405, "Use POST");
    }

    const { provider, prompt, size = 1024, seed } = JSON.parse(event.body || "{}") as {
      provider: "openai" | "stability" | "deepai" | "hf" | "multiavatar";
      prompt?: string;
      size?: number;
      seed?: string;
    };

    if (!provider) return bad(400, "Missing provider");

    // CORS for local testing
    const origin = event.headers.origin || "*";

    const withCors = (res: Response) => {
      const headers = new Headers(res.headers as any);
      headers.set("Access-Control-Allow-Origin", origin);
      headers.set("Access-Control-Allow-Headers", "content-type,authorization");
      headers.set("Access-Control-Allow-Methods", "POST,OPTIONS");
      return new Response(res.body, { headers, status: res.status, statusText: res.statusText });
    };
    if (event.httpMethod === "OPTIONS") {
      return withCors(new Response(null, { status: 204 }));
    }

    // Providers
    if (provider === "openai") {
      const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
      if (!OPENAI_API_KEY) return bad(500, "OPENAI_API_KEY not set");

      const resp = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-image-1",
          prompt,
          size: `${size}x${size}`,
          // background: "transparent" // optional
        }),
      });

      if (!resp.ok) {
        const t = await resp.text();
        return bad(resp.status, `openai ${resp.status}: ${t}`);
      }
      const data = (await resp.json()) as any;
      const b64 = data?.data?.[0]?.b64_json;
      if (!b64) return bad(500, "OpenAI returned no image");
      return ok(`data:image/png;base64,${b64}`);
    }

    if (provider === "stability") {
      const STABILITY_API_KEY = process.env.STABILITY_API_KEY;
      if (!STABILITY_API_KEY) return bad(500, "STABILITY_API_KEY not set");

      // New v2beta endpoint
      const form = new FormData();
      form.set("prompt", prompt || "");
      form.set("output_format", "png");
      form.set("width", String(size));
      form.set("height", String(size));

      const resp = await fetch("https://api.stability.ai/v2beta/stable-image/generate/core", {
        method: "POST",
        headers: { Authorization: `Bearer ${STABILITY_API_KEY}`, Accept: "image/*" },
        body: form as any,
      });

      if (!resp.ok) {
        const t = await resp.text();
        return bad(resp.status, `stability ${resp.status}: ${t}`);
      }
      const buf = Buffer.from(await resp.arrayBuffer());
      return ok(bufferToDataUrl(buf, "image/png"));
    }

    if (provider === "deepai") {
      const DEEPAI_API_KEY = process.env.DEEPAI_API_KEY;
      const DEEPAI_ENDPOINT =
        process.env.VITE_DEEPAI_ENDPOINT ||
        "https://api.deepai.org/api/text2img"; // default public endpoint

      if (!DEEPAI_API_KEY) return bad(500, "DEEPAI_API_KEY not set");

      const form = new URLSearchParams();
      form.set("text", prompt || "");
      // deepai ignores size, but we keep it consistent

      const resp = await fetch(DEEPAI_ENDPOINT, {
        method: "POST",
        headers: { "api-key": DEEPAI_API_KEY },
        body: form as any,
      });

      if (!resp.ok) {
        const t = await resp.text();
        return bad(resp.status, `deepai ${resp.status}: ${t}`);
      }
      const data = (await resp.json()) as any;
      const url = data?.output_url || (data?.id && data?.output?.url);
      if (!url) return bad(500, "DeepAI returned no url");
      // For dev we just bounce back the remote URL
      return ok(url);
    }

    if (provider === "hf") {
      const HF_API_TOKEN = process.env.HF_API_TOKEN || process.env.HUGGINGFACE_API_KEY;
      const HF_MODEL_ID =
        process.env.HF_MODEL_ID || "stabilityai/stable-diffusion-2-1"; // pick a public model

      if (!HF_API_TOKEN) return bad(500, "HF_API_TOKEN not set");

      const resp = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL_ID}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt || "" }),
      });

      if (!resp.ok) {
        const t = await resp.text();
        return bad(resp.status, `hf ${resp.status}: ${t}`);
      }
      // HF can return an image buffer
      const contentType = resp.headers.get("content-type") || "image/png";
      const buf = Buffer.from(await resp.arrayBuffer());
      return ok(bufferToDataUrl(buf, contentType));
    }

    if (provider === "multiavatar") {
      // free, no key required
      const name = seed || (prompt || "naturverse").slice(0, 32).replace(/\s+/g, "-");
      const url = `https://api.multiavatar.com/${encodeURIComponent(name)}.png`;
      // fetch to ensure 200
      const resp = await fetch(url);
      if (!resp.ok) {
        const t = await resp.text();
        return bad(resp.status, `multiavatar ${resp.status}: ${t}`);
      }
      const buf = Buffer.from(await resp.arrayBuffer());
      return ok(bufferToDataUrl(buf, "image/png"));
    }

    return bad(400, `Unknown provider: ${provider}`);
  } catch (err: any) {
    return bad(500, err?.message || "Server error");
  }
};
