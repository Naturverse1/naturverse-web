/* Scans /public/navatars and writes src/data/navatar-canon.json */
const fs = require('fs');
const path = require('path');

const NAV_DIR = path.join(process.cwd(), 'public', 'navatars');
const OUT = path.join(process.cwd(), 'src', 'data', 'navatar-canon.json');
const ALLOWED = new Set(['.png', '.jpg', '.jpeg', '.webp']);

function titleCase(basename) {
  return basename
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, c => c.toUpperCase());
}

function scan() {
  if (!fs.existsSync(NAV_DIR)) {
    console.error(`No /public/navatars directory found at ${NAV_DIR}`);
    return [];
  }
  const files = fs.readdirSync(NAV_DIR)
    .filter(f => ALLOWED.has(path.extname(f).toLowerCase()));
  return files.map(f => {
    const base = path.basename(f, path.extname(f));
    return {
      slug: base.toLowerCase(),
      name: titleCase(base),
      src: `/navatars/${f}`
    };
  });
}

const list = scan();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({ updatedAt: new Date().toISOString(), items: list }, null, 2));
console.log(`Wrote ${list.length} canon entries to ${path.relative(process.cwd(), OUT)}`);
