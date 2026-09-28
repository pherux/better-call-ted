# Portrait assets

## Hero

- Project asset: `public/assets/ted-hero.webp`.
- Source: user-supplied Ted Moss navy-suit portrait, `photos/1755617653-6b3a9aad909f6ef8770dd4f80394278e-6.png`.
- Process: built-in imagegen tool, background-extraction edit; then format conversion and web compression with Sharp. No CLI image-generation fallback was used.
- Generated original stays in the local Codex generated-images folder. The site is self-contained and references only the project asset.

Final prompt:

> Use case: background-extraction. Edit target: the supplied photograph of Ted Moss standing in a dark navy suit with blue tie. Create a clean, high-resolution transparent-background cutout of the SAME person. Remove ONLY the office and window background. Preserve his exact facial identity, expression, hairstyle, body, pose, suit, tie, hands if present, clothing detail, and natural photographic appearance. Keep all visible shoulders and torso, with no extra cropping. Do not alter or beautify his face. Do not add text or objects. Asset is for a bold yellow personal branding website hero. Output transparent alpha around the person.

## About portrait

- Project asset: `public/assets/ted-about.webp`.
- Source: user-supplied blue-blazer portrait, `photos/1755616437-6146bd9d4a64ea90e8639ffc0bf715a9-2.png`.
- Process: WebP conversion and compression with Sharp. Cropping and subtle desaturation are display styles in CSS.

## Typography and graphics

Anton and DM Sans are served locally through Fontsource packages. Their upstream open font licenses are included in `public/licenses/` and are deployed with the fonts. The wordmark, icon, borders, halftone pattern, and decorative marks are original HTML/CSS/SVG treatments. No assets from Better Call Saul or Breaking Bad are included.
