import type { Handler } from "@netlify/functions";

type JsonBody = Record<string, unknown>;

const HANDLER_DEADLINE_MS = 55_000;
const INITIAL_POLL_INTERVAL_MS = 1_000;
const MAX_POLL_INTERVAL_MS = 5_000;
const BACKOFF_MULTIPLIER = 1.5;

const readSpaceUrl = () =>
  process.env.HUGGINGFACE_SPACE_URL?.trim() ||
  process.env.HF_SPACE_URL?.trim() ||
  "";

if (!readSpaceUrl()) {
  console.warn("No HUGGINGFACE_SPACE_URL or HF_SPACE_URL set.");
}

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      const notAllowed = jsonResponse(405, { error: "Only POST supported" });
      notAllowed.headers = { ...notAllowed.headers, Allow: "POST" };
      return notAllowed;
    }

    const rawSpaceUrl = readSpaceUrl();
    if (!rawSpaceUrl) {
      return jsonResponse(500, { error: "HF_SPACE_URL not set" });
    }

    let spaceBase: string;
    try {
      spaceBase = toHfSubdomain(rawSpaceUrl);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return jsonResponse(500, { error: message });
    }

    let parsedBody: Record<string, unknown>;
    try {
      parsedBody = JSON.parse(event.body ?? "{}");
    } catch {
      return jsonResponse(400, { error: "Invalid JSON body" });
    }

    const prompt = typeof parsedBody.prompt === "string" ? parsedBody.prompt : "";
    if (!prompt.trim()) {
      return jsonResponse(400, { error: "Prompt is required" });
    }

    const negativePrompt =
      typeof parsedBody.negativePrompt === "string" ? parsedBody.negativePrompt : "";
    const seed = toNumber(parsedBody.seed, 0);
    const width = toNumber(parsedBody.width, 1024);
    const height = toNumber(parsedBody.height, 1024);
    const steps = toNumber(parsedBody.steps, 28);

    const callUrl = `${spaceBase}/gradio_api/call/infer`;
    const postResponse = await fetch(callUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [prompt, negativePrompt, seed, width, height, 0, steps],
      }),
    });

    if (!postResponse.ok) {
      const text = await postResponse.text();
      return jsonResponse(postResponse.status, {
        error: `Space POST ${postResponse.status} ${postResponse.statusText}`.trim(),
        details: truncate(text),
      });
    }

    const postClone = postResponse.clone();
    const postJson = await postClone.json().catch(() => null);
    let eventId: string | undefined;

    if (postJson && typeof postJson === "object") {
      const id = (postJson as Record<string, unknown>).event_id;
      if (typeof id === "string" && id.trim()) {
        eventId = id.trim();
      }
    }

    if (!eventId) {
      const text = (await postResponse.text()).trim();
      if (text) {
        eventId = text;
      }
    }

    if (!eventId) {
      return jsonResponse(502, { error: "Space did not return event_id" });
    }

    const deadline = Date.now() + HANDLER_DEADLINE_MS;
    let delay = INITIAL_POLL_INTERVAL_MS;
    let pollResult: Response | null = null;

    while (Date.now() < deadline) {
      await wait(delay);
      const pollUrl = `${spaceBase}/gradio_api/call/infer/${eventId}`;
      const pollResponse = await fetch(pollUrl, { method: "GET" });

      if (pollResponse.status === 404) {
        pollResult = pollResponse;
        delay = Math.min(Math.round(delay * BACKOFF_MULTIPLIER), MAX_POLL_INTERVAL_MS);
        continue;
      }

      if (pollResponse.ok) {
        pollResult = pollResponse;
        break;
      }

      const text = await pollResponse.text();
      return jsonResponse(pollResponse.status, {
        error: `Space GET ${pollResponse.status} ${pollResponse.statusText}`.trim(),
        details: truncate(text),
      });
    }

    if (!pollResult || !pollResult.ok) {
      return jsonResponse(504, { error: "Space result timeout" });
    }

    const resultText = await pollResult.text();
    let resultPayload: unknown = null;
    try {
      resultPayload = resultText ? JSON.parse(resultText) : null;
    } catch {
      resultPayload = resultText;
    }

    if (resultPayload && typeof resultPayload === "object") {
      const errorMessage = (resultPayload as Record<string, unknown>).error;
      if (typeof errorMessage === "string" && errorMessage.trim()) {
        const serialized = JSON.stringify(resultPayload) ?? "";
        return jsonResponse(502, {
          error: `Space error: ${errorMessage.trim()}`,
          details: truncate(serialized),
        });
      }
    }

    const imageDataUrl = extractImageDataUrl(resultPayload, spaceBase);
    if (!imageDataUrl) {
      const detailSource =
        typeof resultPayload === "string"
          ? resultPayload
          : JSON.stringify(resultPayload);
      return jsonResponse(502, {
        error: "Space result missing image",
        details: truncate(detailSource ?? ""),
      });
    }

    const responseBody: JsonBody = { imageDataUrl };
    if (resultPayload && typeof resultPayload === "object" && resultPayload !== null) {
      responseBody.raw = resultPayload;
    }

    return jsonResponse(200, responseBody);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return jsonResponse(500, { error: message });
  }
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function toHfSubdomain(raw: string) {
  const url = new URL(raw);
  if (url.hostname.endsWith(".hf.space")) {
    return `https://${url.hostname}`;
  }

  if (url.hostname === "huggingface.co") {
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts[0] !== "spaces" || parts.length < 3) {
      throw new Error(
        "HUGGINGFACE_SPACE_URL must be like https://huggingface.co/spaces/<org>/<space>",
      );
    }
    const org = parts[1];
    const space = parts[2];
    return `https://${org}-${space}.hf.space`;
  }

  throw new Error(
    "Unsupported Hugging Face Space URL. Use https://huggingface.co/spaces/<org>/<space> or https://<org>-<space>.hf.space",
  );
}

