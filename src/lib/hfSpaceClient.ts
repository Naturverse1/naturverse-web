export type StartPayload = {
  prompt: string;
  negative_prompt?: string;
  seed?: number;
  randomize_seed?: boolean;
  width?: number;
  height?: number;
  guidance_scale?: number;
  num_inference_steps?: number;
};

export async function startGeneration(body: StartPayload): Promise<string> {
  const res = await fetch("/api/hf-space", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  const json = await res.json();
  if (!json.eventId) throw new Error("No eventId from start.");
  return json.eventId as string;
}

type PollResult =
  | { status: "pending" }
  | { status: "complete"; imageUrl: string }
  | { status: "error"; message: string };

export async function pollResult(eventId: string): Promise<PollResult> {
  const res = await fetch(`/api/hf-space-result?eventId=${encodeURIComponent(eventId)}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    return { status: "error", message: `Result HTTP ${res.status}` };
  }
  return (await res.json()) as PollResult;
}

/** High-level helper that polls until done or timeoutMs */
export async function waitForImage(eventId: string, timeoutMs = 90000): Promise<string> {
  const start = Date.now();
  for (;;) {
    const r = await pollResult(eventId);
    if (r.status === "complete") return r.imageUrl;
    if (r.status === "error") throw new Error(r.message || "Unknown HF error");
    if (Date.now() - start > timeoutMs) throw new Error("Generation timed out.");
    await new Promise((resolve) => setTimeout(resolve, 1800));
  }
}
