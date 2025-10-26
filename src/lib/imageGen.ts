export type GenProvider = 'stability' | 'deepai' | 'dicebear' | 'fallback';

export async function generateImage(
  prompt: string,
  opts?: { provider?: GenProvider }
): Promise<{ url: string; provider: GenProvider }> {
  const qs = new URLSearchParams({
    prompt,
    provider: (opts?.provider ??
      (import.meta.env.VITE_IMAGE_PROVIDER as GenProvider) ??
      'fallback') as string,
  });
  const res = await fetch(`/.netlify/functions/generate-image?${qs.toString()}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
