import fs from "node:fs";
import path from "node:path";

const navatarDir = path.join(process.cwd(), "public", "navatars");
const outFile = path.join(process.cwd(), "src", "data", "navatar-canon.json");

const files = fs
  .readdirSync(navatarDir, { withFileTypes: true })
  .filter((f) => f.isFile() && /(\.png|\.jpg|\.jpeg|\.webp)$/i.test(f.name))
  .map((f) => f.name);

const catalog = files.map((f) => ({
  name: path.parse(f).name,
  file: `/navatars/${f}`,
}));

fs.writeFileSync(outFile, JSON.stringify(catalog, null, 2));
console.log(`✅ Generated canon catalog with ${files.length} entries`);
