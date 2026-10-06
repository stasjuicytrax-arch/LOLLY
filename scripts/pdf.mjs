// npm run pdf: builds the site, serves dist, prints presskit.html (11 slides, 1920×1080) to PDF with Playwright
// and writes public/LOLLY-presskit.pdf plus a copy one folder up (..\LOLLY-presskit.pdf).
import { build, preview } from 'vite';
import { chromium } from 'playwright-core';
import { copyFileSync, mkdirSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const out = resolve(root, 'public/LOLLY-presskit.pdf');
const outParent = resolve(root, '..', 'LOLLY-presskit.pdf');

await build({ root, logLevel: 'warn' });
const server = await preview({ root, preview: { port: 4179, strictPort: true, open: false } });
const base = `http://localhost:4179/LOLLY/presskit.html`;

// Uses the Chrome already on the machine; no browser download needed.
const browser = await chromium.launch({ channel: 'chrome' });
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.documentElement.dataset.ready === '1');
  await page.evaluate(() => Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; })))));
  mkdirSync(dirname(out), { recursive: true });
  await page.pdf({ path: out, width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true });
  copyFileSync(out, outParent);
  console.log(`PDF: ${out} (${(statSync(out).size / 1048576).toFixed(1)} MB), copy: ${outParent}`);
} finally {
  await browser.close();
  server.httpServer.close();
}
