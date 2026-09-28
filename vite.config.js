import { defineConfig } from "vite";

const siteUrl = new URL(process.env.SITE_URL || "https://bettercallted.co/");
siteUrl.search = "";
siteUrl.hash = "";
if (!siteUrl.pathname.endsWith("/")) siteUrl.pathname += "/";
const origin = siteUrl.href;
const socialImage = new URL("assets/better-call-ted-social-v1.jpg", origin)
  .href;
const socialImageAlt =
  "Better Call Ted. Too good to be this unknown. Ted Moss in a navy suit against a bold yellow background. Personal & business branding at bettercallted.co.";

export default defineConfig({
  base: "./",
  build: { target: "es2022" },
  plugins: [
    {
      name: "site-metadata",
      transformIndexHtml() {
        return [
          {
            tag: "link",
            attrs: { rel: "canonical", href: origin },
            injectTo: "head",
          },
          {
            tag: "meta",
            attrs: { property: "og:url", content: origin },
            injectTo: "head",
          },
          ...Object.entries({
            "og:image": socialImage,
            "og:image:secure_url": socialImage,
            "og:image:type": "image/jpeg",
            "og:image:width": "1200",
            "og:image:height": "630",
            "og:image:alt": socialImageAlt,
          }).map(([property, content]) => ({
            tag: "meta",
            attrs: { property, content },
            injectTo: "head",
          })),
          ...Object.entries({
            "twitter:image": socialImage,
            "twitter:image:alt": socialImageAlt,
          }).map(([name, content]) => ({
            tag: "meta",
            attrs: { name, content },
            injectTo: "head",
          })),
          {
            tag: "script",
            attrs: { type: "application/ld+json" },
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Ted Moss",
              url: origin,
              jobTitle: "Personal & Business Branding Strategist",
              image: new URL("assets/ted-about.webp", origin).href,
              email: "valkyrie241@gmail.com",
            }),
            injectTo: "head",
          },
        ];
      },
      generateBundle() {
        this.emitFile({
          type: "asset",
          fileName: "robots.txt",
          source: `User-agent: *\nAllow: /\nSitemap: ${origin}sitemap.xml\n`,
        });
        this.emitFile({
          type: "asset",
          fileName: "sitemap.xml",
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}</loc></url></urlset>\n`,
        });
      },
    },
  ],
});
