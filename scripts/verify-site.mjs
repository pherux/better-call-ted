import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

// A disposable browser verifies only this site's UI; no user browser profile is opened.
const base = process.env.TEST_URL || "http://127.0.0.1:4173/";
const browser = await chromium.launch({
  channel: process.env.BROWSER_CHANNEL || "msedge",
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
const page = await context.newPage();
const errors = [];
const failedResponses = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("response", (response) => {
  if (response.status() >= 400)
    failedResponses.push(`${response.status()} ${response.url()}`);
});
await mkdir("artifacts", { recursive: true });
const report = { viewports: [], errors, failedResponses, accessibility: [] };

try {
  await page.goto(base, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  assert.equal(
    await page.title(),
    "Better Call Ted | Personal & Business Branding",
  );
  for (const width of [1440, 1024, 768, 640, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    const layout = await page.evaluate(() => ({
      viewport: innerWidth,
      content: document.documentElement.scrollWidth,
      brokenImages: [...document.images].filter(
        (i) => i.complete && !i.naturalWidth,
      ).length,
    }));
    report.viewports.push(layout);
    assert.ok(
      layout.content <= layout.viewport,
      `Horizontal overflow at ${width}px: ${layout.content}`,
    );
    assert.equal(layout.brokenImages, 0);
    if ([1440, 390].includes(width)) {
      await page.screenshot({
        path: `artifacts/${width}-full.png`,
        fullPage: true,
      });
      await page.screenshot({ path: `artifacts/${width}-hero.png` });
      const axe = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      report.accessibility.push({
        width,
        violations: axe.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.map((n) => ({
            target: n.target,
            summary: n.failureSummary,
          })),
        })),
      });
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open navigation" }).click();
  assert.equal(await page.locator("#mobile-nav").isVisible(), true);
  await page
    .locator("#mobile-nav")
    .getByRole("link", { name: "The free brand check" })
    .click();
  assert.equal(await page.locator("#mobile-nav").isVisible(), false);
  assert.equal(
    await page.getByRole("button", { name: "NEXT QUESTION" }).isEnabled(),
    false,
  );
  await page
    .getByLabel("They wonder what I actually do.", { exact: true })
    .check();
  await page.getByRole("button", { name: "NEXT QUESTION" }).click();
  await page
    .getByLabel("A post every time Mercury feels right.", { exact: true })
    .check();
  await page.getByRole("button", { name: "Go back" }).click();
  assert.equal(
    await page
      .getByLabel("They wonder what I actually do.", { exact: true })
      .isChecked(),
    true,
  );
  await page.getByRole("button", { name: "NEXT QUESTION" }).click();
  assert.equal(
    await page
      .getByLabel("A post every time Mercury feels right.", { exact: true })
      .isChecked(),
    true,
  );
  await page.getByRole("button", { name: "NEXT QUESTION" }).click();
  await page.getByLabel("Mostly my mom hitting like.", { exact: true }).check();
  await page.getByRole("button", { name: "GIVE ME THE VERDICT" }).click();
  assert.equal(
    await page
      .getByRole("heading", { name: "THE INVISIBLE EXPERT." })
      .isVisible(),
    true,
  );
  await page.getByRole("link", { name: "HELP ME OUT, TED" }).click();
  await expect(page.locator("#service")).toHaveValue("Brand strategy");
  await page.getByLabel("Your name", { exact: true }).fill("Preview Test");
  await page
    .getByLabel("Your email", { exact: true })
    .fill("preview@example.com");
  await page
    .getByLabel("The short version", { exact: true })
    .fill("Testing the local email draft only.");
  await page
    .getByRole("button", { name: "LET'S TALK BUSINESS", exact: true })
    .click();
  assert.match(
    await page.locator("#form-status").textContent(),
    /Your draft is ready/,
  );
  assert.equal(
    await page
      .getByRole("button", { name: "Download inquiry", exact: true })
      .isVisible(),
    true,
  );
  const downloadPromise = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Download inquiry", exact: true })
    .click();
  const download = await downloadPromise;
  assert.equal(download.suggestedFilename(), "better-call-ted-inquiry.txt");
  await page.getByRole("button", { name: "Privacy, plainly." }).click();
  assert.equal(await page.locator("#privacy-dialog").isVisible(), true);
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("#privacy-dialog").isVisible(), false);
  await page
    .locator("summary")
    .filter({ hasText: "Can you guarantee I'll go viral?" })
    .click();
  assert.equal(await page.locator("details[open]").count(), 1);
  await page.goto(new URL("?verdict=almost#brand-check", base).href);
  assert.equal(
    await page.getByRole("heading", { name: "THE ALMOST-FAMOUS." }).isVisible(),
    true,
  );
  await page.getByRole("button", { name: "Take the check again" }).click();
  assert.equal(new URL(page.url()).searchParams.has("verdict"), false);
  assert.equal(
    await page.getByRole("button", { name: "NEXT QUESTION" }).isEnabled(),
    false,
  );
  await page.goto(new URL("?verdict=invalid#brand-check", base).href);
  assert.equal(
    await page
      .getByRole("heading", { name: "WHEN SOMEONE FINDS YOU ONLINE…" })
      .isVisible(),
    true,
  );
  assert.deepEqual(errors, []);
  assert.deepEqual(failedResponses, []);
  report.flows =
    "Passed: mobile menu, quiz, back navigation, verdict, service selection, email draft, draft download, privacy dialog, FAQ, shared link, restart, invalid shared link.";
  await writeFile(
    "artifacts/verification.json",
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
  assert.equal(
    report.accessibility.flatMap((item) => item.violations).length,
    0,
    "Accessibility violations need review.",
  );
} finally {
  await writeFile(
    "artifacts/verification.json",
    JSON.stringify(report, null, 2),
  );
  await browser.close();
}
