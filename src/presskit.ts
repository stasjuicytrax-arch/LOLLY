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
import { cities, releases, residencies, totalVenues } from './data/content';

/**
 * One template, two formats: presskit.html?format=desktop (1920×1080) and ?format=mobile (1080×1920).
 * Desktop slides are static markup in presskit.html; mobile slides are built here from the same data
 * (src/data/content.ts) and the same copy. Shared look: tokens.css, base.css, photos.css (.photo-dissolve).
 */
const mobile = document.documentElement.dataset.format === 'mobile';
const asset = (p: string) => `${import.meta.env.BASE_URL}assets/${p}`;
const $ = (s: string) => document.querySelector<HTMLElement>(s)!;
const pad = (n: number) => String(n).padStart(2, '0');

const SOUNDCLOUD = 'https://on.soundcloud.com/fvK5nAYr491TwBLv5';
const videos = [
  ['aftermovie-h', 'Aftermovie', '1:42'],
  ['club-set-h', 'Club set', '1:20'],
  ['booth-pov-v', 'Booth POV', '0:45'],
  ['teaser-no-rule-v', 'Teaser: No Rule', '0:45'],
  ['extra-2009', 'From the floor', '1:49'],
] as const;
const qrFor = (f: string) => `${SITE_URL}assets/video/${f}.mp4`;

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
  $('[data-res]').innerHTML = residencies
    .map((r, i) => `<li><span class="micro">${pad(i + 1)}</span><b>${r.from}${r.to ? `–${r.to}` : ''}</b><span>${r.club}</span></li>`)
    .join('');
  $('[data-clubs-a]').innerHTML = clubBlock(cities[0]);
  $('[data-clubs-b]').innerHTML = cities.slice(1).map(clubBlock).join('');
  $('[data-rel]').innerHTML = releases.map(releaseFig).join('');
}

/* ------------------------------------------------------------------- mobile */
const slide = (cls: string, inner: string) => `<section class="slide m-slide ${cls}">${inner}</section>`;
const lab = (n: string, t: string) => `<p class="micro m-lab">[ ${n} ] ${t}</p>`;

