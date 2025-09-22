export type GenerateArgs = {
  prompt: string;
  negativePrompt?: string;
  seed?: number;
  width?: number;
  height?: number;
  guidance?: number;
  steps?: number;
};

export async function startGeneration(args: GenerateArgs): Promise<string> {
  const res = await fetch("/.netlify/functions/hf-space", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  const data = (await res.json()) as { eventId?: string };
  if (!data.eventId) {
    throw new Error("Space did not return an event id");
  }

  return data.eventId;
}

export async function pollResult(eventId: string) {
  const res = await fetch(`/.netlify/functions/hf-space-result?id=${encodeURIComponent(eventId)}`);
  const text = await res.text();

  if (!res.ok) {
    throw new Error(text || `Space result error (${res.status})`);
  }

  let json: unknown = null;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      throw new Error("Invalid JSON from Space result");
    }
  }

  const image = extractImage(json);

  return { done: Boolean(image), image, raw: json };
}

export async function waitForImage(
  eventId: string,
  { timeoutMs = 120_000, intervalMs = 1_500 } = {}
): Promise<{ image: string; raw: unknown }> {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const { done, image, raw } = await pollResult(eventId);
    if (done && image) {
      return { image, raw };
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error("Timed out waiting for Space result");
}

function extractImage(json: any): string | null {
  if (!Array.isArray(json?.data)) {
    return null;
  }

  const fromDataUrl = json.data.find((item: unknown) => typeof item === "string" && item.startsWith("data:image/"));
  if (typeof fromDataUrl === "string") {
    return fromDataUrl;
  }

  const fromObject = json.data.find(
    (item: any) => item && typeof item === "object" && typeof item.url === "string"
  );
  if (fromObject) {
    return fromObject.url;
  }

  const fromImageProp = json.data.find(
    (item: any) => item && typeof item === "object" && item.image && typeof item.image.url === "string"
  );
  if (fromImageProp) {
    return fromImageProp.image.url;
  }

  return null;
}
