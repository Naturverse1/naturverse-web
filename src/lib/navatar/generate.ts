export type GenerateOpts = {
  prompt: string;
  onBrand?: boolean;
  seed?: number;
  keepSeed?: boolean;
};

type SuccessResponse = {
  ok: true;
  image: string;
  provider?: string;
};

type ErrorResponse = {
  ok: false;
  error?: string;
  raw?: string;
};

type GenerateResponseBody = Record<string, unknown>;

export async function generateWithHF(opts: GenerateOpts): Promise<string> {
  const response = await fetch("/.netlify/functions/ai-generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(opts),
  });

  const data = (await response.json().catch(() => ({}))) as GenerateResponseBody;

  const errorText = typeof data.error === "string" ? data.error : undefined;
  const rawText = typeof data.raw === "string" ? data.raw : undefined;

  if (!response.ok) {
    const errorMessage = errorText || `HTTP ${response.status}`;
    throw new Error(rawText ? `${errorMessage}: ${rawText}` : errorMessage);
  }

  if (data.ok !== true) {
    const message = errorText || "Invalid response from generator";
    throw new Error(rawText ? `${message}: ${rawText}` : message);
  }

  const image = typeof data.image === "string" ? data.image : undefined;
  if (!image) {
    throw new Error("Invalid image payload from generator");
  }

  return image;
}
