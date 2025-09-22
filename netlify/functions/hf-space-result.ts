import type { Handler } from "@netlify/functions";

const SPACE = process.env.HUGGINGFACE_SPACE_URL ?? process.env.HF_SPACE_URL;

type PollStatus = "PENDING" | "DONE";

type PollResponse = {
  status: PollStatus;
  image?: string;
  error?: string;
};

export const handler: Handler = async (event) => {
  if (!SPACE) {
    return json(500, { status: "DONE", error: "HUGGINGFACE_SPACE_URL not set" });
  }

  if (event.httpMethod !== "GET") {
    return json(405, { status: "DONE", error: "Method not allowed" });
  }

  const id = event.queryStringParameters?.id;
  if (!id) {
    return json(400, { status: "DONE", error: "Missing id" });
  }

  if (id === "wakeup") {
    await warmupSpace();
    return json(200, { status: "OK" });
  }

  try {
    const statusResult = await fetch(`${SPACE}/queue/status/${encodeURIComponent(id)}`, {
      headers: { Accept: "application/json" },
    });

    if (statusResult.status === 404) {
      return json(200, { status: "PENDING" });
    }

    const statusText = await statusResult.text();
    const statusPayload = safeJson(statusText);

    if (!statusResult.ok) {
      const message = extractError(statusPayload) ?? `Space status check failed (${statusResult.status})`;
      return json(statusResult.status, { status: "DONE", error: message });
    }

    const normalized = normalizeStatus(statusPayload);

    if (!normalized || normalized === "PENDING" || normalized === "QUEUED" || normalized === "RUNNING") {
      return json(200, { status: "PENDING" });
    }

    if (normalized === "FAILED" || normalized === "CANCELLED" || normalized === "ERROR") {
      const message = extractError(statusPayload) ?? "Space job failed";
      return json(200, { status: "DONE", error: message });
    }

    const inlineImage = extractImage(statusPayload, SPACE);
    if (inlineImage) {
      return json(200, { status: "DONE", image: inlineImage });
    }

    const resultResponse = await fetch(`${SPACE}/queue/result/${encodeURIComponent(id)}`, {
      headers: { Accept: "application/json" },
    });

    if (resultResponse.status === 404) {
      return json(200, { status: "PENDING" });
    }

    const resultText = await resultResponse.text();
    const resultPayload = safeJson(resultText);

    if (!resultResponse.ok) {
      const message = extractError(resultPayload) ?? `Space result fetch failed (${resultResponse.status})`;
      return json(resultResponse.status, { status: "DONE", error: message });
    }

    const image = extractImage(resultPayload, SPACE);
    if (!image) {
      const message = extractError(resultPayload) ?? "Unexpected Space response";
      return json(200, { status: "DONE", error: message });
    }

    return json(200, { status: "DONE", image });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Space request failed";
    return json(500, { status: "DONE", error: message });
  }
};

async function warmupSpace() {
  try {
    await fetch(`${SPACE}/`, { cache: "no-store" });
  } catch {
    // Ignore warmup failures
  }
}

function normalizeStatus(payload: Record<string, unknown> | null): string | null {
  if (!payload) return null;
  const candidates = [payload.status, payload.state];

  if (payload.data && typeof payload.data === "object") {
    const nested = payload.data as Record<string, unknown>;
    candidates.push(nested.status, nested.state);
  }

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate) {
      return candidate.toUpperCase();
    }
  }

  return null;
}

function extractError(payload: Record<string, unknown> | null): string | null {
  if (!payload) return null;

  const keys = ["error", "detail", "message"] as const;
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === "string" && value) {
      return value;
    }
  }

  if (payload.data && typeof payload.data === "object") {
    const nested = payload.data as Record<string, unknown>;
    for (const key of keys) {
      const value = nested[key];
      if (typeof value === "string" && value) {
        return value;
      }
    }
  }

  return null;
}

function extractImage(payload: unknown, spaceUrl: string): string | null {
  if (!payload) return null;

  if (typeof payload === "string") {
    if (payload.startsWith("data:image/")) return payload;
    if (payload.startsWith("http://") || payload.startsWith("https://")) return payload;
  }

  if (Array.isArray(payload)) {
    for (const item of payload) {
      const found = extractImage(item, spaceUrl);
      if (found) return found;
    }
    return null;
  }

  if (typeof payload === "object") {
    const record = payload as Record<string, unknown>;

    if (typeof record.image === "string" && record.image) {
      return record.image;
    }

    if (typeof record.url === "string" && record.url) {
      return record.url;
    }

    if (typeof record.path === "string" && record.path) {
      return record.path;
    }

    if (typeof record.name === "string" && record.name) {
      return `${spaceUrl}/${record.name.replace(/^file=*/, "")}`;
    }

    if (record.data) {
      const nested = extractImage(record.data, spaceUrl);
      if (nested) return nested;
    }

    if (record.output) {
      const nested = extractImage(record.output, spaceUrl);
      if (nested) return nested;
    }

    if (record.outputs) {
      const nested = extractImage(record.outputs, spaceUrl);
      if (nested) return nested;
    }

    if (record.result) {
      const nested = extractImage(record.result, spaceUrl);
      if (nested) return nested;
    }

    if (record.images) {
      const nested = extractImage(record.images, spaceUrl);
      if (nested) return nested;
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

function json(status: number, body: PollResponse | Record<string, unknown>) {
  return {
    statusCode: status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(body),
  };
}
