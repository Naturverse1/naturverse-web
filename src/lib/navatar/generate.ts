export interface HuggingFaceSpaceOptions {
  negative?: string;
  width?: number;
  height?: number;
}

export async function generateWithHuggingFaceSpace(
  prompt: string,
  options?: HuggingFaceSpaceOptions
): Promise<string> {
  const trimmedPrompt = prompt.trim();
  if (!trimmedPrompt) {
    throw new Error("Prompt is required");
  }

  const payload: Record<string, unknown> = { prompt: trimmedPrompt };

  const negative = options?.negative?.trim();
  if (negative) {
    payload.negative = negative;
  }

  if (typeof options?.width === "number") {
    payload.width = options.width;
  }

  if (typeof options?.height === "number") {
    payload.height = options.height;
  }

  const response = await fetch("/.netlify/functions/generate-from-space", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  let json: any = null;

  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }
  }

  if (!response.ok) {
    const message =
      (json && typeof json?.error === "string" && json.error.trim()) ||
      text ||
      "Space request failed";
    throw new Error(message);
  }

  const base64 = typeof json?.imageBase64 === "string" ? json.imageBase64.trim() : "";
  if (!base64) {
    throw new Error("Space returned no image data");
  }

  return base64.startsWith("data:") ? base64 : `data:image/png;base64,${base64}`;
}