function buildMobile(): void {
  // bio copy comes from the desktop markup so there is one source of text
  const bio = [...document.querySelectorAll('.s-about__text p')].map((p) => `<p>${p.innerHTML}</p>`).join('');
  const resEarly = residencies.filter((r) => r.from <= 2019);
  const resLate = residencies.filter((r) => r.from >= 2022);
  const resRows = (list: typeof residencies) => list.map((r) => `<li><b>${r.from}${r.to ? `–${r.to}` : ''}</b><span>${r.club}</span></li>`).join('');
  const myanmar = cities.filter((c) => c.country === 'Myanmar');
  const thailand = cities.filter((c) => c.country === 'Thailand');
  const myanmarVenues = myanmar.reduce((n, c) => n + c.clubs.length, 0);
  const pressList = ['01', '02', '03', '06', '07', '08'];
  const vidCard = (i: number, cls: string) => {
    const [f, t, d] = videos[i];
    return `<figure class="mv ${cls}"><div class="ph"><img src="${asset(`video/${f}-poster.jpg`)}" alt="" /></div><figcaption><div><b>${t}</b><span class="micro">${d}</span></div><div class="s-qr" data-qr="${qrFor(f)}"></div></figcaption></figure>`;
  };

  const slides = [
    // 1 cover: same plate + cut-out as the site's phone hero
    slide(
      'm-cover',
      `<img class="m-cover__bg" src="${asset('img/hero/hero-4-plate.jpg')}" alt="" />
       <span class="m-cover__word display" aria-hidden="true">LOLLY</span>
       <img class="m-cover__fig" src="${asset('img/hero/hero-4-cutout.png')}" alt="LOLLY" />
       <div class="s-shade"></div>
       <p class="micro m-tl">[ 00 ] Electronic Press Kit</p><p class="micro m-tr">Est. 2015</p>
       <div class="m-cover__foot"><p class="micro">DJ / Producer — Yangon, Myanmar</p><p>Myanmar-born DJ &amp; producer. A decade of bass-driven sets across Myanmar and Thailand.</p></div>`,
    ),
    // 2-3 about
    slide(
      'm-about1',
      `${lab('01', 'About')}
       <h2 class="display m-h">Bass-driven <span class="t-ash">sets from</span> Myanmar <span class="t-ash">to the region</span></h2>
       <figure class="m-photo"><img src="${asset('img/live/live-01.jpg')}" alt="" /><figcaption class="micro">Live, Yangon</figcaption></figure>
       <dl class="m-facts"><div><dt>Base</dt><dd>Yangon, Myanmar</dd></div><div><dt>Founder</dt><dd>THE LOLLYISM</dd></div></dl>`,
    ),
    slide('m-about2', `${lab('01', 'About')}<div class="m-bio">${bio}</div>`),
    // 4 stats on the light slide, with the dissolving press-07 portrait
    slide(
      'm-stats m-light',
      `${lab('02', 'By the numbers')}
       <img class="photo-dissolve m-stats__ph" src="${asset('img/thumbs/press-07.webp')}" alt="" />
       <ol class="m-stats__list">
         <li><b>10+</b><span>years behind the decks</span></li><li><b>10</b><span>club residencies</span></li><li><b>32</b><span>venues played</span></li>
         <li><b>8</b><span>cities</span></li><li><b>2</b><span>countries</span></li><li><b>7</b><span>original releases</span></li>
       </ol>`,
    ),
    // 5-6 video
    slide('m-video1', `${lab('04', 'Video')}<h2 class="display m-h">Video</h2><div class="m-video__stack">${vidCard(0, 'mv--wide')}${vidCard(1, 'mv--wide')}</div>`),
    slide('m-video2', `${lab('04', 'Video')}<h2 class="display m-h">More <span class="t-ash">from the floor</span></h2><div class="m-video__row">${vidCard(2, '')}${vidCard(3, '')}${vidCard(4, '')}</div>`),
    // 7-8 residencies
    slide('m-res', `${lab('05', 'Residencies')}<h2 class="display m-h">2015 <span class="t-ash">– 2019</span></h2><ol class="m-res__list">${resRows(resEarly)}</ol>`),
    slide('m-res', `${lab('05', 'Residencies')}<h2 class="display m-h">2022 <span class="t-ash">– 2024</span></h2><ol class="m-res__list">${resRows(resLate)}</ol>`),
    // 9-10 clubs
    slide('m-clubs', `${lab('06', 'Clubs &amp; Tours')}<h2 class="display m-h">Myanmar <span class="t-ash">${myanmarVenues} venues</span></h2><div class="m-clubs__yg">${clubBlock(myanmar[0])}</div><div class="m-clubs__cols">${myanmar.slice(1).map(clubBlock).join('')}</div>`),
    slide('m-clubs m-clubs--th', `${lab('06', 'Clubs &amp; Tours')}<h2 class="display m-h">Thailand <span class="t-ash">regional</span></h2><div class="m-clubs__th">${thailand.map(clubBlock).join('')}</div>`),
    // 11 releases 2×4, the eighth tile is the SoundCloud QR
    slide(
      'm-rel',
      `${lab('07', 'Music')}<h2 class="display m-h">7 <span class="t-ash">releases</span></h2>
       <div class="m-rel__grid">${releases.map(releaseFig).join('')}<figure class="m-rel__sc"><div class="s-qr" data-qr="${SOUNDCLOUD}"></div><figcaption class="micro"><b>Listen on SoundCloud</b></figcaption></figure></div>`,
    ),
    // 12-13 gallery: two full 3:2 frames per slide
    slide('m-gal', `${lab('08', 'On stage')}<div class="m-gal__stack"><img src="${asset('img/thumbs/live-01.webp')}" alt="" /><img src="${asset('img/thumbs/live-02.webp')}" alt="" /></div>`),
    slide('m-gal', `${lab('08', 'On stage')}<div class="m-gal__stack"><img src="${asset('img/thumbs/live-03.webp')}" alt="" /><img src="${asset('img/thumbs/live-04.webp')}" alt="" /></div>`),
    // 14 press photos 2×3 on the light slide, each dissolving into the paper colour
    slide('m-press m-light', `${lab('09', 'Press photos')}<div class="m-press__grid">${pressList.map((n) => `<img class="photo-dissolve" src="${asset(`img/press/press-${n}.jpg`)}" alt="" />`).join('')}</div><p class="micro m-press__dl">More press photos, the logo and VJ loops are in the online press kit</p>`),
    // 15 booking
    slide(
      'm-book',
      `<img class="m-book__bg" src="${asset('img/hero/hero-3-alt-red.jpg')}" alt="" /><div class="s-shade"></div>
       <div class="m-book__body">
         ${lab('10', 'Booking')}
         <p class="m-book__mail display">DJ.LOLLY.MT@GMAIL.COM</p>
         <ul class="m-book__list">
           <li><span class="micro">Phone</span>+959 459 181 060</li><li><span class="micro">WhatsApp</span>+959 459 181 060</li>
           <li><span class="micro">Viber</span>+959 459 181 060</li><li><span class="micro">Telegram</span>@lollymmofficial</li>
           <li><span class="micro">Instagram</span>@lolly_mmofficial</li><li><span class="micro">TikTok</span>@djlollyburma</li>
           <li><span class="micro">Facebook</span>LOLLY</li><li><span class="micro">SoundCloud</span>djlollymm</li>
         </ul>
         <div class="m-book__qr"><div class="s-qr" data-qr="site"></div><p class="micro">Scan for full press kit</p></div>
       </div>`,
    ),
  ];
  $('#m').innerHTML = slides.join('');
}

if (mobile) buildMobile();
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
