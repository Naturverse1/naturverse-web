const FUNCTION_URL = "/.netlify/functions/hf-space";

export async function generateWithHuggingFace(prompt: string): Promise<string> {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  const text = await response.text();
  let payload: unknown = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!response.ok) {
    throw new Error(buildErrorMessage(response.status, payload));
  }

  const image = extractImageFromPayload(payload);
  if (!image) {
    throw new Error("Invalid image response from Hugging Face Space");
  }

  return image;
}

function buildErrorMessage(status: number, payload: unknown): string {
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    const baseMessage =
      typeof record.error === "string" && record.error.trim()
        ? record.error.trim()
        : `HF proxy ${status}`;

    const detail =
      typeof record.details === "string" && record.details.trim()
        ? ` (${record.details.trim()})`
        : "";

    return `${baseMessage}${detail}`;
  }

  if (typeof payload === "string" && payload.trim()) {
    const snippet = payload.trim().slice(0, 200);
    return `HF proxy ${status}: ${snippet}`;
  }

  return `HF proxy ${status}`;
}

function extractImageFromPayload(payload: unknown, visited = new Set<unknown>()): string | null {
  if (!payload) {
    return null;
  }

  if (typeof payload === "string") {
    return isImageReference(payload) ? payload : null;
  }

  if (Array.isArray(payload)) {
    if (visited.has(payload)) {
      return null;
    }
    visited.add(payload);
    for (const item of payload) {
      const nested = extractImageFromPayload(item, visited);
      if (nested) {
        return nested;
      }
    }
    return null;
  }

  if (typeof payload === "object") {
    if (visited.has(payload)) {
      return null;
    }
    visited.add(payload);
    const record = payload as Record<string, unknown>;

    const directKeys: Array<keyof typeof record> = [
      "imageDataUrl",
      "image",
      "url",
      "data",
      "value",
    ];

    for (const key of directKeys) {
      const value = record[key];
      if (typeof value === "string" && isImageReference(value)) {
        return value;
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
      if (nested !== undefined) {
        const result = extractImageFromPayload(nested, visited);
        if (result) {
          return result;
        }
      }
    }
  }

  return null;
}

function isImageReference(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }
  if (trimmed.startsWith("data:image/")) {
    return true;
  }
  return /^https?:\/\//i.test(trimmed);
}
