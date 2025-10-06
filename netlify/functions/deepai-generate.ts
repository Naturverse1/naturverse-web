import type { Handler } from "@netlify/functions";

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "content-type,authorization",
  };
}

function json(body: Record<string, unknown> | string, statusCode = 200) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json", ...cors() },
    body: typeof body === "string" ? body : JSON.stringify(body),
  };
}

type RequestBody = {
  prompt?: unknown;
  size?: unknown;
};

type ApiSuccess = { ok: true; provider: "deepai"; dataUrl: string };
type ApiError = { ok: false; code: string; error: string };

function parseSize(raw: unknown) {
  if (!raw || typeof raw !== "string") return { width: 1024, height: 1024 };
  const [w, h] = raw.toLowerCase().split("x");
  const width = Number.parseInt(w, 10);
  const height = Number.parseInt(h, 10);
  const clamp = (value: number) => Math.max(256, Math.min(1024, Math.floor(value)));
  if (!Number.isFinite(width) || !Number.isFinite(height)) {
    return { width: 1024, height: 1024 };
  }
  return { width: clamp(width), height: clamp(height) };
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return json("", 204);
  }

  try {
    const API_KEY = process.env.DEEPAI_API_KEY || "";
    if (!API_KEY) {
      return json({ ok: false, code: "deepai_missing_key", error: "Missing DEEPAI_API_KEY" }, 500);
    }

    let body: RequestBody;
    try {
      body = JSON.parse(event.body || "{}") as RequestBody;
    } catch {
      return json({ ok: false, code: "deepai_invalid_body", error: "Invalid JSON body" }, 400);
    }

    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    if (!prompt) {
      return json({ ok: false, code: "deepai_missing_prompt", error: "Missing prompt" }, 400);
    }

    const { width, height } = parseSize(body.size);

    const form = new FormData();
    form.append("text", prompt);
    form.append("width", String(width));
    form.append("height", String(height));

    const res = await fetch("https://api.deepai.org/api/text2img", {
      method: "POST",
      headers: { "api-key": API_KEY, Accept: "application/json" },
      body: form,
    });

    const raw = await res.text().catch(() => "");
    if (!res.ok) {
      const code = /Out of API credits/i.test(raw) ? "deepai_quota" : `deepai_${res.status}`;
      return json({ ok: false, code, error: raw || "DeepAI error" }, res.status);
    }

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return json({ ok: false, code: "deepai_invalid_response", error: "Invalid JSON response" }, 502);
    }

    const outUrl: string | undefined = parsed?.output_url;
    if (!outUrl) {
      return json({ ok: false, code: "deepai_no_output", error: "No output_url in response" }, 502);
    }

    const img = await fetch(outUrl);
    if (!img.ok) {
      const errTxt = await img.text().catch(() => "");
      return json(
        { ok: false, code: `deepai_fetch_${img.status}`, error: errTxt || "Unable to fetch DeepAI output" },
        img.status,
      );
    }

    const buf = Buffer.from(await img.arrayBuffer());
    const payload: ApiSuccess = {
      ok: true,
      provider: "deepai",
      dataUrl: `data:image/png;base64,${buf.toString("base64")}`,
    };
    return json(payload);
  } catch (err: any) {
    const payload: ApiError = {
      ok: false,
      code: "deepai_exception",
      error: String(err?.message || err),
    };
    return json(payload, 500);
  }
};
