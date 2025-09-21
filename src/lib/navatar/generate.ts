export type GenerateOptions = {
  prompt: string;
  avoid?: string;
  keepSeed?: boolean;
  seed?: number;
  onBrand?: boolean;
  stylePreset?: string;
};

export async function generateWithNaturverseAI(opts: GenerateOptions): Promise<Blob> {
  const res = await fetch("/.netlify/functions/ai-generate", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "image/png" },
    body: JSON.stringify(opts),
  });

  const ct = res.headers.get("content-type") || "";
  if (!res.ok) {
    const raw = await res.text();
    throw new Error(raw || `HTTP ${res.status}`);
  }
  if (!ct.includes("image")) {
    const raw = await res.text();
    throw new Error(raw || "No image returned");
  }
  return await res.blob();
}
