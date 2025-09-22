const rawSpace =
  process.env.HF_SPACE_URL?.trim() ||
  process.env.HUGGINGFACE_SPACE_URL?.trim() ||
  "";

if (!rawSpace) {
  // We don't throw here; functions will reply with a clear error instead.
}

const norm = (u: string) =>
  u.replace(/\/+$/, ""); // strip trailing slash(es)

export function getSpaceBaseUrl(): string {
  if (!rawSpace) return "";
  // must be full https URL
  return norm(rawSpace.startsWith("http") ? rawSpace : `https://${rawSpace}`);
}

export function getBearer(): string | undefined {
  return process.env.HF_API_TOKEN || process.env.HUGGINGFACE_API_KEY || undefined;
}

/**
 * Tiny fetch with retries for transient 5xx/429 from HF.
 */
export async function retryingFetch(
  input: string,
  init: RequestInit & { retries?: number; retryDelayMs?: number } = {}
) {
  const retries = init.retries ?? 2;
  const retryDelayMs = init.retryDelayMs ?? 800;

  let lastErr: any;
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(input, init);
      if (res.status >= 500 || res.status === 429) {
        lastErr = new Error(`Upstream ${res.status}`);
      } else {
        return res;
      }
    } catch (err) {
      lastErr = err;
    }
    if (i < retries) await new Promise((r) => setTimeout(r, retryDelayMs));
  }
  throw lastErr;
}
