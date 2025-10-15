import { jsonPost } from "../jsonPost";
import { providerEndpoint, type Provider } from "./providers";

type GenerateRequest = {
  provider: Provider;
  prompt: string;
  size?: number;
  model?: string;
};

type ImageResponse = {
  imageUrl: string;
  provider: Provider;
};

export async function generateImage({ provider, prompt, size, model }: GenerateRequest): Promise<ImageResponse> {
  const endpoint = providerEndpoint(provider);
  const payload: Record<string, unknown> = { prompt };
  if (typeof size === "number" && Number.isFinite(size)) {
    payload.size = size;
  }
  if (typeof model === "string" && model.trim().length > 0) {
    payload.model = model.trim();
  }

  const result = await jsonPost<ImageResponse>(endpoint, payload);

  if (!result || typeof result.imageUrl !== "string" || result.imageUrl.length === 0) {
    throw new Error("invalid_image_response");
  }

  return {
    imageUrl: result.imageUrl,
    provider: result.provider ?? provider,
  };
}
