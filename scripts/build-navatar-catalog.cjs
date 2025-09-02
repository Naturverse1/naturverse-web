// Scans /public/navatars and writes src/data/navatar-catalog.json
// Netlify runs this before build via "prebuild" script.
const fs = require('fs');
const path = require('path');

const PUB = path.resolve(process.cwd(), 'public', 'navatars');
const OUT = path.resolve(process.cwd(), 'src', 'data');
const OUT_FILE = path.join(OUT, 'navatar-catalog.json');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(ent => {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) return walk(p);
    const lower = ent.name.toLowerCase();
    if (!(/\.(png|jpg|jpeg|webp|svg)$/).test(lower)) return [];
    return [p];
  });
}

function slugify(name) {
  return name.toLowerCase()
    .replace(/\.(png|jpg|jpeg|webp|svg)$/,'')
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/^-+|-+$/g,'');
}

function run() {
  if (!fs.existsSync(PUB)) {
    console.warn(`[navatar] No /public/navatars directory found. Writing empty catalog.`);
  }
  const files = fs.existsSync(PUB) ? walk(PUB) : [];
  const items = files.map(abs => {
    const rel = abs.split(path.sep).join('/').split('/public/')[1]; // e.g. "navatars/turianscooter.png"
    const label = path.basename(abs).replace(/\.(png|jpg|jpeg|webp|svg)$/i,'');
    return {
      slug: slugify(label),
      label,
      // public URL under /, safe to use in <img src>
      src: `/${rel}`
    };
  });

  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify({ generatedAt: new Date().toISOString(), items }, null, 2));
  console.log(`[navatar] Wrote ${items.length} items to ${OUT_FILE}`);
}

run();
