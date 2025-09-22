// Shared utilities for Hugging Face Spaces

const SPACE_ENV_KEYS = ["HF_SPACE_URL", "HUGGINGFACE_SPACE_URL"];

/**
 * Return a normalized Space base URL, always the .hf.space host and no trailing slash.
 * Accepts either:
 *  - https://org-space.hf.space
 *  - https://huggingface.co/spaces/org/space
 */
function getSpaceBase() {
  let raw = null;
  for (const k of SPACE_ENV_KEYS) {
    if (process.env[k]) {
      raw = process.env[k];
      break;
    }
  }
  if (!raw) {
    throw new Error("Missing HF_SPACE_URL (or HUGGINGFACE_SPACE_URL) env variable.");
  }
  raw = raw.trim().replace(/\/+$/, "");

  // Convert huggingface.co/spaces/org/space -> org-space.hf.space
  const m = raw.match(/^https?:\/\/huggingface\.co\/spaces\/([^/]+)\/([^/]+)$/i);
  if (m) {
    const host = `${m[1]}-${m[2]}.hf.space`;
    return `https://${host}`;
  }

  // If it already looks like org-space.hf.space, keep it
  if (/\.hf\.space$/i.test(new URL(raw).host)) return raw;

  // Otherwise just trust it (user may already provide the proper host)
  return raw;
}

/**
 * Build the Space REST endpoints we need.
 */
function endpoints() {
  const base = getSpaceBase();
  return {
    base,
    callInfer: `${base}/gradio_api/call/infer`,
    // Spaces vary in which "result" URL they expose; we support both shapes:
    resultQuery: (eventId) => `${base}/gradio_api/call/result?event_id=${encodeURIComponent(eventId)}`,
    resultPath: (eventId) => `${base}/gradio_api/call/result/${encodeURIComponent(eventId)}`,
    fileFromTmpPath: (tmpPath) => `${base}/file=${tmpPath}`,
  };
}

/**
 * Parse a Space "complete" event payload. Handles:
 *  - data as object { url | path | base64 }
 *  - data as array  [ { url | path | base64 }, ... ]
 * Returns { imageUrl, source } or throws.
 */
function extractImageUrl(completeData, toFileUrl) {
  const pick = (obj) => {
    if (!obj || typeof obj !== "object") return null;
    if (obj.url) return { imageUrl: obj.url, source: "url" };
    if (obj.path) return { imageUrl: toFileUrl(obj.path), source: "path" };
    if (obj.base64) return { imageUrl: `data:image/png;base64,${obj.base64}`, source: "base64" };
    return null;
  };

  if (Array.isArray(completeData)) {
    for (const it of completeData) {
      const got = pick(it);
      if (got) return got;
    }
  } else {
    const got = pick(completeData);
    if (got) return got;
  }

  throw new Error(`No image fields (url/path/base64) in result: ${JSON.stringify(completeData)}`);
}

module.exports = { endpoints, extractImageUrl };
