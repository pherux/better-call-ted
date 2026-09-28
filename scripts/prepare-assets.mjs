import sharp from "sharp";
import { mkdir } from "node:fs/promises";

// Run with the generated portrait path. Source photos stay out of the public repository.
const heroPath = process.argv[2];
if (!heroPath)
  throw new Error(
    "Pass the transparent Ted portrait path as the first argument.",
  );
await mkdir("public/assets", { recursive: true });
await sharp(heroPath)
  .resize({ width: 1080, withoutEnlargement: true })
  .webp({ quality: 88, alphaQuality: 100 })
  .toFile("public/assets/ted-hero.webp");
await sharp("photos/1755616437-6146bd9d4a64ea90e8639ffc0bf715a9-2.png")
  .resize({ width: 768, withoutEnlargement: true })
  .webp({ quality: 85 })
  .toFile("public/assets/ted-about.webp");
console.log("Created optimized web portraits in public/assets.");
