export function normalizeSpaceUrl(raw?: string): string {
  const v = (raw || "").trim().replace(/\/+$/, "");
  if (!v) throw new Error("HF_SPACE_URL not set");
  if (v.includes("huggingface.co/spaces/")) {
    const m = v.match(/huggingface\.co\/spaces\/([^/]+)\/([^\/?#]+)/);
    if (!m) throw new Error("Invalid Hugging Face Spaces URL");
    return `https://${m[1]}-${m[2]}.hf.space`;
  }
  return v;
}

export function getSpaceBaseUrl(): string {
  const raw = process.env.HF_SPACE_URL || process.env.HUGGINGFACE_SPACE_URL;
  return normalizeSpaceUrl(raw);
}

type ParsedResult = { imageUrl: string; seed: unknown } | null;

export async function parseGradioResult(resp: Response, spaceBase: string): Promise<ParsedResult> {
  const ct = resp.headers.get("content-type") || "";
  const body = await resp.text();

  const tryJSON = (t: string) => {
    try {
      return JSON.parse(t);
    } catch {
      return null;
    }
  };

  if (ct.includes("text/event-stream")) {
    const lines = body.split(/\r?\n/).filter((line) => line.startsWith("data: "));
    const last = lines.at(-1)?.slice(6);
    const j = last && tryJSON(last);
    if (j && Array.isArray(j.data)) return extractFromDataArray(j.data, spaceBase);
    return null;
  }

  const j = tryJSON(body);
  if (j && Array.isArray(j.data)) return extractFromDataArray(j.data, spaceBase);

  const j2 = tryJSON(body.trim());
  if (j2 && Array.isArray(j2.data)) return extractFromDataArray(j2.data, spaceBase);

  return null;
}

function extractFromDataArray(data: any[], spaceBase: string): ParsedResult {
  const img = data[0] ?? {};
  const seed = data[1];
  let imageUrl: string | null = null;

  if (typeof img.url === "string" && img.url) imageUrl = img.url;
  else if (typeof img.path === "string" && img.path) {
    const p = img.path.startsWith("/") ? img.path : `/${img.path}`;
    imageUrl = `${spaceBase}/file=${encodeURIComponent(p)}`;
  }

  if (!imageUrl) return null;
  return { imageUrl, seed };
}
