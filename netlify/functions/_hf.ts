export function getSpaceBaseUrl() {
  const raw =
    process.env.HF_SPACE_URL ||
    process.env.HUGGINGFACE_SPACE_URL ||
    "";

  if (!raw) throw new Error("HF_SPACE_URL not set");

  const trimmed = raw.trim().replace(/\/+$/, "");

  const match = trimmed.match(/huggingface\.co\/spaces\/([^/]+)\/([^/?#]+)/i);
  if (match) {
    const owner = match[1];
    const repo = match[2];
    return `https://${owner}-${repo}.hf.space`;
  }

  return trimmed;
}

export function getApiKey() {
  return (
    process.env.HF_API_TOKEN ||
    process.env.HUGGINGFACE_API_KEY ||
    ""
  );
}

export async function hfFetch(
  path: string,
  init: RequestInit & { retries?: number; retryDelayMs?: number } = {}
) {
  const base = getSpaceBaseUrl();
  const url = `${base}${path}`;
  const retries = init.retries ?? 2;
  const retryDelayMs = init.retryDelayMs ?? 1200;

  const headers = new Headers(init.headers || {});
  headers.set("Content-Type", "application/json");

  const key = getApiKey();
  if (key && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${key}`);
  }

  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, { ...init, headers });
      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(`${response.status} ${response.statusText} :: ${text}`);
      }
      return response;
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
      }
    }
  }

  throw lastError;
}
