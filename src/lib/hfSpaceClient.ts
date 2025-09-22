export type GenerateArgs = {
  prompt: string;
  negativePrompt?: string;
  seed?: number;
  width?: number;
  height?: number;
  guidance?: number;
  steps?: number;
};

type SpaceResponse = {
  image?: string;
  raw?: unknown;
  errors?: string[];
  detail?: unknown;
};

export async function generateWithSpace(args: GenerateArgs) {
  const res = await fetch("/.netlify/functions/hf-space", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });

  const text = await res.text();
  let data: SpaceResponse | null = null;

  if (text) {
    try {
      data = JSON.parse(text) as SpaceResponse;
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    if (data?.errors?.length) {
      throw new Error(String(data.errors[0]));
    }
    if (data?.detail) {
      throw new Error(String(data.detail));
    }
    throw new Error(text || `Request failed: ${res.status}`);
  }

  return data ?? {};
}
