/* eslint-disable */
const fs = require('fs');
const path = require('path');

const pub = path.resolve(__dirname, '..', 'public', 'navatars');
const out = path.resolve(__dirname, '..', 'src', 'data', 'navatar-catalog.json');

function slugify(name) {
  return name
    .replace(/\.[^.]+$/, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function main() {
  if (!fs.existsSync(pub)) {
    fs.mkdirSync(pub, { recursive: true });
  }
  const files = fs.readdirSync(pub)
    .filter(f => /\.(png|jpe?g|webp|gif|svg)$/i.test(f));

  const items = files.map(f => ({
    label: f.replace(/\.[^.]+$/, ''),            // raw name for UI
    slug: slugify(f),
    // served by Vite from public root:
    src: `/navatars/${encodeURIComponent(f)}`,
  }));

  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(items, null, 2));
  console.log(`Wrote ${items.length} navatars -> ${path.relative(process.cwd(), out)}`);
}

main();
