import type { Handler } from "@netlify/functions";
import crypto from "node:crypto";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
} as const;

interface RequestBody {
  prompt?: unknown;
  size?: unknown;
}

const PROVIDER = "multavatar" as const;
const TIMEOUT_MS = 20_000;

type NormalisedSize = "512" | "1024" | "2048";

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return respond(200, {});
  }

  if (event.httpMethod !== "POST") {
    return respondError(405, "method_not_allowed");
  }

  const apiKey = process.env.MULTAVATAR_API_KEY || process.env.MV_API_KEY || "";
  if (!apiKey) {
    return respondError(500, "missing_api_key", "MULTAVATAR_API_KEY");
  }

  let payload: RequestBody;
  try {
    payload = JSON.parse(event.body || "{}") as RequestBody;
  } catch {
    return respondError(400, "invalid_json");
  }

  const prompt = normalisePrompt(payload.prompt) || "navatar";
  void normaliseSize(payload.size);

  try {
    const seed = toSeed(prompt);
    const url = new URL(`https://api.multiavatar.com/${encodeURIComponent(seed)}.svg`);
    url.searchParams.set("apikey", apiKey);

    const response = await fetchWithTimeout(url.toString(), { method: "GET" });
    const svg = await response.text();

    if (!response.ok) {
      return respondError(response.status, "upstream_error", svg.slice(0, 160));
    }

    const base64 = Buffer.from(svg, "utf-8").toString("base64");
    return respond(200, {
      imageUrl: `data:image/svg+xml;base64,${base64}`,
    });
  } catch (error: any) {
    if (isAbortError(error)) {
      return respondError(504, "timeout");
    }
    return respondError(502, "network_error", error?.message);
  }
};

function respond(statusCode: number, payload: Record<string, unknown>) {
  return {
    statusCode,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify({ provider: PROVIDER, ...payload }),
  };
}

function respondError(statusCode: number, error: string, code?: unknown) {
  const body: Record<string, unknown> = { provider: PROVIDER, error };
  if (typeof code === "string" || typeof code === "number") {
    body.code = code;
  }
  return {
    statusCode,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(body),
  };
}

function normalisePrompt(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim();
}

function normaliseSize(value: unknown): NormalisedSize | undefined {
  const allowed: NormalisedSize[] = ["512", "1024", "2048"];
  if (typeof value === "string") {
    const trimmed = value.trim();
    if ((allowed as readonly string[]).includes(trimmed)) {
      return trimmed as NormalisedSize;
    }
    const numeric = Number.parseInt(trimmed, 10);
    if (Number.isFinite(numeric)) {
      return clampSize(numeric);
    }
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return clampSize(Math.round(value));
  }
  return undefined;
}

function clampSize(value: number): NormalisedSize {
  if (value <= 512) return "512";
  if (value <= 1024) return "1024";
  return "2048";
}

function toSeed(prompt: string) {
  return crypto.createHash("sha256").update(prompt).digest("hex").slice(0, 16);
}

async function fetchWithTimeout(input: RequestInfo, init: RequestInit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

function isAbortError(error: unknown) {
  return error instanceof Error && error.name === "AbortError";
}
