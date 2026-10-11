import assert from 'node:assert/strict';
import fs from 'node:fs';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {}) });
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:14327';
const evidence = process.env.EVIDENCE_DIR || '/tmp/blog-style-choice';
fs.mkdirSync(evidence, { recursive: true });
async function committed(page, style) {
  await page.waitForFunction(style => document.documentElement.dataset.style === style && !document.documentElement.classList.contains('style-preview'), style);
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('blog-style')).style), style);
}
try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base);
    await page.locator('#style-chooser').waitFor({ state: 'visible' });
    await page.screenshot({ path: `${evidence}/first-${width}.png` });
    await page.mouse.wheel(0, 280);
    await committed(page, 'minimal');
    assert.ok(await page.evaluate(() => scrollY > 0), 'scroll choice preserves reading position');
    await page.screenshot({ path: `${evidence}/scroll-${width}.png` });
    await page.reload();
    await committed(page, 'minimal');
    await page.locator('#style-toggle').click();
    await page.locator('button[data-style="expressive"]').click();
    await committed(page, 'expressive');
    await page.mouse.wheel(0, 250);
    assert.equal(await page.locator('html').getAttribute('data-style'), 'expressive');
    await page.reload();
    await committed(page, 'expressive');
    await page.goto(base + '/posts/next-token-agent-harness/');
    await committed(page, 'expressive');
    await page.screenshot({ path: `${evidence}/remembered-${width}.png` });
    await page.locator('#style-toggle').click();
    await page.mouse.wheel(0, 180);
    await page.locator('button[data-style="expressive"]').click();
    await committed(page, 'expressive');
    assert.deepEqual(errors, []);
    await context.close();
  }
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(base);
  await page.locator('#style-chooser').waitFor({ state: 'visible' });
  await page.keyboard.press('PageDown');
  await committed(page, 'minimal');
  await page.evaluate(() => localStorage.setItem('blog-style', JSON.stringify({ style: 'expressive', expires: 1 })));
  await page.reload();
  await committed(page, 'expressive');
  await page.evaluate(() => localStorage.setItem('blog-style', '{broken'));
  await page.reload();
  await page.locator('#style-chooser').waitFor({ state: 'visible' });
  await context.close();
  console.log('PASS: first visit, scroll, refresh, navigation, explicit choice, reduced motion, stored preference migration, invalid storage');
} finally {
  await browser.close();
}
