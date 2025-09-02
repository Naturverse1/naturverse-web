// scripts/make-navatar-catalog.cjs
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const PUB = path.resolve(process.cwd(), 'public');
const SRC_DIR = path.join(PUB, 'navatars');
const OUT = path.join(PUB, 'navatar-catalog.json');

(async function run() {
  try {
    if (!fs.existsSync(SRC_DIR)) {
      console.log('[navatar] no /public/navatars folder; writing empty catalog');
      fs.writeFileSync(OUT, JSON.stringify({ items: [] }, null, 2));
      return;
    }

    const exts = new Set(['.png', '.jpg', '.jpeg', '.webp']); // case-insensitive
    const files = fs.readdirSync(SRC_DIR, { withFileTypes: true });

    const items = files
      .filter(d => d.isFile())
      .filter(d => exts.has(path.extname(d.name).toLowerCase()))
      .map(d => {
        const file = d.name;
        const label = file.replace(/\.[^.]+$/, '');
        // public asset path (encode spaces etc.)
        const rel = `/navatars/${encodeURIComponent(file)}`;
        const slug = label
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        return { slug, label, src: rel };
      })
      .sort((a, b) => a.label.localeCompare(b.label));

    fs.writeFileSync(OUT, JSON.stringify({ items }, null, 2));
    console.log(`[navatar] wrote ${items.length} items -> ${path.relative(PUB, OUT)}`);
  } catch (e) {
    console.error('[navatar] catalog build failed:', e);
    // Always write something so the app doesn’t explode
    fs.writeFileSync(OUT, JSON.stringify({ items: [] }, null, 2));
    process.exitCode = 0;
  }
})();
