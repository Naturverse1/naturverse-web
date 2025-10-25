export type Provider = "openai" | "stability" | "deepai" | "huggingface";

type GenerateParams = {
  prompt: string;
  size?: string;
  width?: number;
  height?: number;
};

export async function generateImage(provider: Provider, params: GenerateParams) {
  const endpointMap: Record<Provider, string> = {
    openai: "/.netlify/functions/openai-image",
    stability: "/.netlify/functions/stability-image",
    deepai: "/.netlify/functions/deepai-image",
    huggingface: "/.netlify/functions/huggingface-image",
  };

  const url = endpointMap[provider];
  const body: Record<string, unknown> = { prompt: params.prompt };

  if (provider === "openai" && params.size) {
    body.size = params.size;
  }

  if (provider === "stability") {
    body.width = params.width ?? 512;
    body.height = params.height ?? 512;
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok || !json?.ok) {
    throw new Error(json?.error || `Request failed (${provider})`);
  }

  const image = json.image_base64 || json.image_url;
  if (!image) {
    throw new Error("No image returned");
  }

  return image as string;
}
