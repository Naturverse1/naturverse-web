/* cjs because prebuild runs in Node */
const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();
const SRC = path.join(ROOT, 'public', 'navatars');
const OUT = path.join(ROOT, 'src', 'data', 'navatar-canon.json');

const title = (s) =>
  s
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());

if (!fs.existsSync(SRC)) {
  console.warn('No /public/navatars');
  process.exit(0);
}

const list = fs
  .readdirSync(SRC)
  .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
  .map((f) => ({
    id: f.replace(/\.[^.]+$/, ''),
    name: title(f.replace(/\.[^.]+$/, '')),
    path: `/navatars/${f}`,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(list, null, 2));
console.log(`Wrote ${list.length} entries to ${OUT}`);
