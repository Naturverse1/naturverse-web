export type GenerateOptions = {
  prompt: string;
  onBrand?: boolean;
  avoid?: string;
  seed?: number;
};

export async function generateNavatar(opts: GenerateOptions): Promise<string> {
  const res = await fetch("/.netlify/functions/ai-generate", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "image/png" },
    body: JSON.stringify(opts),
  });

  const ctype = res.headers.get("content-type") || "";
  if (!res.ok || !ctype.includes("image/")) {
    const raw = await res.text();
    throw new Error(raw || `Generation failed (${res.status})`);
  }

  const b64 = await res.text();
  return `data:image/png;base64,${b64}`;
}
