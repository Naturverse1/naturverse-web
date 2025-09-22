// Shared HF helpers (Netlify Functions runtime)

const SPACE_ENV_KEYS = ["HF_SPACE_URL", "HUGGINGFACE_SPACE_URL"] as const;

export function getSpaceUrl(): string {
  for (const k of SPACE_ENV_KEYS) {
    const v = (process.env as any)[k];
    if (v && typeof v === "string" && v.trim()) {
      return normalizeSpaceUrl(v);
    }
  }
  throw new Error(
    "Missing HF Space URL. Set HF_SPACE_URL (preferred) or HUGGINGFACE_SPACE_URL in Netlify env vars."
  );
}

export function normalizeSpaceUrl(u: string): string {
  // Accept plain space URL or the .hf.space domain — both normalize to the human URL
  // Examples accepted:
  //   https://huggingface.co/spaces/turianmediacompany/naturverse-space
  //   https://turianmediacompany-naturverse-space.hf.space
  const trimmed = u.trim().replace(/\/+$/, "");
  if (trimmed.includes(".hf.space")) {
    // Convert subdomain form -> human form if desired; but Gradio API works on either.
    return trimmed; // Keep as-is; API paths below are relative.
  }
  // Must look like huggingface.co/spaces/owner/name
  if (!/^https?:\/\/huggingface\.co\/spaces\/[^/]+\/[^/]+$/i.test(trimmed)) {
    throw new Error(`HF Space URL looks wrong: ${u}`);
  }
  return trimmed;
}

export async function fetchWithRetry(
  url: string,
  init: RequestInit,
  { retries = 2, backoffMs = 750 }: { retries?: number; backoffMs?: number } = {}
): Promise<Response> {
  let lastErr: any;
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, init);
      if (res.ok || (res.status >= 400 && res.status < 500)) {
        return res;
      }
      lastErr = new Error(`HTTP ${res.status}`);
    } catch (e) {
      lastErr = e;
    }
    if (i < retries) await new Promise(r => setTimeout(r, backoffMs * (i + 1)));
  }
  throw lastErr;
}

export type StartResponse =
  | { ok: true; eventId: string }
  | { ok: false; error: string };

export type PollResponse =
  | { ok: true; done: true; imageUrl: string }
  | { ok: true; done: false }
  | { ok: false; error: string };

// Extract event ID from Gradio call response body (it’s usually a JSON with an id, or a
// small text line containing it). We support both typical shapes.
export async function extractEventId(res: Response): Promise<string | null> {
  const text = await res.text();
  try {
    const j = JSON.parse(text);
    // Common shapes seen:
    // { "event_id": "..."} or {"id":"..."} or {"queue": {"event_id":"..."}}
    const id =
      j?.event_id ?? j?.id ?? j?.queue?.event_id ?? j?.queue?.id ?? null;
    if (typeof id === "string" && id) return id;
  } catch {
    // not JSON; try to pull a token-like id
  }
  const m = text.match(/[a-f0-9]{8,}-[a-f0-9-]{10,}/i) || text.match(/"(\w{8,})"/);
  return m ? (m[0].replace(/"/g, "")) : null;
}
