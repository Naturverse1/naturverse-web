import type { Handler } from "@netlify/functions";
import fetch from "node-fetch";
import { getSpaceUrl } from "../../src/lib/env";

const MAX_WAIT_MS = 110_000;
const POLL_EVERY_MS = 1_000;

type JsonBody = Record<string, unknown> | null;

type GradioStartResponse = {
  event_id?: string;
  error?: string;
};

type GradioPollResponse = {
  stage?: string;
  status?: string;
  data?: unknown[];
  detail?: string;
  message?: string;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function jsonResponse(statusCode: number, body: JsonBody, options?: { cacheControl?: string }) {
  return {
    statusCode,
    body: JSON.stringify(body ?? {}),
    headers: {
      "Content-Type": "application/json",
      ...(options?.cacheControl ? { "Cache-Control": options.cacheControl } : {}),
    },
  };
}

function sanitizeFilePath(base: string, value: string): string {
  const clean = value.replace(/^file=*/, "").replace(/^\/+/, "");
  if (/^https?:\/\//i.test(clean)) {
    return clean;
  }
  return `${base}/${clean}`;
}

function extractImageData(base: string, entry: unknown): string | null {
  if (!entry) return null;
  if (typeof entry === "string" && entry.trim()) {
    return entry;
  }
  if (typeof entry === "object") {
    const record = entry as Record<string, unknown>;
    const possible = record.image ?? record.data ?? record.url ?? record.name;
    if (typeof possible === "string" && possible.trim()) {
      if (possible.startsWith("data:image")) {
        return possible;
      }
      return sanitizeFilePath(base, possible);
    }
  }
  return null;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method Not Allowed" });
  }

  const base = getSpaceUrl();
  if (!base) {
    return jsonResponse(500, { error: "Missing HF_SPACE_URL (or HUGGINGFACE_SPACE_URL)" });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return jsonResponse(400, { error: "Invalid JSON body" });
  }

  const prompt = typeof payload.prompt === "string" ? payload.prompt.trim() : "";
  if (!prompt) {
    return jsonResponse(400, { error: "Missing prompt" });
  }

  const negative = typeof payload.negative === "string" ? payload.negative : "";
  const seedRaw = payload.seed;
  const seed = typeof seedRaw === "number" && Number.isFinite(seedRaw) ? seedRaw : 0;
  const sizeRaw = payload.size;
  const size = typeof sizeRaw === "number" && Number.isFinite(sizeRaw) ? sizeRaw : 1024;

  try {
    const postUrl = `${base}/gradio_api/call/infer`;
    const requestBody = { data: [prompt, negative, seed, true, size, size, 0, 1] };

    const start = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (start.status === 404) {
      return jsonResponse(502, {
        error: "Space API path not found. Check that your URL ends with .hf.space",
      });
    }

    if (!start.ok) {
      const text = await start.text();
      return jsonResponse(502, { error: `Space call failed: ${start.status} ${text}` });
    }

    const startJson = (await start.json().catch(() => null)) as GradioStartResponse | null;
    const eventId = startJson?.event_id;

    if (startJson?.error) {
      return jsonResponse(502, { error: `Space error: ${startJson.error}` });
    }

    if (!eventId) {
      return jsonResponse(502, { error: "Space response missing event_id" });
    }

    const deadline = Date.now() + MAX_WAIT_MS;
    const pollUrl = `${base}/gradio_api/call/infer/${eventId}`;

    while (Date.now() < deadline) {
      const poll = await fetch(pollUrl, {
        headers: { "Content-Type": "application/json" },
      });

      if (poll.status === 503) {
        await sleep(POLL_EVERY_MS);
        continue;
      }

      if (!poll.ok) {
        const text = await poll.text();
        return jsonResponse(502, { error: `Space result error: ${poll.status} ${text}` });
      }

      const body = (await poll.json().catch(() => null)) as GradioPollResponse | null;
      if (!body) {
        await sleep(POLL_EVERY_MS);
        continue;
      }

      if (body.stage === "error" || body.status === "error") {
        const message = body.message || body.detail || "Space reported an error";
        return jsonResponse(502, { error: typeof message === "string" ? message : "Space reported an error" });
      }

      if (body.stage === "complete" || body.status === "complete") {
        const [first] = Array.isArray(body.data) ? body.data : [];
        const image = extractImageData(base, first);
        if (image) {
          return jsonResponse(200, { imageDataUrl: image }, { cacheControl: "no-store" });
        }
        return jsonResponse(502, { error: "Space returned an unexpected payload" });
      }

      await sleep(POLL_EVERY_MS);
    }

    return jsonResponse(504, { error: "Space timed out waiting for result" });
  } catch (err: any) {
    const message = typeof err?.message === "string" ? err.message : String(err);
    return jsonResponse(500, { error: message });
  }
};

