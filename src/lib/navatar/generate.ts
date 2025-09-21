// Client helper to call the Netlify function and return a Blob
export type GenerateOptions = {
  prompt: string;
  avoid?: string;
  onBrand?: boolean;
  seed?: number;
};

export async function generateNavatar(opts: GenerateOptions): Promise<Blob> {
  const res = await fetch("/.netlify/functions/ai-generate", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "image/png" },
    body: JSON.stringify(opts),
  });

  const ct = res.headers.get("content-type") || "";
  if (!res.ok) {
    const raw = await res.text();
    throw new Error(`Navatar generate failed: ${raw}`);
  }

  if (ct.includes("application/json")) {
    const raw = await res.json().catch(() => ({}));
    throw new Error(`Navatar generate error: ${raw?.errors?.[0] || "unknown"}`);
  }

  const b64 = await res.text();
  const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  return new Blob([bytes], { type: "image/png" });
}
