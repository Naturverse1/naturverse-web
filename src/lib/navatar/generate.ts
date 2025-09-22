import { fetchResult, requestGeneration } from "../hfSpaceClient";

const POLL_INTERVAL_MS = 1200;
const MAX_POLLS = 25;
const FAILURE_STATUSES = new Set(["FAILED", "CANCELLED", "ERROR"]);

export async function generateWithHuggingFace(prompt: string): Promise<string> {
  const trimmedPrompt = typeof prompt === "string" ? prompt : "";
  const generation = await requestGeneration({ prompt: trimmedPrompt });
  const eventId = extractEventId(generation);

  if (!eventId) {
    throw new Error("Space request failed: missing event id");
  }

  for (let attempt = 0; attempt < MAX_POLLS; attempt++) {
    const result = await fetchResult(eventId);

    const image = extractImageFromResult(result);
    if (image) {
      return image;
    }

    const status = getStatus(result);
    if (status && FAILURE_STATUSES.has(status)) {
      throw new Error(getErrorMessage(result) ?? "Hugging Face Space request failed");
    }

    if (status === "COMPLETE" || status === "SUCCESS") {
      throw new Error("Hugging Face Space returned no image");
    }

    await delay(POLL_INTERVAL_MS);
  }

  throw new Error("Timed out waiting for Hugging Face Space");
}

function extractEventId(raw: unknown): string | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const direct = getString((raw as Record<string, unknown>).event_id);
  if (direct) {
    return direct;
  }

  const alt = getString((raw as Record<string, unknown>).id);
  if (alt) {
    return alt;
  }

  const event = (raw as Record<string, unknown>).event;
  if (event && typeof event === "object") {
    const nestedId = getString((event as Record<string, unknown>).id);
    if (nestedId) {
      return nestedId;
    }
  }

  return null;
}

function extractImageFromResult(result: unknown): string | null {
  if (result && typeof result === "object") {
    const record = result as Record<string, unknown>;
    const direct = getString(record.imageDataUrl);
    if (direct) {
      return direct;
    }

    const payload = Array.isArray(record.data)
      ? record.data
      : Array.isArray((record.data as Record<string, unknown> | undefined)?.data)
      ? ((record.data as Record<string, unknown>).data as unknown[])
      : null;

    if (Array.isArray(payload)) {
      for (const item of payload) {
        if (typeof item === "string" && looksLikeImage(item)) {
          return item;
        }
        if (item && typeof item === "object") {
          const candidate =
            getString((item as Record<string, unknown>).imageDataUrl) ||
            getString((item as Record<string, unknown>).url) ||
            getString((item as Record<string, unknown>).data);
          if (candidate && looksLikeImage(candidate)) {
            return candidate;
          }
        }
      }
    }
  }

  return null;
}

function getStatus(result: unknown): string | undefined {
  if (result && typeof result === "object") {
    const status = (result as Record<string, unknown>).status;
    if (typeof status === "string" && status) {
      return status.toUpperCase();
    }
  }
  return undefined;
}

function getErrorMessage(result: unknown): string | undefined {
  if (result && typeof result === "object") {
    const record = result as Record<string, unknown>;
    const direct = getString(record.error) || getString(record.detail);
    if (direct) {
      return direct;
    }

    const eventError =
      record.event && typeof record.event === "object"
        ? getString((record.event as Record<string, unknown>).error)
        : undefined;
    if (eventError) {
      return eventError;
    }

    const dataError =
      record.data && typeof record.data === "object"
        ? getString((record.data as Record<string, unknown>).error)
        : undefined;
    if (dataError) {
      return dataError;
    }
  }

  return undefined;
}

function looksLikeImage(value: string) {
  return value.startsWith("data:image/") || /^https?:\/\//i.test(value);
}

function getString(value: unknown): string | null {
  return typeof value === "string" && value ? value : null;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
