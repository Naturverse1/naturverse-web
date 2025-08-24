// Builds a JSON manifest of character images per kingdom from /public/kingdoms
// Excludes map images and non-image files.
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC_OUT = path.join(ROOT, "src", "data");
const PUB = path.join(ROOT, "public");
const PUBLIC_KINGDOMS = path.join(PUB, "kingdoms");

const IMG_RE = /\.(png|jpg|jpeg|gif|webp)$/i;
const EXCLUDE_RE = /(map|maps?main)|manifest\.json|\.keep|\.pdf$/i;

function listKingdoms(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

function collectImages(kingdom) {
  const dir = path.join(PUBLIC_KINGDOMS, kingdom);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((f) => f.isFile())
    .map((f) => f.name)
    .filter((name) => IMG_RE.test(name) && !EXCLUDE_RE.test(name))
    .map((name) => `kingdoms/${kingdom}/${name}`);
}

function main() {
  if (!fs.existsSync(PUBLIC_KINGDOMS)) return;
  const kingdoms = listKingdoms(PUBLIC_KINGDOMS);
  const data = {};
  kingdoms.forEach((k) => {
    data[k] = collectImages(k);
  });
  if (!fs.existsSync(SRC_OUT)) fs.mkdirSync(SRC_OUT, { recursive: true });
  fs.writeFileSync(
    path.join(SRC_OUT, "kingdom-galleries.json"),
    JSON.stringify(data, null, 2)
  );
  fs.writeFileSync(
    path.join(PUB, "kingdom-gallery-manifest.json"),
    JSON.stringify(data, null, 2)
  );
  console.log(`✅ Wrote galleries for ${kingdoms.length} kingdoms.`);
}

main();

