// Converte os renders de scripts/_raw/*.png para WebP e AVIF em public/images/projects/.
// Gera três larguras por formato (srcset). Requer a devDependency "sharp".
import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const raw = path.join(here, "_raw");
const out = path.join(here, "..", "public", "images", "projects");
const names = ["halo-mobility", "tessera-foods", "marrow-audio", "oblique-architecture", "kairo-health", "vanta-spirits"];
const widths = [800, 1200, 1600];

await mkdir(out, { recursive: true });

for (const name of names) {
  const src = path.join(raw, `${name}.png`);
  if (!existsSync(src)) throw new Error(`Render ausente: ${src}. Rode: python3 scripts/render-art.py`);
  for (const w of widths) {
    const base = sharp(src).resize({ width: w, withoutEnlargement: true });
    await base.clone().webp({ quality: 80, effort: 5 }).toFile(path.join(out, `${name}-${w}.webp`));
    await base.clone().avif({ quality: 52, effort: 4 }).toFile(path.join(out, `${name}-${w}.avif`));
  }
  const s = await stat(path.join(out, `${name}-1200.avif`));
  console.log(`${name}: avif 1200w = ${(s.size / 1024).toFixed(0)} KB`);
}
console.log("ok");
