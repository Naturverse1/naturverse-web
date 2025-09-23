export type HFOptions = Partial<{
  negative_prompt: string;
  width: number;
  height: number;
  num_inference_steps: number;
  guidance_scale: number;
  seed: number | null;
}>;

export async function generateWithHF(prompt: string, opts: HFOptions = {}) {
  const r = await fetch("/.netlify/functions/hf-api", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ prompt, ...opts }),
  });
  const j = await r.json();
  if (!r.ok || !j?.ok) {
    const msg = j?.error || "HF API failed";
    throw new Error(`${msg}${j?.detail ? ` — ${j.detail}` : ""}`);
  }
  return j as { dataUrl: string; mime: string; model: string };
}
