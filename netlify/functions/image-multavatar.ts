import type { Handler } from "@netlify/functions";
import crypto from "node:crypto";

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

  const apiKey = process.env.MULTAVATAR_API_KEY || process.env.MV_API_KEY || "";
  if (!apiKey) {
    return respond(500, { error: "missing_multavatar_key" });
  }

  let payload: RequestBody;
  try {
    payload = JSON.parse(event.body || "{}") as RequestBody;
  } catch (error) {
    return respond(400, { error: "invalid_json" });
  }

  const prompt = normalisePrompt(payload.prompt) || "navatar";
  void normaliseSize(payload.size); // Multavatar does not use size but we validate input for consistency.

  try {
    const seed = toSeed(prompt);
    const url = new URL(`https://api.multiavatar.com/${encodeURIComponent(seed)}.svg`);
    url.searchParams.set("apikey", apiKey);

    const response = await fetch(url);
    const svg = await response.text();

    if (!response.ok) {
      return respond(response.status, {
        error: "multavatar_error",
        details: trimDetails(svg),
      });
    }

    const base64 = Buffer.from(svg, "utf-8").toString("base64");
    return respond(200, {
      imageUrl: `data:image/svg+xml;base64,${base64}`,
      provider: "multavatar",
    });
  } catch (error: any) {
    return respond(500, {
      error: "multavatar_unexpected",
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

function toSeed(prompt: string) {
  return crypto.createHash("sha256").update(prompt).digest("hex").slice(0, 16);
}

function trimDetails(details: string) {
  return details ? details.slice(0, 4000) : "";
}
