/**
 * Build-time script: scans /public/kingdoms/** and writes /public/kingdom-gallery-manifest.json
 * Excludes map images and non-image files. Keeps file discovery out of runtime.
 */
import fs from "node:fs";
import path from "node:path";
import { KINGDOM_FOLDERS } from "@/lib/kingdoms";

const ROOT = process.cwd();
const PUB = path.join(ROOT, "public");
const KINGDOMS_DIR = path.join(PUB, "kingdoms");

const IMG_RE = /\.(png|jpg|jpeg|webp)$/i;
const EXCLUDE = /(map|\.keep|manifest\.json)/i;

function listImages(dir: string) {
  return fs
    .readdirSync(dir)
    .filter((f) => IMG_RE.test(f) && !EXCLUDE.test(f))
    .map((f) => path.posix.join("kingdoms", path.basename(dir), f));
}

const manifest: Record<string, string[]> = {};
for (const folder of KINGDOM_FOLDERS) {
  const d = path.join(KINGDOMS_DIR, folder);
  manifest[folder] = fs.existsSync(d) ? listImages(d) : [];
}

const out = path.join(PUB, "kingdom-gallery-manifest.json");
fs.writeFileSync(out, JSON.stringify(manifest, null, 2));
console.log("Wrote", out);
