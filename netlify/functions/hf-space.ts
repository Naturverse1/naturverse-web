import type { Handler } from "@netlify/functions";
import { extractImageUrl, getBearerToken, getSpaceConfig, jsonResponse, type SpaceConfig } from "./_hf";

type QueueOutcome =
  | { kind: "pending"; eventId: string }
  | { kind: "done"; imageUrl: string }
  | { kind: "error"; statusCode?: number; message: string }
  | { kind: "fallback" };

type PredictOutcome =
  | { kind: "done"; imageUrl: string }
  | { kind: "error"; statusCode?: number; message: string };

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { ok: false, error: "Method Not Allowed" });
  }

  const config = getSpaceConfig();
  if (!config) {
    return jsonResponse(500, { ok: false, error: "HF_SPACE_URL not set" });
  }

  let prompt: string | undefined;
  try {
    const payload = JSON.parse(event.body ?? "{}");
    if (typeof payload?.prompt === "string") {
      prompt = payload.prompt.trim();
    }
  } catch {
    return jsonResponse(400, { ok: false, error: "Invalid JSON payload" });
  }

  if (!prompt) {
    return jsonResponse(400, { ok: false, error: "Missing prompt" });
  }

  const bearer = getBearerToken();
  const headers: Record<string, string> = {
    "content-type": "application/json",
    Accept: "application/json",
  };
  if (bearer) {
    headers.Authorization = `Bearer ${bearer}`;
  }

  const queueOutcome = await tryQueue(config, headers, prompt);
  if (queueOutcome.kind === "done") {
    return jsonResponse(200, { ok: true, status: "done", imageUrl: queueOutcome.imageUrl });
  }
  if (queueOutcome.kind === "pending") {
    return jsonResponse(200, { ok: true, status: "pending", eventId: queueOutcome.eventId });
  }
  if (queueOutcome.kind === "error") {
    return jsonResponse(queueOutcome.statusCode ?? 502, { ok: false, error: queueOutcome.message });
  }

  const fallbackOutcome = await callPredict(config, headers, prompt);
  if (fallbackOutcome.kind === "done") {
    return jsonResponse(200, { ok: true, status: "done", imageUrl: fallbackOutcome.imageUrl });
  }

  return jsonResponse(fallbackOutcome.statusCode ?? 502, { ok: false, error: fallbackOutcome.message });
};

async function tryQueue(
  config: SpaceConfig,
  headers: Record<string, string>,
  prompt: string
): Promise<QueueOutcome> {
  try {
    const response = await fetch(`${config.hfBase}/gradio_api/call/infer`, {
      method: "POST",
      headers,
      body: JSON.stringify({ data: [prompt] }),
    });

    if (response.status === 404 || response.status === 405) {
      return { kind: "fallback" };
    }

    const text = await response.text();
    let payload: any = null;
    if (text) {
      try {
        payload = JSON.parse(text);
      } catch {
        payload = null;
      }
    }

    if (!response.ok) {
      const message = extractErrorMessage(payload, response.status, text);
      return { kind: "error", statusCode: response.status, message };
    }

    const imageUrl = extractImageUrl(payload, config);
    if (imageUrl) {
      return { kind: "done", imageUrl };
    }

    const eventId = extractEventId(payload);
    if (eventId) {
      return { kind: "pending", eventId };
    }

    if (payload && typeof payload.status === "string" && payload.status.toLowerCase().includes("error")) {
      const message = extractErrorMessage(payload, 502, text);
      return { kind: "error", statusCode: 502, message };
    }

    return { kind: "fallback" };
  } catch {
    return { kind: "fallback" };
  }
}

async function callPredict(
  config: SpaceConfig,
  headers: Record<string, string>,
  prompt: string
): Promise<PredictOutcome> {
  try {
    const response = await fetch(`${config.rawBase}/api/predict/`, {
      method: "POST",
      headers,
      body: JSON.stringify({ data: [prompt] }),
    });

    const text = await response.text();
    let payload: any = null;
    if (text) {
      try {
        payload = JSON.parse(text);
      } catch {
        payload = null;
      }
    }

    if (!response.ok) {
      const message = extractErrorMessage(payload, response.status, text);
      return { kind: "error", statusCode: response.status, message };
    }

    const imageUrl = extractImageUrl(payload, config);
    if (imageUrl) {
      return { kind: "done", imageUrl };
    }

    return {
      kind: "error",
      statusCode: 502,
      message: "Unexpected Space response",
    };
  } catch (error: any) {
    return {
      kind: "error",
      statusCode: 500,
      message: error?.message ?? "Unhandled error",
    };
  }
}

function extractEventId(payload: any): string | undefined {
  if (!payload || typeof payload !== "object") return undefined;
  const keys = ["event_id", "eventId", "id", "queue_id", "queueId"];
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  if (payload.event && typeof payload.event === "object") {
    const maybe = extractEventId(payload.event);
    if (maybe) return maybe;
  }
  return undefined;
}

function extractErrorMessage(payload: any, status: number, fallbackText: string | null): string {
  const candidates: unknown[] = [
    payload?.error,
    payload?.detail,
    payload?.message,
    payload?.errors && Array.isArray(payload.errors) ? payload.errors[0] : undefined,
    fallbackText,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  return `Space request failed (${status})`;
}
