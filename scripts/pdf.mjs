// npm run pdf: builds the site, serves dist and prints presskit.html to two PDFs with Playwright:
//   LOLLY-presskit-desktop.pdf  (?format=desktop, 1920×1080)
//   LOLLY-presskit-mobile.pdf   (?format=mobile,  1080×1920)
// Each goes to public/ and, as a copy, one folder up (..\ = the DJ LOLLY folder). Each must stay ≤ 15 MB.
import { build, preview } from 'vite';
import { chromium } from 'playwright-core';
import { copyFileSync, mkdirSync, statSync, existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const MAX_MB = 15;
const formats = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'mobile', width: 1080, height: 1920 },
];

await build({ root, logLevel: 'warn' });
const server = await preview({ root, preview: { port: 4179, strictPort: true, open: false } });
const browser = await chromium.launch({ channel: 'chrome' }); // the Chrome already on the machine, no download
let failed = false;
try {
  for (const f of formats) {
    const page = await browser.newPage({ viewport: { width: f.width, height: f.height } });
    await page.goto(`http://localhost:4179/LOLLY/presskit.html?format=${f.name}`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.documentElement.dataset.ready === '1');
    await page.evaluate(() => Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; })))));
    const file = `LOLLY-presskit-${f.name}.pdf`;
    const out = resolve(root, 'public', file);
    mkdirSync(resolve(root, 'public'), { recursive: true });
    await page.pdf({ path: out, width: `${f.width}px`, height: `${f.height}px`, printBackground: true });
    copyFileSync(out, resolve(root, '..', file));
    const mb = statSync(out).size / 1048576;
    const slides = await page.evaluate(() => [...document.querySelectorAll('.slide')].filter((s) => getComputedStyle(s).display !== 'none').length);
    console.log(`${file}: ${slides} slides, ${mb.toFixed(1)} MB`);
    if (mb > MAX_MB) { console.error(`  over ${MAX_MB} MB`); failed = true; }
    await page.close();
  }
  // the old single-file name is gone; do not leave stale copies around
  for (const old of [resolve(root, 'public/LOLLY-presskit.pdf'), resolve(root, '..', 'LOLLY-presskit.pdf')]) if (existsSync(old)) rmSync(old);
} finally {
  await browser.close();
  server.httpServer.close();
}
if (failed) process.exit(1);