function extractImageDataUrl(source: unknown, spaceBase: string): string | undefined {
  if (typeof source === "string") {
    return normalizeImageReference(source, spaceBase);
  }

  if (Array.isArray(source)) {
    for (const item of source) {
      const result = extractImageDataUrl(item, spaceBase);
      if (result) {
        return result;
      }
    }
    return undefined;
  }

  if (source && typeof source === "object") {
    const record = source as Record<string, unknown>;

    const directKeys: Array<keyof typeof record> = [
      "imageDataUrl",
      "image",
      "url",
      "name",
      "data",
      "value",
    ];

    for (const key of directKeys) {
      const value = record[key];
      if (typeof value === "string") {
        const normalized = normalizeImageReference(value, spaceBase);
        if (normalized) {
          return normalized;
        }
      }
    }

    const nestedKeys: Array<keyof typeof record> = [
      "raw",
      "data",
      "value",
      "output",
      "outputs",
      "result",
      "images",
    ];

    for (const key of nestedKeys) {
      const nested = record[key];
      if (nested && typeof nested !== "string") {
        const result = extractImageDataUrl(nested, spaceBase);
        if (result) {
          return result;
        }
      }
    }
  }

  return undefined;
}

function normalizeImageReference(value: string, spaceBase: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  const withoutFilePrefix = trimmed.replace(/^file=*/, "").trim();
  if (!withoutFilePrefix) {
    return undefined;
  }

  if (withoutFilePrefix.startsWith("data:image/")) {
    return withoutFilePrefix;
  }

  if (/^https?:\/\//i.test(withoutFilePrefix)) {
    return withoutFilePrefix;
  }

  const path = withoutFilePrefix.startsWith("/")
    ? withoutFilePrefix
    : `/${withoutFilePrefix}`;

  try {
    return new URL(path, spaceBase).toString();
  } catch {
    return undefined;
  }
}

function jsonResponse(statusCode: number, body: JsonBody) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(body),
  };
}

function truncate(value: string, maxLength = 500) {
  if (!value) {
    return value;
  }
  return value.length > maxLength ? `${value.slice(0, maxLength)}…` : value;
}

function toNumber(value: unknown, fallback: number) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return fallback;
}
