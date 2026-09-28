# Brand assets

## Social sharing preview

- Project asset: `public/assets/better-call-ted-social-v1.jpg` (1200 × 630 pixels).
- Reference: the existing `public/assets/ted-hero.webp` portrait of Ted Moss.
- Process: built-in imagegen tool, followed by mechanical resizing and JPEG compression with Sharp. No CLI image-generation fallback was used.
- Used by the site's Open Graph and X/Twitter metadata. Absolute image URLs follow the configured `SITE_URL`. The filename is versioned so future image changes can use a fresh URL.

Final prompt:

> Use case: ads-marketing / identity-preserving compositing. Asset: finished social-sharing preview image for bettercallted.co. Create a complete, polished, wide landscape Open Graph card in 1200 x 630 pixel proportions (1.905:1). Reference image: Ted Moss portrait; preserve this exact person's facial identity, expression, hair, navy suit and blue tie. Use the supplied photograph as a cutout, not a newly imagined face. Style: bold witty vintage lawyer billboard meets sophisticated editorial brand campaign, consistent with the Better Call Ted website. Warm vivid yellow #ffdc35 background, brick red #cb2921, near-black #20221e, cream accents. Very subtle halftone dots and thin circular linework behind the portrait, no gradients or gritty damage. Layout: substantial left text area about 60% of card, large photographic portrait of Ted on right 40%, cropped at mid-torso at lower edge. His full head is visible and large enough to recognize in a small thumbnail. Left wordmark is the dominant graphic: 'Better Call' in bold italic black serif lettering above enormous condensed red uppercase 'TED.' with black period, slight jaunty tilt. Under wordmark, a bold condensed black uppercase tagline split over two lines: 'TOO GOOD TO BE' / 'THIS UNKNOWN.' Bottom near-black footer strip contains small but crisp cream uppercase text on left 'PERSONAL & BUSINESS BRANDING' and on right 'bettercallted.co'. All important text and face inside safe margins of at least 50px, strong readability at small share-thumbnail size, clean professional spacing. Text must be spelled exactly as quoted, do not add any other words, no badges, no buttons, no watermarks, no stock logos or show logos. The portrait and typography should feel like one memorable campaign poster, not a website screenshot. Opaque yellow background, no transparency.

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
