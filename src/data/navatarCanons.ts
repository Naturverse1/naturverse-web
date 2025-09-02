// src/data/navatarCanons.ts
// Build-time catalog from /public/navatars. No runtime I/O.
// Any PNG/JPG/WEBP in that folder becomes a canon card automatically.

export type Canon = {
  id: string;      // slugified from filename
  title: string;   // human title from filename
  tags: string[];  // derived tags (simple split)
  url: string;     // served path
};

// Vite imports all matching assets at build time; keys are URLs like "/navatars/Foo Bar.png"
const files = import.meta.glob('/public/navatars/*.{png,jpg,jpeg,webp}', {
  eager: true,
  query: '?url',
  import: 'default'
}) as Record<string, string>;

function toTitle(name: string) {
  // keep punctuation (e.g. “Dr P”) but normalize dashes/underscores
  return name
    .replace(/\.(png|jpg|jpeg|webp)$/i, '')
    .replace(/[-_]+/g, ' ')
    .trim();
}

function toId(name: string) {
  return toTitle(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function tagsFromTitle(title: string) {
  // ultra-light tags from words (used only for fuzzy search)
  return title.toLowerCase().split(/\s+/).filter(Boolean);
}

const CANONS: Canon[] = Object.entries(files)
  .map(([key, url]) => {
    const filename = decodeURIComponent(key.split('/').pop() || 'navatar');
    const title = toTitle(filename);
    return {
      id: toId(filename),
      title,
      tags: tagsFromTitle(title),
      url, // already a public URL under /navatars/...
    };
  })
  .sort((a, b) => a.title.localeCompare(b.title));

export default CANONS;
