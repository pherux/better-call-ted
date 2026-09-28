# Better Call Ted

A bold personal and business branding website for Ted Moss. Built with HTML, CSS, and JavaScript, with Vite for development and production builds. Hosted on GitHub Pages.

- Website: https://bettercallted.co/
- Custom domain and DNS configured on September 28, 2026. GitHub manages the HTTPS certificate.
- Contact: **valkyrie241@gmail.com**

## Run locally

Use Node.js 22.12+ or 24 LTS.

```sh
npm ci
npm run dev
```

```sh
npm test
npm run build
npm run preview
```

The complete site is generated in `dist/`. Assets use relative paths, so the same build works on a GitHub repository URL and a custom domain. Fonts are served locally. No paid services, API keys, or backend are required.

## Content and behavior

- `index.html`: all page copy, service offerings, navigation, contact form, and privacy notice.
- `src/style.css`: responsive design, typography, and reduced-motion behavior.
- `src/main.js`: navigation, quiz UI, sharing, inquiry preparation, and privacy dialog.
- `src/brand-check.js`: questions and the three playful verdicts.
- `src/contact.js`: contact email and encoded email-draft generation.
- `public/assets/`: optimized portraits. Original source photos in `photos/` stay local and are excluded from Git.
- `vite.config.js`: canonical URL, structured metadata, robots.txt, and sitemap.xml.

The inquiry form **opens an email draft** in the visitor's email application. It does not send email automatically or store form data. Visitors must press Send in their email app. Copy and download fallbacks are available after preparing an inquiry. Direct email links are also available. No inquiry should be reported as received by the site.

The brand check runs entirely in the browser. Share links contain only a verdict identifier, not the person's answers. No analytics, ad trackers, cookies, or form database are configured. There are no fabricated testimonials, client logos, growth figures, prices, or guarantees.

To change the contact address, update `src/contact.js`, the direct links and form action in `index.html`, and the structured metadata in `vite.config.js`.

## GitHub publishing

The workflow at `.github/workflows/deploy.yml` tests, builds, and deploys pushes to `main`. GitHub repository **Settings → Pages → Source** must be **GitHub Actions**. The public repository includes only the website and its development files, not the entire source photo collection or local verification artifacts.

## Connect bettercallted.co after purchasing it

1. Buy **bettercallted.co** at Hostinger. A separate web-hosting plan is not needed for this GitHub Pages deployment.
2. In GitHub account **Settings → Pages**, add and verify `bettercallted.co`. GitHub supplies a unique TXT record; add that exact record in Hostinger. Do not invent the verification value.
3. In this repository's **Settings → Pages → Custom domain**, enter `bettercallted.co` and save.
4. In Hostinger, go to **Domains → DNS**, select `bettercallted.co`, and set these records. These records must be managed where the domain's authoritative nameservers point.

| Type  | Name | Value            |
| ----- | ---- | ---------------- |
| A     | @    | 185.199.108.153  |
| A     | @    | 185.199.109.153  |
| A     | @    | 185.199.110.153  |
| A     | @    | 185.199.111.153  |
| CNAME | www  | pherux.github.io |

Use a default TTL or 3600 seconds. Replace conflicting parking A/AAAA records for the apex and conflicting `www` records. Preserve unrelated MX, TXT, and email records. Do not point `www` at the repository path; the target is `pherux.github.io`.

5. Wait for the GitHub DNS check and certificate to complete, then enable **Enforce HTTPS**. DNS changes can take up to 24 hours to propagate.
6. In repository **Settings → Secrets and variables → Actions → Variables**, set **SITE_URL** to `https://bettercallted.co/`. Re-run the deployment workflow to update the canonical URL, sitemap, and metadata. This variable is public configuration, not a secret.
7. Verify HTTPS at both the apex and `www`, the portraits and fonts, the brand check, and the inquiry flow.

This GitHub Actions publishing workflow uses the repository's Pages custom-domain setting; a `CNAME` file is not required. The original GitHub URL redirects to the configured custom domain.

Official references (checked September 28, 2026):

- [GitHub: managing a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [GitHub: verifying a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)
- [Hostinger: managing DNS records](https://www.hostinger.com/support/1583250-what-dns-record-types-are-supported-at-hostinger/)
- [Hostinger: DNS management navigation](https://www.hostinger.com/support/1583249-how-to-manage-dns-records-at-hostinger/)

## Verification

`npm test` checks all 27 quiz combinations, verdict boundaries, invalid answers, and safe encoding of email drafts.

For browser checks, start the site locally, then run:

```sh
node scripts/verify-site.mjs
```

The script uses an isolated, headless Edge browser by default. Set `BROWSER_CHANNEL=chrome` if using installed Chrome. Set `TEST_URL` to verify a different local or deployed URL. It checks 320–1440px layouts, missing assets, desktop/mobile accessibility, menu navigation, the quiz and its back button, service preselection, email-draft fallback, FAQ, privacy modal, and shared verdicts. Screenshots and the report are saved under ignored `artifacts/`.

## Assets

See [ASSET-NOTES.md](ASSET-NOTES.md) for portrait provenance and the image-generation prompt. Design and photography are supplied for Ted Moss's website; no third-party show logos, screenshots, or music are used.
