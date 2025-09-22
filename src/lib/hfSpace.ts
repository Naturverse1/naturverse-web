const START_ENDPOINT = "/.netlify/functions/hf-space-start";
const RESULT_ENDPOINT = "/.netlify/functions/hf-space-result";

export type StartOptions = {
  negativePrompt?: string;
  seed?: number;
  width?: number;
  height?: number;
  steps?: number;
};

export type PollResponse = {
  status: "PENDING" | "DONE";
  image?: string;
  error?: string;
};

export async function warmupHF(): Promise<void> {
  try {
    await fetch(`${RESULT_ENDPOINT}?id=wakeup`, { cache: "no-store" });
  } catch {
    // ignore warmup failures – the real generation call will surface errors
  }
}

export async function startHF(prompt: string, opts?: StartOptions): Promise<string> {
  const res = await fetch(START_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, ...opts }),
  });

  if (!res.ok) {
    throw new Error(`start failed: ${res.status}`);
  }

  const json = await res.json().catch(() => null);
  const eventId = json?.event_id;

  if (!eventId || typeof eventId !== "string") {
    const message = typeof json?.error === "string" ? json.error : "no event id";
    throw new Error(message);
  }

  return eventId;
}

export async function pollHF(eventId: string, signal?: AbortSignal): Promise<PollResponse> {
  const res = await fetch(`${RESULT_ENDPOINT}?id=${encodeURIComponent(eventId)}`, {
    cache: "no-store",
    signal,
  });

  if (!res.ok) {
    throw new Error(`poll failed: ${res.status}`);
  }

  const json = (await res.json().catch(() => null)) as PollResponse | null;
  if (!json || (json.status !== "PENDING" && json.status !== "DONE")) {
    throw new Error("Invalid poll response");
  }
  return json;
}
