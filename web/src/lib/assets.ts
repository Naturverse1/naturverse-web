export function assetUrlOrPlaceholder(filename?: string) {
  if (!filename) return "/avatar-placeholder.png";
  // Served from /public at runtime; 404s will not break build
  return `/attached_assets/${filename}`;
}
