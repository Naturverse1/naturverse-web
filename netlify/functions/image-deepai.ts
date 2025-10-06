import type { Handler } from "@netlify/functions";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
} as const;

interface RequestBody {
  prompt?: unknown;
  size?: unknown;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return respond(204);
  }

  if (event.httpMethod !== "POST") {
    return respond(405, { error: "method_not_allowed" });
  }

  const apiKey =
    process.env.DEEPAI_API_KEY ||
    process.env.DEEPAI_API_KEY_BEARER ||
    process.env.VITE_DEEPAI_API_KEY ||
    "";

  if (!apiKey) {
    return respond(500, { error: "missing_deepai_key" });
  }

  let payload: RequestBody;
  try {
    payload = JSON.parse(event.body || "{}") as RequestBody;
  } catch (error) {
    return respond(400, { error: "invalid_json" });
  }

  const prompt = normalisePrompt(payload.prompt);
  if (!prompt) {
    return respond(400, { error: "prompt_required" });
  }

  const size = normaliseSize(payload.size) || 1024;

  try {
    const form = new FormData();
    form.set("text", prompt);
    form.set("grid_size", "1");
    form.set("width", String(size));
    form.set("height", String(size));

    const response = await fetch("https://api.deepai.org/api/text2img", {
      method: "POST",
      headers: { "Api-Key": apiKey },
      body: form,
    });

    const rawText = await response.text();
    let raw: any = null;
    try {
      raw = rawText ? JSON.parse(rawText) : null;
    } catch {
      raw = null;
    }

    if (!response.ok) {
      const details = typeof raw?.error === "string" ? raw.error : rawText;
      return respond(response.status, { error: "deepai_error", details: trimDetails(details) });
    }

    const imageUrl = typeof raw?.output_url === "string" ? raw.output_url : undefined;
    if (!imageUrl) {
      return respond(502, { error: "deepai_no_image" });
    }

    return respond(200, { imageUrl, provider: "deepai" });
  } catch (error: any) {
    return respond(500, {
      error: "deepai_unexpected",
      details: trimDetails(error?.message || String(error)),
    });
  }
};

function respond(statusCode: number, payload?: Record<string, unknown>) {
  return {
    statusCode,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: payload ? JSON.stringify(payload) : "",
  };
}

function normalisePrompt(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim();
}

function normaliseSize(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return clampSize(Math.round(value));
  }
  if (typeof value === "string") {
    const numeric = Number.parseInt(value, 10);
    if (Number.isFinite(numeric)) {
      return clampSize(numeric);
    }
  }
  return undefined;
}

function clampSize(value: number) {
  const allowed = [256, 512, 768, 896, 1024];
  let best = allowed[0];
  for (const option of allowed) {
    if (value >= option) {
      best = option;
    }
  }
  return best;
}

function trimDetails(details: string) {
  return details ? details.slice(0, 4000) : "";
}
