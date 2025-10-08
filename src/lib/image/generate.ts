import { jsonFetch } from "../jsonFetch";
import { providerEndpoint, type Provider } from "./providers";

type GenerateRequest = {
  provider: Provider;
  prompt: string;
  size?: number;
};

type ImageResponse = {
  imageUrl?: string;
  imageBase64?: string;
  provider?: Provider;
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

  if (!result) {
    throw new Error("invalid_image_response");
  }

  const base64 = typeof result.imageBase64 === "string" && result.imageBase64.length > 0 ? result.imageBase64 : undefined;
  const imageUrl =
    typeof result.imageUrl === "string" && result.imageUrl.length > 0
      ? result.imageUrl
      : base64
      ? `data:image/png;base64,${base64}`
      : undefined;

  if (!imageUrl) {
    throw new Error("invalid_image_response");
  }

  return {
    imageUrl,
    provider: (result.provider as Provider | undefined) ?? provider,
  };
}
