import '@fontsource-variable/archivo/wdth.css';
import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import './styles/tokens.css';
import './styles/base.css';
import './styles/photos.css';
import './styles/presskit.css';
import './styles/presskit-m.css';
import QRCode from 'qrcode';
import { SITE_URL } from './config';
import { cities, releases, residencies, residencyRange, totalVenues } from './data/content';
import { asset, pad, qrFor, videos } from './presskit-common';
import { buildMobile } from './presskit-mobile';

/**
 * One template, two formats: presskit.html?format=desktop (1920×1080) and ?format=mobile (1080×1920).
 * Desktop slides are static markup in presskit.html; mobile slides are built here from the same data
 * (src/data/content.ts) and the same copy. Shared look: tokens.css, base.css, photos.css; baked press-XX-dissolve.jpg for fading photos.
 */
const mobile = document.documentElement.dataset.format === 'mobile';
const $ = (s: string) => document.querySelector<HTMLElement>(s)!;


async function qr(el: HTMLElement, url: string): Promise<void> {
  el.innerHTML = await QRCode.toString(url, { type: 'svg', margin: 1, color: { dark: '#0b0505', light: '#f0edec' }, errorCorrectionLevel: 'M' });
}

const clubBlock = (c: (typeof cities)[number]) =>
  `<div class="cblk"><h3 class="display">${c.name}<small class="micro">${pad(c.clubs.length)}${c.note ? ` · ${c.note}` : ''}</small></h3><ul>${c.clubs.map((x) => `<li>${x}</li>`).join('')}</ul></div>`;

const releaseFig = (r: (typeof releases)[number]) =>
  `<figure><div class="cov"><img src="${asset(`img/releases/cover-${r.cover}.jpg`)}" alt="" /></div><figcaption class="micro"><b>${r.title}</b>${r.sub ? `<span>${r.sub}</span>` : ''}</figcaption></figure>`;

/* ------------------------------------------------------------------ desktop */
function buildDesktop(): void {
  $('[data-total]').textContent = String(totalVenues);
  $('[data-videos]').innerHTML = videos
    .map(
      ([f, t, d]) =>
        `<figure><div class="ph"><img src="${asset(`video/${f}-poster.jpg`)}" alt="" /></div><figcaption class="micro"><b>${t}</b><span>${d}</span></figcaption><div class="s-qr" data-qr="${qrFor(f)}"></div></figure>`,
    )
    .join('');
  $('[data-res-range]').innerHTML = `${residencyRange.from} <span class="t-ash">– ${residencyRange.to}</span>`;
  $('[data-res]').innerHTML = residencies
    .map((r, i) => `<li><span class="micro">${pad(i + 1)}</span><b>${r.from}${r.to ? `–${r.to}` : ''}</b><span>${r.club}</span></li>`)
    .join('');
  $('[data-clubs-a]').innerHTML = clubBlock(cities[0]);
  $('[data-clubs-b]').innerHTML = cities.slice(1).map(clubBlock).join('');
  $('[data-rel]').innerHTML = releases.map(releaseFig).join('');
}

if (mobile) buildMobile($('#m'));
else buildDesktop();
document.querySelectorAll<HTMLElement>('[data-link-photos]').forEach((e) => e.remove());

const jobs: Promise<void>[] = [];
document.querySelectorAll<HTMLElement>('[data-qr]').forEach((el) => {
  const v = el.dataset.qr!;
  jobs.push(qr(el, v === 'site' ? SITE_URL : v));
});
void Promise.all([...jobs, document.fonts.ready]).then(() => {
  document.documentElement.dataset.ready = '1';
});
