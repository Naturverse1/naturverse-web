import type { Handler } from "@netlify/functions";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
} as const;

const STABILITY_URL =
  "https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image";

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
    process.env.STABILITY_API_KEY ||
    process.env.STABILITY_API_KEY_BEARER ||
    process.env.VITE_STABILITY_API_KEY ||
    "";

  if (!apiKey) {
    return respond(500, { error: "missing_stability_key" });
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
    const response = await fetch(STABILITY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        text_prompts: [{ text: prompt }],
        width: size,
        height: size,
        cfg_scale: 7,
        samples: 1,
      }),
    });

    const rawText = await response.text();
    let raw: any = null;
    try {
      raw = rawText ? JSON.parse(rawText) : null;
    } catch {
      raw = null;
    }

    if (!response.ok) {
      const details = typeof raw?.message === "string" ? raw.message : rawText;
      return respond(response.status, { error: "stability_error", details: trimDetails(details) });
    }

    const artifacts = Array.isArray(raw?.artifacts) ? raw.artifacts : [];
    for (const artifact of artifacts) {
      if (artifact && typeof artifact === "object" && typeof artifact.base64 === "string") {
        return respond(200, {
          imageUrl: `data:image/png;base64,${artifact.base64}`,
          provider: "stability",
        });
      }
    }

    return respond(502, { error: "stability_no_image" });
  } catch (error: any) {
    return respond(500, {
      error: "stability_unexpected",
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
  const sorted = [...allowed].sort((a, b) => a - b);
  let best = sorted[0];
  for (const option of sorted) {
    if (value >= option) {
      best = option;
    } else {
      break;
    }
  }
  return best;
}

function trimDetails(details: string) {
  return details ? details.slice(0, 4000) : "";
}
