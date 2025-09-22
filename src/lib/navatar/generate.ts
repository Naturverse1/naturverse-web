const POLL_START_DELAY_MS = 1200;
const POLL_MAX_DELAY_MS = 3500;
const POLL_MAX_TRIES = 160;
const GENERIC_PENDING_MESSAGE = "Space is still working—please try again in a moment.";

export async function generateWithHuggingFace(prompt: string): Promise<string> {
  const response = await fetch("/.netlify/functions/hf-space", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ prompt }),
  }).catch(() => null);

  if (!response) {
    throw new Error("Hugging Face Space error");
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload?.ok === false) {
    const message = pickErrorMessage(payload) ?? "Hugging Face Space error";
    throw new Error(message);
  }

  const directImage = pickImageFromPayload(payload);
  const status = typeof payload?.status === "string" ? payload.status.toLowerCase() : undefined;
  if (directImage && (!status || status === "done")) {
    return directImage;
  }

  const eventId = extractEventId(payload);
  if (eventId) {
    return pollForImage(eventId);
  }

  if (directImage) {
    return directImage;
  }

  throw new Error(pickErrorMessage(payload) ?? GENERIC_PENDING_MESSAGE);
}

async function pollForImage(eventId: string): Promise<string> {
  let delay = POLL_START_DELAY_MS;

  for (let attempt = 0; attempt < POLL_MAX_TRIES; attempt += 1) {
    const response = await fetch(
      `/.netlify/functions/hf-space-result?eventId=${encodeURIComponent(eventId)}`,
      {
        method: "GET",
        headers: { "cache-control": "no-store" },
      }
    ).catch(() => null);

    if (response?.ok) {
      const payload = await response.json().catch(() => ({}));
      if (payload?.ok === false) {
        const message = pickErrorMessage(payload);
        if (message) {
          throw new Error(message);
        }
      }

      const image = pickImageFromPayload(payload);
      const status = typeof payload?.status === "string" ? payload.status.toLowerCase() : undefined;
      if (image && (!status || status === "done")) {
        return image;
      }
    }

    await wait(delay);
    delay = Math.min(POLL_MAX_DELAY_MS, Math.round(delay * 1.25));
  }

  throw new Error(GENERIC_PENDING_MESSAGE);
}

function pickImageFromPayload(payload: any): string | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const directFields = [payload.imageUrl, payload.imageDataUrl];
  for (const field of directFields) {
    if (typeof field === "string" && field.trim()) {
      return field.trim();
    }
  }

  if (Array.isArray(payload.data)) {
    for (const entry of payload.data) {
      const result = extractImageFromEntry(entry);
      if (result) return result;
    }
  }

  return null;
}

function extractImageFromEntry(entry: any): string | null {
  if (!entry) return null;
  if (typeof entry === "string" && entry.trim()) {
    const trimmed = entry.trim();
    if (/^data:image\//i.test(trimmed) || /^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }
  }
  if (typeof entry === "object") {
    if (typeof entry.url === "string" && entry.url.trim()) {
      return entry.url.trim();
    }
    if (typeof entry.data === "string" && entry.data.trim()) {
      const trimmed = entry.data.trim();
      if (/^data:image\//i.test(trimmed)) {
        return trimmed;
      }
      return `data:image/png;base64,${trimmed}`;
    }
  }
  return null;
}

function extractEventId(payload: any): string | undefined {
  if (!payload || typeof payload !== "object") return undefined;
  const keys = ["eventId", "event_id", "id", "queue_id", "queueId"];
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  if (payload.event && typeof payload.event === "object") {
    const nested = extractEventId(payload.event);
    if (nested) return nested;
  }
  return undefined;
}

function pickErrorMessage(payload: any): string | null {
  if (!payload || typeof payload !== "object") return null;
  const candidates: unknown[] = [
    payload.error,
    Array.isArray(payload.errors) && payload.errors.length > 0 ? payload.errors[0] : undefined,
    payload.message,
    payload.detail,
  ];
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }
  return null;
}

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
