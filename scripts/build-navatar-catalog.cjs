/* Scans /public/navatars for images and writes /public/navatar-catalog.json */
const fs = require('fs');
const path = require('path');

const NAVS_DIR = path.join(process.cwd(), 'public', 'navatars');
const OUT = path.join(process.cwd(), 'public', 'navatar-catalog.json');
const IMG_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);

function titleFromSlug(slug) {
  return slug
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function walk(dir, base = '') {
  const acc = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    const rel = path.join(base, entry.name);
    if (entry.isDirectory()) {
      acc.push(...walk(p, rel));
    } else if (IMG_EXTS.has(path.extname(entry.name).toLowerCase())) {
      const slug = rel.replace(/\\/g, '/');
      acc.push({
        slug,
        label: titleFromSlug(entry.name),
        src: `/navatars/${slug}`
      });
    }
  }
  return acc;
}

if (!fs.existsSync(NAVS_DIR)) {
  fs.mkdirSync(NAVS_DIR, { recursive: true });
}

const items = walk(NAVS_DIR);
fs.writeFileSync(OUT, JSON.stringify({ items }, null, 2));
console.log(`[navatar] wrote catalog with ${items.length} items to ${OUT}`);

