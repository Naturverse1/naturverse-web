// Node 18+
// Generate public/kingdoms/<Realm>/manifest.json with all character images.
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const KINGDOMS_DIR = path.join(ROOT, "public", "kingdoms");
const IMG_EXT = new Set([".png", ".jpg", ".jpeg", ".webp"]);

function toTitle(str) {
  return str
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function isMapFile(name) {
  return /map/i.test(name);
}

function buildForRealm(realmDir, realmName) {
  const entries = fs.readdirSync(realmDir, { withFileTypes: true });
  const items = [];

  for (const e of entries) {
    if (!e.isFile()) continue;
    const ext = path.extname(e.name).toLowerCase();
    if (!IMG_EXT.has(ext)) continue;
    if (isMapFile(e.name)) continue;

    items.push({
      name: toTitle(e.name),
      src: `/kingdoms/${realmName}/${e.name}`,
    });
  }

  items.sort((a, b) => a.name.localeCompare(b.name));

  const outPath = path.join(realmDir, "manifest.json");
  fs.writeFileSync(outPath, JSON.stringify(items, null, 2));
  console.log(`✓ ${realmName}: ${items.length} characters`);
}

function main() {
  if (!fs.existsSync(KINGDOMS_DIR)) {
    console.error("No public/kingdoms directory found.");
    process.exit(0);
  }
  const realms = fs
    .readdirSync(KINGDOMS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  realms.forEach((realm) => {
    const realmDir = path.join(KINGDOMS_DIR, realm);
    buildForRealm(realmDir, realm);
  });
}

main();
