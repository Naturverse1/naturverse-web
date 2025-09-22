type SubmitArgs = {
  prompt: string;
  negativePrompt?: string;
  seed?: number | null;
  width?: number;
  height?: number;
  guidanceScale?: number;
  steps?: number;
};

export async function submitToHF(args: SubmitArgs): Promise<{ eventId: string }> {
  const res = await fetch("/.netlify/functions/hf-space", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
  if (!res.ok) throw new Error(`Submit failed ${res.status}`);
  const json = await res.json();
  if (!json?.eventId) throw new Error("No eventId returned");
  return { eventId: json.eventId };
}

export async function pollHF(eventId: string, opts: { maxMs?: number; intervalMs?: number } = {}) {
  const started = Date.now();
  const maxMs = opts.maxMs ?? 60_000; // 60s cap
  const intervalMs = opts.intervalMs ?? 1200;

  while (Date.now() - started < maxMs) {
    const r = await fetch(`/.netlify/functions/hf-space-result?eventId=${encodeURIComponent(eventId)}`);
    if (!r.ok) throw new Error(`Poll failed ${r.status}`);
    const json = await r.json();

    if (json.status === "done" && json.imageUrl) return json.imageUrl as string;
    if (json.status === "error") throw new Error(json.error || "Space error");

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  throw new Error("Timed out waiting for Space result");
}
