import sharp from 'sharp'
import glob from 'glob'
import { promises as fs } from 'fs'
import path from 'path'

const srcDirs = ['public/assets', 'public/kingdoms', 'public/Languages', 'public/Mapsmain', 'public/Marketplace']
const outDir = 'public/optimized'

async function run() {
  await fs.mkdir(outDir, { recursive: true })
  const files = srcDirs.flatMap(d => glob.sync(`${d}/**/*.{png,jpg,jpeg}`))

  for (const f of files) {
    const rel = path.relative('public', f)
    const base = path.join(outDir, rel.replace(/\.(png|jpe?g)$/i,''))
    await fs.mkdir(path.dirname(base), { recursive: true })

    const sizes = [320, 640, 960, 1280]
    for (const w of sizes) {
      const outPath = `${base}-${w}.webp`
      try {
        await sharp(f).resize({ width: w }).webp({ quality: 80 }).toFile(outPath)
        console.log('✅', outPath)
      } catch (err) {
        console.warn('❌ Failed', f, err)
      }
    }
  }
}

run()

