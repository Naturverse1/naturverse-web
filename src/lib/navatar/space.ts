// Helper used by the Navatar Generate page to call the Netlify function
// that proxies our Hugging Face Space. Converts the returned data URL
// into a File so the existing save flow continues to work.
export type GenerateNavatarOptions = {
  seed?: number;
  width?: number;
  height?: number;
  onBrand?: boolean;
};

export async function generateNavatar(
  prompt: string,
  seed?: number,
  options: Omit<GenerateNavatarOptions, "seed"> = {}
) {
  const { width = 1024, height = 1024, onBrand } = options;

  const r = await fetch("/.netlify/functions/ai-generate", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      prompt,
      seed,
      width,
      height,
      ...(typeof onBrand === "boolean" ? { onBrand } : {}),
    }),
  });

  if (!r.ok) {
    throw new Error((await r.text()) || "Navatar generate failed");
  }

  const data = (await r.json()) as {
    imageDataUrl?: string;
    seed?: number;
    errors?: string[];
  };

  if (!data?.imageDataUrl) {
    const message = data?.errors?.length ? data.errors.join(", ") : "Navatar generate failed";
    throw new Error(message);
  }

  const res = await fetch(data.imageDataUrl);
  const blob = await res.blob();
  const safeSeed = typeof data.seed === "number" ? data.seed : undefined;
  const filenameSeed = safeSeed ?? Date.now();
  const file = new File([blob], `navatar-${filenameSeed}.png`, { type: "image/png" });

  return { file, seed: safeSeed, imageDataUrl: data.imageDataUrl };
}
