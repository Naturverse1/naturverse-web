// src/lib/ai/stability.ts
// JSON-based Stability text-to-image (no multipart)

const STABILITY_URL =
  "https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image";

export async function generateStabilityPng(prompt: string): Promise<Blob> {
  const apiKey = import.meta.env.VITE_STABILITY_API_KEY as string | undefined;
  if (!apiKey) throw new Error("Missing VITE_STABILITY_API_KEY");

  const res = await fetch(STABILITY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      text_prompts: [{ text: prompt }],
      // You can tweak these to taste, these are safe defaults.
      cfg_scale: 7,
      height: 768,
      width: 768,
      steps: 30,
      samples: 1,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Stability API ${res.status}: ${text}`);
  }

  const data = await res.json();
  const b64 = data?.artifacts?.[0]?.base64;
  if (!b64) throw new Error("No image data returned from Stability");

  // Convert base64 -> Blob (PNG)
  const bytes = atob(b64);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new Blob([arr], { type: "image/png" });
}
