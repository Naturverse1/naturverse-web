export type ProviderOption =
  | "auto"
  | "openai"
  | "stability"
  | "deepai"
  | "huggingface"
  | "multiavatar";

export type GenerateNavatarParams = {
  prompt: string;
  provider: ProviderOption;
  size?: number | string;
  seed?: string | number;
};

export type GenerateNavatarResult = {
  dataUrl: string;
  provider: ProviderOption;
};

export async function generateNavatar({ prompt, provider, size, seed }: GenerateNavatarParams) {
  const res = await fetch("/.netlify/functions/image-generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, provider, size, seed }),
  });
  const data = await res.json();
  if (!res.ok || !data?.ok) {
    throw new Error(data?.error || `HTTP ${res.status}`);
  }
  return data as GenerateNavatarResult;
}
