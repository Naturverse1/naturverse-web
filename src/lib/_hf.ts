// src/lib/_hf.ts
export function getSpaceBase(): string {
  const url =
    process.env.HF_SPACE_URL ||
    process.env.HUGGINGFACE_SPACE_URL ||
    "";
  if (!url) throw new Error("HF_SPACE_URL is not set");
  // normalize: strip trailing slash
  return url.replace(/\/+$/, "");
}

export type GradioFile =
  | { url?: string; path?: string; base64?: string; [k: string]: any }
  | string; // some Spaces return string URL

export function extractImageUrl(base: string, out: any): string | null {
  // out can be: single object, array of objects, tuple, etc.
  const candidates: GradioFile[] = Array.isArray(out) ? out : [out];

  for (const item of candidates) {
    if (item == null) continue;

    if (typeof item === "string") {
      if (item.startsWith("http")) return item;
      if (item.startsWith("/")) return `${base}/gradio_api/file=${item}`;
      // data URL
      if (item.startsWith("data:")) return item;
      continue;
    }

    if (typeof item === "object") {
      if (item.url && typeof item.url === "string") return item.url;
      if (item.base64 && typeof item.base64 === "string")
        return `data:image/png;base64,${item.base64}`;
      if (item.path && typeof item.path === "string") {
        // HF returns /tmp/gradio/.... Use the Space file gateway
        return `${base}/gradio_api/file=${item.path}`;
      }
      // Some Spaces nest the file under {"data":[...]} etc.
      if ("data" in item) {
        const nested = extractImageUrl(base, (item as any).data);
        if (nested) return nested;
      }
    }
  }

  return null;
}

// Helper: try both result endpoints (query & path)
export function resultUrls(base: string, eventId: string): string[] {
  return [
    `${base}/gradio_api/call/result?event_id=${encodeURIComponent(eventId)}`,
    `${base}/gradio_api/call/result/${encodeURIComponent(eventId)}`,
  ];
}
