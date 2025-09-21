export type StabilityImageResponse = {
  image: string;
  seed?: number;
  finish_reason?: string;
};

export async function generateImageWithStability(
  prompt: string,
  opts?: { width?: number; height?: number }
): Promise<StabilityImageResponse> {
  const key =
    import.meta.env.VITE_STABILITY_API_KEY ||
    (typeof process !== "undefined" ? process.env.STABILITY_API_KEY : undefined);

  if (!key) {
    throw new Error("Missing STABILITY_API_KEY");
  }

  const width = opts?.width ?? 512;
  const height = opts?.height ?? 512;

  const res = await fetch("https://api.stability.ai/v2beta/stable-image/generate/core", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      prompt,
      width,
      height,
      output_format: "png",
    }),
  });

  if (!res.ok) {
    let message = `Stability error (${res.status})`;

    try {
      const errJson = await res.json();
      if (Array.isArray(errJson?.errors) && errJson.errors.length > 0) {
        message = errJson.errors.join("; ");
      } else if (typeof errJson?.message === "string" && errJson.message.trim()) {
        message = errJson.message;
      }
    } catch {
      // ignore JSON parse issues
    }

    throw new Error(message);
  }

  const data = await res.json();

  const imageBase64 =
    typeof data?.image === "string" && data.image ? data.image :
    data?.artifacts?.[0]?.base64 ??
    null;

  if (!imageBase64) {
    throw new Error("Stability returned no image data");
  }

  const seed = data?.seed ?? data?.artifacts?.[0]?.seed;

  return { image: imageBase64, seed };
}
