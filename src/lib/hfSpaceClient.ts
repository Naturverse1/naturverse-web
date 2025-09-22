export type GenerateRequest = {
  prompt: string;
  negativePrompt?: string;
  seed?: number;
  width?: number;
  height?: number;
  guidance?: number;
  steps?: number;
};

export type SpaceResult = {
  imageDataUrl: string;
};

const parseJson = async (res: Response) => {
  try {
    return await res.json();
  } catch {
    return {} as Record<string, unknown>;
  }
};

export async function callSpace(payload: GenerateRequest) {
  const res = await fetch("/.netlify/functions/hf-space", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await parseJson(res);
  if (!res.ok) {
    const message = typeof (json as any)?.error === "string" ? (json as any).error : "Space request failed";
    const details = typeof (json as any)?.details === "string" && (json as any).details ? `\n${(json as any).details}` : "";
    throw new Error(`${message}${details}`.trim());
  }
  return json as { eventId: string };
}

export async function pollSpace(eventId: string) {
  const res = await fetch(`/.netlify/functions/hf-space-result?id=${encodeURIComponent(eventId)}`);
  const json = await parseJson(res);
  if (!res.ok) {
    const base = typeof (json as any)?.error === "string" ? (json as any).error : "Space result failed";
    const details = typeof (json as any)?.details === "string" && (json as any).details ? `\n${(json as any).details}` : "";
    throw new Error(`${base}${details}`.trim());
  }
  return json as SpaceResult;
}
