import { getSelectedProvider, haveDeepAI, haveStability } from "./providers";

type GenOpts = { prompt: string; size?: number };

type ProviderName = "deepai" | "stability";

type GeneratedImage = { url: string; provider: ProviderName };

async function callImageFunction(provider: ProviderName, { prompt, size = 1024 }: GenOpts): Promise<GeneratedImage> {
  const payload = {
    provider,
    prompt,
    size: `${Math.max(256, Math.min(2048, Math.floor(size)))}x${Math.max(256, Math.min(2048, Math.floor(size)))}`,
  };

  const response = await fetch("/.netlify/functions/image-generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = typeof data?.error === "string" ? data.error : `http_${response.status}`;
    throw new Error(`${provider}:${detail}`);
  }

  const imageUrl = typeof data?.imageUrl === "string" ? data.imageUrl : null;
  if (!imageUrl) {
    throw new Error(`${provider}:no-image`);
  }

  return { url: imageUrl, provider };
}

export async function generateImage(opts: GenOpts): Promise<GeneratedImage> {
  const primary = getSelectedProvider();
  const order: ProviderName[] = primary === "deepai" ? ["deepai", "stability"] : ["stability", "deepai"];
  const available = order.filter((provider) => (provider === "deepai" ? haveDeepAI() : haveStability()));

  if (available.length === 0) {
    throw new Error("no-provider-available");
  }

  let lastError: unknown = null;
  for (const provider of available) {
    try {
      return await callImageFunction(provider, opts);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("generation_failed");
}
