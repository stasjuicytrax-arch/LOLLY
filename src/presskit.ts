import '@fontsource-variable/archivo/wdth.css';
import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import './styles/tokens.css';
import './styles/base.css';
import './styles/presskit.css';
import QRCode from 'qrcode';
import { cities, releases, residencies, totalVenues } from './data/content';

const SITE = 'https://stasjuicytrax-arch.github.io/LOLLY/';
const asset = (p: string) => `${import.meta.env.BASE_URL}assets/${p}`;
const $ = (s: string) => document.querySelector<HTMLElement>(s)!;

async function qr(el: HTMLElement, url: string, dark: string, light: string): Promise<void> {
  el.innerHTML = await QRCode.toString(url, { type: 'svg', margin: 1, color: { dark, light }, errorCorrectionLevel: 'M' });
}

$('[data-total]').textContent = String(totalVenues);

// Video slide: poster + QR to the full file.
const videos = [
  ['aftermovie-h', 'Aftermovie', '1:42'],
  ['club-set-h', 'Club set', '1:20'],
  ['booth-pov-v', 'Booth POV', '0:45'],
  ['teaser-no-rule-v', 'Teaser: No Rule', '0:45'],
  ['extra-2009', 'From the floor', '1:49'],
] as const;
$('[data-videos]').innerHTML = videos
  .map(
    ([f, t, d]) =>
      `<figure><div class="ph"><img src="${asset(`video/${f}-poster.jpg`)}" alt="" /></div><figcaption class="micro"><b>${t}</b><span>${d}</span></figcaption><div class="s-qr" data-qr="${SITE}assets/video/${f}.mp4"></div></figure>`,
  )
  .join('');

$('[data-res]').innerHTML = residencies
  .map((r, i) => `<li><span class="micro">${String(i + 1).padStart(2, '0')}</span><b>${r.from}${r.to ? `–${r.to}` : ''}</b><span>${r.club}</span></li>`)
  .join('');

const block = (c: (typeof cities)[number]) =>
  `<div class="cblk"><h3 class="display">${c.name}<small class="micro">${String(c.clubs.length).padStart(2, '0')}${c.note ? ` · ${c.note}` : ''}</small></h3><ul>${c.clubs.map((x) => `<li>${x}</li>`).join('')}</ul></div>`;
$('[data-clubs-a]').innerHTML = block(cities[0]);
$('[data-clubs-b]').innerHTML = cities.slice(1).map(block).join('');

$('[data-rel]').innerHTML = releases
  .map((r) =>
    r.typographic
      ? `<figure><div class="cov cov--type"><span class="display">${r.title}</span><i class="micro">LOLLY</i></div><figcaption class="micro"><b>${r.title}</b></figcaption></figure>`
      : `<figure><div class="cov"><img src="${asset(`img/releases/cover-${r.cover}.jpg`)}" alt="" /></div><figcaption class="micro"><b>${r.title}</b>${r.sub ? `<span>${r.sub}</span>` : ''}</figcaption></figure>`,
  )
  .join('');

$('[data-link-photos]').textContent = `${SITE}#press`;

const jobs: Promise<void>[] = [];
document.querySelectorAll<HTMLElement>('[data-qr]').forEach((el) => {
  jobs.push(qr(el, el.dataset.qr!, '#0b0505', '#f0edec'));
});
void Promise.all([...jobs, document.fonts.ready]).then(() => {
  document.documentElement.dataset.ready = '1';
});
