export type SubmitPayload = {
  prompt: string;
  negative_prompt?: string;
  seed?: number;
  randomize_seed?: boolean;
  width?: number;
  height?: number;
  guidance_scale?: number;
  num_inference_steps?: number;
};

type PollResult =
  | { status: "pending" }
  | { status: "done"; imageUrl: string }
  | { status: "error"; error: string };

type GenerateOptions = {
  onTick?: (attempt: number) => void;
  intervalMs?: number;
  maxTries?: number;
};

const DEFAULT_INTERVAL_MS = 1500;
const DEFAULT_MAX_TRIES = 120;

async function submitToSpace(payload: SubmitPayload): Promise<string> {
  const res = await fetch("/.netlify/functions/hf-space", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json?.ok) {
    const message = typeof json?.error === "string" ? json.error : "Hugging Face Space error";
    throw new Error(message);
  }

  const eventId = typeof json.eventId === "string" ? json.eventId : undefined;
  if (!eventId) {
    throw new Error("No eventId returned from Space");
  }

  return eventId;
}

async function pollSpace(eventId: string): Promise<PollResult> {
  try {
    const res = await fetch(`/.netlify/functions/hf-space-result?eventId=${encodeURIComponent(eventId)}`, {
      method: "GET",
      headers: {
        "cache-control": "no-store",
        Accept: "application/json",
      },
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      const message = typeof json?.error === "string" ? json.error : `Space poll failed (${res.status})`;
      return { status: "error", error: message };
    }

    if (json?.status === "done" && typeof json.imageUrl === "string" && json.imageUrl) {
      return { status: "done", imageUrl: json.imageUrl };
    }

    if (json?.status === "pending") {
      return { status: "pending" };
    }

    if (typeof json?.error === "string" && json.error) {
      return { status: "error", error: json.error };
    }

    return { status: "pending" };
  } catch (error) {
    return { status: "pending" };
  }
}

export async function generateWithHuggingFace(
  payload: SubmitPayload,
  options: GenerateOptions = {}
): Promise<string> {
  if (!payload?.prompt?.trim()) {
    throw new Error("Describe your Navatar first");
  }

  const eventId = await submitToSpace(payload);
  const interval = options.intervalMs ?? DEFAULT_INTERVAL_MS;
  const maxTries = options.maxTries ?? DEFAULT_MAX_TRIES;

  for (let attempt = 0; attempt < maxTries; attempt++) {
    const result = await pollSpace(eventId);

    if (result.status === "done") {
      return result.imageUrl;
    }

    if (result.status === "error") {
      throw new Error(result.error);
    }

    options.onTick?.(attempt + 1);

    if (attempt < maxTries - 1) {
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  }

  throw new Error("Generation timed out");
}
