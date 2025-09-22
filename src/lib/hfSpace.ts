export type HFStartOptions = {
  negativePrompt?: string;
  seed?: number;
  width?: number;
  height?: number;
  steps?: number;
};

export async function startHF(prompt: string, opts?: HFStartOptions): Promise<string> {
  const res = await fetch("/.netlify/functions/hf-space-start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, ...opts }),
  });

  if (!res.ok) {
    throw new Error(`start failed: ${res.status}`);
  }

  const { event_id, error } = (await res.json()) as { event_id?: string; error?: string };
  if (!event_id) {
    throw new Error(error || "no event id");
  }
  return event_id;
}

export type HFPollResult = {
  status: "PENDING" | "DONE";
  image?: string;
  error?: string;
};

export async function pollHF(eventId: string): Promise<HFPollResult> {
  const res = await fetch(`/.netlify/functions/hf-space-result?id=${encodeURIComponent(eventId)}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`poll failed: ${res.status}`);
  }

  return (await res.json()) as HFPollResult;
}
