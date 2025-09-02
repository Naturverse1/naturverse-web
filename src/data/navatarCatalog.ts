// src/data/navatarCatalog.ts
// Auto-collect every image under /public/navatars on build
// Add/remove files in that folder -> redeploy -> catalog updates
const files = import.meta.glob("/public/navatars/*.{png,jpg,jpeg}", { eager: true, as: "url" });

type Canon = { key: string; title: string; tags: string[]; image_url: string };

const titleCase = (s: string) => s.replace(/[-_]/g, " ").replace(/\b\w/g, m => m.toUpperCase());

export const NAVATAR_CATALOG: Canon[] = Object.entries(files).map(([path, url]) => {
  const base = path.split("/").pop()!.replace(/\.(png|jpg|jpeg)$/i, "");
  return {
    key: base.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    title: titleCase(base),
    tags: base.split(/[-_ ]+/).map(t => t.toLowerCase()).filter(Boolean),
    image_url: url as string
  };
});
