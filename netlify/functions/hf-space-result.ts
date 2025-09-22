import type { Handler } from "@netlify/functions";

const getSpaceBase = () => {
  const raw = process.env.HF_SPACE_URL || process.env.HUGGINGFACE_SPACE_URL || "";
  return raw.replace(/\/+$/, "");
};

const json = (statusCode: number, data: unknown) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  },
  body: JSON.stringify(data),
});

const normalizeImage = (value: unknown, space: string): string | null => {
  if (!value) return null;
  if (typeof value === "string") {
    if (value.startsWith("data:image/")) return value;
    if (/^https?:\/\//i.test(value)) return value;
    if (value.startsWith("file=")) {
      const path = value.replace(/^file=*/, "").replace(/^\/+/, "");
      return `${space}/${path}`;
    }
    if (value.startsWith("/")) {
      return `${space}${value}`;
    }
    return null;
  }
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    const candidates = [record.url, record.data, record.image, record.name];
    for (const candidate of candidates) {
      if (typeof candidate === "string") {
        const normalized = normalizeImage(candidate, space);
        if (normalized) {
          return normalized;
        }
      }
    }
  }
  return null;
};

const extractImageUrl = (payload: unknown, space: string): string | null => {
  if (!payload || typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;
  const data = record.data;
  if (!Array.isArray(data) || data.length === 0) return null;
  return normalizeImage(data[0], space);
};

export const handler: Handler = async (event) => {
  try {
    const SPACE = getSpaceBase();
    if (!SPACE) {
      return json(500, { error: "HF_SPACE_URL not set" });
    }
    const id = event.queryStringParameters?.id;
    if (!id) return json(400, { error: "Missing id" });

    const deadline = Date.now() + 25_000;
    let lastText = "";
    while (Date.now() < deadline) {
      const res = await fetch(`${SPACE}/gradio_api/call/infer/${encodeURIComponent(id)}`);
      if (res.status === 200) {
        const result = await res.json().catch(() => ({}));
        const imageUrl = extractImageUrl(result, SPACE);
        if (!imageUrl) {
          return json(502, {
            error: "Unexpected Space response",
            details: JSON.stringify(result),
          });
        }
        return json(200, { imageDataUrl: imageUrl });
      }
      lastText = await res.text().catch(() => "");
      if (res.status === 202 || res.status === 204) {
        await new Promise((resolve) => setTimeout(resolve, 900));
        continue;
      }
      return json(502, {
        error: `Space result error: ${res.status} ${res.statusText}`,
        details: lastText,
      });
    }
    return json(504, { error: "Timed out waiting for Space result" });
  } catch (err: any) {
    return json(500, { error: err?.message || "Unknown error" });
  }
};
