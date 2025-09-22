export type GenerationParams = {
  prompt: string;
  negative_prompt?: string;
  seed?: number;
  randomize_seed?: boolean;
  width?: number;
  height?: number;
  guidance_scale?: number;
  num_inference_steps?: number;
};

export async function requestGeneration(params: GenerationParams) {
  const response = await fetch("/.netlify/functions/hf-space", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

export async function fetchResult(eventId: string) {
  const response = await fetch(
    `/.netlify/functions/hf-space-result?id=${encodeURIComponent(eventId)}`
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}
