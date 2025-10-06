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

const DEFAULT_MODEL = process.env.NAVATAR_HF_MODEL || "black-forest-labs/FLUX.1-dev";

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return respond(204);
  }

  if (event.httpMethod !== "POST") {
    return respond(405, { error: "method_not_allowed" });
  }

  const apiKey = process.env.HUGGINGFACE_API_KEY || process.env.HF_API_TOKEN || "";
  if (!apiKey) {
    return respond(500, { error: "missing_huggingface_key" });
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
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${encodeURIComponent(DEFAULT_MODEL)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "image/png",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            width: size,
            height: size,
          },
        }),
      }
    );

    const arrayBuffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "";

    if (!response.ok) {
      let details = "";
      if (contentType.includes("application/json")) {
        try {
          const parsed = JSON.parse(Buffer.from(arrayBuffer).toString("utf-8"));
          details = typeof parsed?.error === "string" ? parsed.error : JSON.stringify(parsed);
        } catch {
          details = Buffer.from(arrayBuffer).toString("utf-8");
        }
      } else {
        details = Buffer.from(arrayBuffer).toString("utf-8");
      }

      return respond(response.status, { error: "huggingface_error", details: trimDetails(details) });
    }

    if (!contentType.startsWith("image/")) {
      const details = Buffer.from(arrayBuffer).toString("utf-8");
      return respond(502, { error: "huggingface_no_image", details: trimDetails(details) });
    }

    const base64 = Buffer.from(arrayBuffer).toString("base64");
    return respond(200, {
      imageUrl: `data:${contentType};base64,${base64}`,
      provider: "huggingface",
    });
  } catch (error: any) {
    return respond(500, {
      error: "huggingface_unexpected",
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
  const allowed = [512, 768, 896, 1024];
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
