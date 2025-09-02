// scripts/build-navatar-catalog.cjs
/* Build-time: read /public/navatars and write src/data/navatar-catalog.json */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'src', 'data');
const PUB = path.join(ROOT, 'public', 'navatars');

if (!fs.existsSync(PUB)) {
  console.warn('[navatar] Skipping – folder not found:', PUB);
  process.exit(0);
}

const allow = new Set(['.png', '.jpg', '.jpeg', '.webp']);
const files = fs.readdirSync(PUB).filter(f => allow.has(path.extname(f).toLowerCase()));

function toTitle(name) {
  return name
    .replace(/\.(png|jpg|jpeg|webp)$/i, '')
    .replace(/[-_]+/g, ' ')
    .trim();
}
function toSlug(name) {
  return toTitle(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const items = files.map((file) => {
  const url = `/navatars/${encodeURIComponent(file)}`;       // safe for spaces & punctuation
  const title = toTitle(file);
  return {
    id: toSlug(file),
    title,
    slug: toSlug(file),
    src: url
  };
}).sort((a,b) => a.title.localeCompare(b.title));

fs.mkdirSync(SRC, { recursive: true });
const out = path.join(SRC, 'navatar-catalog.json');
fs.writeFileSync(out, JSON.stringify(items, null, 2));
console.log(`[navatar] wrote ${items.length} items to ${out}`);

