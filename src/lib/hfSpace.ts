export type GenerateRequest = {
  prompt: string;
  negative?: string;
  seed?: number;
  width?: number;
  height?: number;
  steps?: number;
};

export type GenerateResponse =
  | { ok: true; imageUrl: string; seed?: number }
  | { ok: false; message: string };

export async function requestFromSpace(req: GenerateRequest): Promise<GenerateResponse> {
  try {
    const response = await fetch("/.netlify/functions/hf-space", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });

    if (!response.ok) {
      let message = `Request failed: ${response.status}`;
      try {
        const payload = await response.json();
        const normalized = normalizeError(payload);
        if (normalized) {
          message = normalized;
        }
      } catch (error) {
        // Ignore JSON parse errors; fall back to status-based message.
      }
      return { ok: false, message };
    }

    const data = await response.json();
    const imageUrl = extractImageUrl(data);

    if (imageUrl) {
      const seed = typeof data?.seed === "number" ? data.seed : undefined;
      return { ok: true, imageUrl, seed };
    }

    const message =
      normalizeError(data) ||
      (typeof data?.error === "string" && data.error) ||
      "Space result failed";

    return { ok: false, message };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Network error";
    return { ok: false, message };
  }
}

function extractImageUrl(data: any): string | undefined {
  if (typeof data?.imageUrl === "string" && data.imageUrl) {
    return data.imageUrl;
  }
  if (typeof data?.imageDataUrl === "string" && data.imageDataUrl) {
    return data.imageDataUrl;
  }
  return undefined;
}

function normalizeError(data: any): string | undefined {
  if (!data) return undefined;
  if (typeof data.error === "string" && data.error) {
    return data.error;
  }
  if (Array.isArray(data.errors) && data.errors.length > 0) {
    const messages = data.errors.filter((item: unknown): item is string => typeof item === "string");
    return messages.join(", ") || undefined;
  }
  return undefined;
}
