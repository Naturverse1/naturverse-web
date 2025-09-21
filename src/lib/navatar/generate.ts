export type GenerateOpts = {
  prompt: string;
  onBrand?: boolean;
  seed?: number;
  keepSeed?: boolean;
};

export async function generateWithHF(opts: GenerateOpts): Promise<string> {
  const res = await fetch("/.netlify/functions/ai-generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(opts),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || !data?.ok) {
    const msg = data?.error || `HTTP ${res.status}`;
    const raw = data?.raw;
    throw new Error(raw ? `${msg}: ${raw}` : msg);
  }

  return data.image as string;
}
