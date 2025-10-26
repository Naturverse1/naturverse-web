// Normalizes a base URL for Hugging Face Spaces.
// - removes accidental double "https://https://"
// - trims whitespace
// - strips trailing slashes
export function normalizeSpaceUrl(raw?: string): string | null {
  if (!raw) return null;
  let url = raw.trim();

  // collapse duplicate protocols (https://https://…)
  url = url.replace(/^https?:\/\/https?:\/\//i, "https://");

  // if someone pasted the API path, keep only the base space URL
  url = url.replace(/\/gradio_api\/.*$/i, "");

  // no trailing slash
  url = url.replace(/\/+$/, "");

  return url || null;
}
