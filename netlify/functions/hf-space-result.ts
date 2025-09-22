import type { Handler } from "@netlify/functions";
import { getSpaceBaseUrl, hfFetch } from "./_hf";

type SpaceResult = {
  imageDataUrl: string | null;
  raw: unknown;
};

export const handler: Handler = async (event) => {
  try {
    const id = event.queryStringParameters?.id;
    if (!id) {
      return jsonResponse(400, { error: "Missing id" });
    }

    const response = await hfFetch(`/gradio_api/call/infer/${encodeURIComponent(id)}`, {
      method: "GET",
      retries: 0,
    });

    const json = await response.json();
    const base = getSpaceBaseUrl();
    const normalized = appendImageData(json, base);
    return jsonResponse(200, normalized);
  } catch (error: any) {
    return jsonResponse(500, { error: String(error?.message || error) });
  }
};

function appendImageData(raw: any, baseUrl: string) {
  const payload = raw?.data?.data ?? raw?.data;
  const imageDataUrl = extractImageData(payload, baseUrl);

  if (raw && typeof raw === "object") {
    return { ...raw, imageDataUrl };
  }

  const fallback: SpaceResult = { imageDataUrl, raw };
  return fallback;
}

function extractImageData(data: unknown, baseUrl: string): string | null {
  if (!Array.isArray(data)) {
    return null;
  }

  for (const item of data) {
    const image = resolveImageItem(item, baseUrl);
    if (image) {
      return image;
    }
  }

  return null;
}

function resolveImageItem(item: unknown, baseUrl: string): string | null {
  if (typeof item === "string") {
    return normalizePotentialImage(item, baseUrl);
  }

  if (item && typeof item === "object") {
    const candidate =
      getString((item as Record<string, unknown>).imageDataUrl) ||
      getString((item as Record<string, unknown>).url) ||
      getString((item as Record<string, unknown>).path) ||
      getString((item as Record<string, unknown>).name) ||
      getString((item as Record<string, unknown>).data);

    if (candidate) {
      return normalizePotentialImage(candidate, baseUrl);
    }
  }

  return null;
}

function normalizePotentialImage(value: string, baseUrl: string): string | null {
  if (!value) {
    return null;
  }

  if (value.startsWith("data:image/")) {
    return value;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  if (value.startsWith("file=")) {
    const suffix = value.replace(/^file=*/, "").replace(/^\/+/, "");
    return `${baseUrl}/${suffix}`;
  }

  return null;
}

function getString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function jsonResponse(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(body),
  };
}
