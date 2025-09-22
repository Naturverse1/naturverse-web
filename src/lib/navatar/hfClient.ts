type StartResponse = { eventId: string };
type PollResponse = {
  status?: string;
  json: any;
  outputs?: any;
  error?: string;
};

type BuildGradioData = unknown;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function extractImageUrlFromOutputs(outputs: any): string | null {
  if (!outputs) return null;

  const first = Array.isArray(outputs) ? outputs[0] : outputs;
  const candidate =
    first?.url ||
    first?.path ||
    first?.data?.[0]?.url ||
    first?.data?.url ||
    null;

  if (typeof candidate === "string") {
    return candidate;
  }

  const b64 = first?.data?.[0]?.value || first?.value || null;
  if (typeof b64 === "string" && b64.startsWith("data:image")) {
    return b64;
  }

  return null;
}

export async function startGeneration(gradioData: BuildGradioData): Promise<string> {
  const res = await fetch("/.netlify/functions/hf-space", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: gradioData }),
  });

  const json = (await res.json().catch(() => ({}))) as Partial<StartResponse> & { error?: string };

  if (!res.ok) {
    const message = typeof json?.error === "string" && json.error ? json.error : "Failed to start Space job";
    throw new Error(message);
  }

  if (!json?.eventId) {
    throw new Error("Space did not return eventId");
  }

  return json.eventId;
}

export async function pollForImage(eventId: string): Promise<string> {
  let delay = 1000;
  const deadline = Date.now() + 60_000;

  while (Date.now() < deadline) {
    const res = await fetch(`/.netlify/functions/hf-space-result?eventId=${encodeURIComponent(eventId)}`);
    const json = (await res.json().catch(() => ({}))) as PollResponse;

    if (!res.ok) {
      const message =
        typeof json?.error === "string" && json.error
          ? json.error
          : typeof json?.status === "string" && json.status
          ? json.status
          : "Poll failed";
      throw new Error(message);
    }

    const status = (json.status || "").toLowerCase();
    if (status.includes("complete") || status.includes("finished")) {
      const url = extractImageUrlFromOutputs(json.outputs ?? json.json);
      if (url) {
        return url;
      }
      throw new Error("Completed but no image URL in outputs");
    }

    if (status.includes("error") || status.includes("failed")) {
      const detail = json.json?.error || json.json?.detail || json.error;
      throw new Error(typeof detail === "string" && detail ? detail : "Space reported an error");
    }

    await sleep(delay);
    delay = Math.min(delay + 500, 3500);
  }

  throw new Error("Generation timed out — please try again.");
}
