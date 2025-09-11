// Vite build-time glob of public/navatars (and nested folders like photos/)
const files = import.meta.glob('/public/navatars/**/*.{png,jpg,jpeg,webp}', {
  eager: true,
  as: 'url',
});

// Convert public URL (…/public/xyz) to served URL (/xyz)
export function listNavatarImageUrls(): string[] {
  return Object.values(files)
    .map((u) => String(u).replace(/^\/public/, ''))
    .filter((u) => !u.endsWith('/')) // guard directories
    .sort();
}
