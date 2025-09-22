const RAW_ENV =
  process.env.HF_SPACE_URL || process.env.HUGGINGFACE_SPACE_URL || "";

function normalizeSpaceUrl(u: string): string {
  if (!u) return "";
  let url = u.trim().replace(/\/+$/, "");
  const m = url.match(/^https:\/\/huggingface\.co\/spaces\/([^/]+)\/([^/]+)$/i);
  if (m) {
    const org = m[1];
    const space = m[2];
    url = `https://${org}-${space}.hf.space`;
  }
  if (!/^https:\/\/.+\.hf\.space$/i.test(url)) {
    throw new Error(
      `Invalid HF Space URL: "${u}". Expected https://<org>-<space>.hf.space`
    );
  }
  return url;
}

export const HF_SPACE_HOST = normalizeSpaceUrl(RAW_ENV);

export async function fetchWithRetry(
  input: RequestInfo | URL,
  init: RequestInit = {},
  tries = 4,
  baseDelayMs = 800
): Promise<Response> {
  let lastErr: unknown;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(input, init);
      if (res.ok) return res;
      if (res.status >= 500) throw new Error(`HTTP ${res.status}`);
      return res;
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, baseDelayMs * (i + 1)));
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

export async function safeText(res: Response) {
  try {
    return await res.text();
  } catch {
    return "";
  }
}
