export type HuggingFaceNavatarPayload = {
  prompt: string;
  negative_prompt?: string;
  seed?: number;
  randomize_seed?: boolean;
  width?: number;
  height?: number;
  guidance_scale?: number;
  num_inference_steps?: number;
  [key: string]: unknown;
};

export type GenerateWithHuggingFaceOptions = {
  timeoutMs?: number;
  pollIntervalMs?: number;
};

const DEFAULT_TIMEOUT_MS = 60_000;
const DEFAULT_POLL_INTERVAL_MS = 1_500;

export async function generateWithHuggingFace(
  payload: HuggingFaceNavatarPayload,
  options: GenerateWithHuggingFaceOptions = {}
): Promise<string> {
  if (!payload || typeof payload.prompt !== "string" || !payload.prompt.trim()) {
    throw new Error("Prompt is required");
  }

  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const pollIntervalMs = options.pollIntervalMs ?? DEFAULT_POLL_INTERVAL_MS;

  // 1) submit to Netlify (fast)
  const startRes = await fetch("/.netlify/functions/hf-space", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const startJson = await startRes.json().catch(() => ({}));
  if (!startRes.ok) {
    const message =
      (startJson && typeof startJson === "object" && "error" in startJson && typeof (startJson as any).error === "string"
        ? (startJson as any).error
        : null) || "Start failed";
    throw new Error(message);
  }

  const event_id =
    startJson && typeof startJson === "object" && "event_id" in startJson
      ? (startJson as any).event_id
      : null;
  if (!event_id || typeof event_id !== "string") {
    throw new Error("Space did not return an event_id");
  }

  // 2) poll the Netlify result endpoint (which polls the Space)
  const deadline = Date.now() + timeoutMs;
  let lastErr: string | null = null;

  while (Date.now() < deadline) {
    const url = `/.netlify/functions/hf-space-result?eventId=${encodeURIComponent(event_id)}`;
    const r = await fetch(url, { method: "GET" });
    const ctype = r.headers.get("content-type") || "";
    const text = await r.text();

    if (!ctype.includes("application/json")) {
      lastErr = "Unexpected response from server";
    } else {
      try {
        const j = JSON.parse(text);
        if (j?.status === "complete") {
          if (j.imageUrl) {
            return j.imageUrl as string;
          }
          lastErr = "Completed but no image URL in response.";
        } else if (j?.error) {
          lastErr = typeof j.error === "string" ? j.error : "Generation failed";
        }
      } catch (err) {
        lastErr = "Invalid JSON response from server";
      }
    }

    await new Promise((res) => setTimeout(res, pollIntervalMs));
  }

  throw new Error(lastErr || "Generation timed out — please try again.");
}
