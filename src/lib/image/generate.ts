import { jsonFetch } from "../jsonFetch";
import { providerEndpoint, type Provider } from "./providers";

type GenerateRequest = {
  provider: Provider;
  prompt: string;
  size?: number;
};

type ImageResponse = {
  imageUrl: string;
  provider: Provider;
};

export async function generateImage({ provider, prompt, size }: GenerateRequest): Promise<ImageResponse> {
  const endpoint = providerEndpoint(provider);
  const payload: Record<string, unknown> = { prompt };
  if (typeof size === "number" && Number.isFinite(size)) {
    payload.size = size;
  }

  const result = await jsonFetch<ImageResponse>(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!result || typeof result.imageUrl !== "string" || result.imageUrl.length === 0) {
    throw new Error("invalid_image_response");
  }

  return {
    imageUrl: result.imageUrl,
    provider: result.provider ?? provider,
  };
}
