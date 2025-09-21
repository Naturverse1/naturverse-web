export async function generateWithStability(prompt: string): Promise<Blob> {
  const resp = await fetch("/.netlify/functions/stability-generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => null);
    throw new Error(err?.detail || err?.error || `HTTP ${resp.status}`);
  }

  // Function returns image/png; fetch will give us a Blob directly
  return await resp.blob();
}
