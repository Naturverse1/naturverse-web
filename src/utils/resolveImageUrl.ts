/**
 * Normalize product image URLs so relative, absolute, and storage-backed paths all work.
 * No binary assets required — falls back to a tiny inline SVG placeholder.
 */
const PLACEHOLDER_DATA_URI =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="640" height="480">
      <rect width="100%" height="100%" fill="#eef1f5"/>
      <g stroke="#c5cbd3" stroke-width="8" fill="none">
        <circle cx="210" cy="180" r="40" />
        <polyline points="160,360 280,260 360,320 460,240 520,300" />
      </g>
    </svg>
  `);

export function resolveImageUrl(raw?: string | null): string {
  if (!raw) return PLACEHOLDER_DATA_URI;

  const url = raw.trim();

  if (!url) return PLACEHOLDER_DATA_URI;

  // Already absolute (http/https) -> use as-is
  if (/^https?:\/\//i.test(url)) return url;

  // Supabase storage public object path (e.g. "product-art/foo.png")
  // Build an absolute URL if we detect no leading slash and no protocol.
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  if (SUPABASE_URL && !url.startsWith('/')) {
    return `${SUPABASE_URL.replace(/\/+$/, '')}/storage/v1/object/public/${url}`;
  }

  // Ensure leading slash for site-hosted assets (e.g. "images/merch/tee.jpg")
  if (!url.startsWith('/')) return `/${url}`;

  return url;
}
