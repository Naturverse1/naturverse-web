export function getSpaceBaseUrl(): string {
  const raw =
    process.env.HF_SPACE_URL ||
    process.env.HUGGINGFACE_SPACE_URL ||
    "";
  const value = raw.trim().replace(/\/+$/, "");

  if (!value) return "";

  const match = value.match(/^https?:\/\/huggingface\.co\/spaces\/([^/]+)\/([^/]+)$/i);
  if (match) {
    const [, org, space] = match;
    return `https://${org}-${space}.hf.space`;
  }

  return value;
}

export function getBearer(): string | null {
  const apiKey = process.env.HF_API_TOKEN || process.env.HUGGINGFACE_API_KEY || "";
  return apiKey ? `Bearer ${apiKey}` : null;
}

export async function retryingFetch(input: RequestInfo, init?: RequestInit, tries = 3): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 0; attempt < tries; attempt++) {
    try {
      const response = await fetch(input as any, init);
      if (response.status >= 500) {
        throw new Error(`HF ${response.status}`);
      }
      return response;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)));
    }
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

export async function extractImageUrl(res: Response): Promise<string | null> {
  const data = await res.json().catch(() => null);
  if (!data) return null;

  const first = data?.data?.[0];
  if (first?.url) {
    return first.url as string;
  }

  if (first?.data) {
    const b64 = String(first.data);
    return `data:image/png;base64,${b64}`;
  }

  return null;
}
