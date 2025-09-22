import type { Handler } from "@netlify/functions";
import { randomUUID } from "node:crypto";

const SPACE = process.env.HUGGINGFACE_SPACE_URL ?? process.env.HF_SPACE_URL;

const DEFAULT_WIDTH = 512;
const DEFAULT_HEIGHT = 512;
const DEFAULT_STEPS = 2;
const DEFAULT_SEED = 0;
const MIN_RESOLUTION = 256;
const MAX_RESOLUTION = 1024;
const MAX_STEPS = 50;

interface StartPayload {
  prompt?: unknown;
  negativePrompt?: unknown;
  width?: unknown;
  height?: unknown;
  steps?: unknown;
  seed?: unknown;
}

export const handler: Handler = async (event) => {
  if (!SPACE) {
    return json(500, { error: "HUGGINGFACE_SPACE_URL not set" });
  }

  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  let body: StartPayload;
  try {
    body = JSON.parse(event.body ?? "{}");
  } catch {
    return json(400, { error: "Invalid JSON" });
  }

  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  if (!prompt) {
    return json(400, { error: "Missing prompt" });
  }

  const negativePrompt = typeof body.negativePrompt === "string" ? body.negativePrompt.trim() : "";
  const width = clampNumber(body.width, MIN_RESOLUTION, MAX_RESOLUTION, DEFAULT_WIDTH);
  const height = clampNumber(body.height, MIN_RESOLUTION, MAX_RESOLUTION, DEFAULT_HEIGHT);
  const steps = clampNumber(body.steps, 1, MAX_STEPS, DEFAULT_STEPS);
  const seed = clampNumber(body.seed, 0, Number.MAX_SAFE_INTEGER, DEFAULT_SEED);

  const eventId = createEventId();

  const queuePayload = {
    data: [prompt, negativePrompt, width, height, steps, seed],
    event_data: {
      prompt,
      negative_prompt: negativePrompt,
      width,
      height,
      steps,
      seed,
    },
    fn_index: 0,
    session_hash: eventId,
  };

  try {
    const response = await fetch(`${SPACE}/queue/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(queuePayload),
    });

    const text = await response.text();
    const jsonBody = safeJson(text);

    if (!response.ok) {
      const message = typeof jsonBody?.error === "string" ? jsonBody.error : "Space request failed";
      return json(response.status, { error: message });
    }

    const returnedId = extractEventId(jsonBody) ?? eventId;

    return json(200, { event_id: returnedId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Space request failed";
    return json(500, { error: message });
  }
};

function clampNumber(value: unknown, min: number, max: number, fallback: number): number {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(Math.max(Math.floor(num), min), max);
}

function createEventId(): string {
  try {
    return randomUUID();
  } catch {
    return Math.random().toString(36).slice(2);
  }
}

function extractEventId(payload: unknown): string | null {
  if (typeof payload !== "object" || !payload) return null;
  const record = payload as Record<string, unknown>;

  const candidates = [record.event_id, record.hash, record.session_hash];
  for (const value of candidates) {
    if (typeof value === "string" && value) {
      return value;
    }
  }

  return null;
}

function safeJson(text: string): Record<string, unknown> | null {
  if (!text) return null;
  try {
    const parsed = JSON.parse(text);
    return typeof parsed === "object" && parsed ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

function json(status: number, body: Record<string, unknown>) {
  return {
    statusCode: status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(body),
  };
}
