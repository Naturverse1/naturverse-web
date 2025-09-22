// Tries to extract a single image URL or data URL from a variety of HF/Gradio responses
export function pickHFImage(payload: any): string | null {
  if (!payload) return null;

  // Case A: our Netlify function already normalized -> { imageBase64, mime }
  if (payload.imageBase64) {
    const mime = payload.mime || "image/png";
    return `data:${mime};base64,${payload.imageBase64}`;
  }

  if (typeof payload.imageDataUrl === "string" && payload.imageDataUrl) {
    return payload.imageDataUrl;
  }

  if (typeof payload.imageUrl === "string" && payload.imageUrl) {
    return payload.imageUrl;
  }

  // Case B: raw Gradio /call/infer result -> { data: [...] }
  const d = payload.data || payload.outputs || payload.output || null;

  // Sometimes it's { data: ["data:image/png;base64,...."] }
  if (Array.isArray(d)) {
    // Flatten one level if items are arrays/objects
    for (const item of d.flat?.() ?? d) {
      if (typeof item === "string" && item.startsWith("data:image/")) return item;
      if (typeof item === "string" && /^https?:\/\//.test(item)) return item;

      if (item && typeof item === "object") {
        // Common shapes
        if (typeof item.url === "string") return item.url; // { url: "https://..." }
        if (item.image && typeof item.image.url === "string") return item.image.url;
        if (typeof item.data === "string" && item.data.startsWith("data:image/")) return item.data;
        if (typeof item.base64 === "string") {
          const mime = item.mime || "image/png";
          return `data:${mime};base64,${item.base64}`;
        }
      }
    }
  }

  // Case C: some Spaces return { url: "..." } at the root
  if (typeof payload.url === "string") return payload.url;

  return null;
}

