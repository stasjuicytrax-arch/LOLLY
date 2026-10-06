import { cities, releases, residencies } from './data/content';
import { SOUNDCLOUD, asset, pad, qrFor, videos } from './presskit-common';

/**
 * Mobile press kit (1080×1920): 12 slides. Every slide is a grid (head auto / body 1fr / foot auto) that fills the
 * full height; the hero of each slide is a full-bleed photo or mega type. Layout lives in styles/presskit-m.css.
 */
const TOTAL = 12;
const LOGO_W = asset('logo/lolly-logo-white.png');
const LOGO_B = asset('logo/lolly-logo-black.png');
const play = '<i class="m-play" aria-hidden="true"></i>';

function slide(n: number, label: string, cls: string, body: string, layers = '', light = false): string {
  return `<section class="slide m-slide ${cls}${light ? ' m-light' : ''}">${layers}
    <header class="m-head micro"><span>[ ${pad(n - 1)} ] ${label}</span><span>${pad(n)} / ${TOTAL}</span></header>
    <div class="m-body">${body}</div>
    <footer class="m-foot"><img src="${light ? LOGO_B : LOGO_W}" alt="LOLLY" /></footer>
  </section>`;
}

const tile = (i: number) => {
  const [f, t, d] = videos[i];
  return `<figure class="m-vt"><img src="${asset(`video/${f}-poster.jpg`)}" alt="" />${play}<figcaption><b>${t}</b><span class="micro">${d}</span></figcaption><div class="s-qr" data-qr="${qrFor(f)}"></div></figure>`;
};
const cityBlock = (c: (typeof cities)[number]) =>
  `<div class="m-city"><h3 class="display">${c.name}<small class="micro">${pad(c.clubs.length)}</small></h3><ul>${c.clubs.map((x) => `<li>${x}</li>`).join('')}</ul></div>`;
const relFig = (r: (typeof releases)[number]) =>
  `<figure class="m-rl"><img src="${asset(`img/releases/cover-${r.cover}.jpg`)}" alt="" /><figcaption class="micro"><b>${r.title}</b>${r.sub ? `<span>${r.sub}</span>` : ''}</figcaption></figure>`;

export function buildMobile(root: HTMLElement): void {
  // bio copy comes from the desktop markup so there is one source of text
  const paras = [...document.querySelectorAll('.s-about__text p')].map((p) => p.innerHTML);
  const myanmar = cities.filter((c) => c.country === 'Myanmar');
  const thailand = cities.filter((c) => c.country === 'Thailand');
  const myanmarVenues = myanmar.reduce((n, c) => n + c.clubs.length, 0);
  const pressList = ['01', '02', '03', '06', '07', '08'];
  const resRows = residencies.map((r) => `<li><i aria-hidden="true"></i><b>${r.from}${r.to ? `–${r.to}` : ''}</b><span>${r.club}</span></li>`).join('');

  const slides = [
    // 1 cover
    `<section class="slide m-slide m-cover">
      <img class="m-cover__bg" src="${asset('img/hero/hero-4-plate.jpg')}" alt="" />
      <span class="m-cover__word display" aria-hidden="true">LOLLY</span>
      <img class="m-cover__fig" src="${asset('img/hero/hero-4-cutout.png')}" alt="LOLLY" />
      <div class="s-shade"></div>
      <header class="m-head micro"><span>[ 00 ] Electronic Press Kit</span><span>01 / ${TOTAL}</span></header>
      <div class="m-body"></div>
      <footer class="m-foot m-foot--cover"><p class="micro">DJ / Producer — Yangon, Myanmar · Est. 2015</p><img src="${LOGO_W}" alt="LOLLY" /></footer>
    </section>`,
    // 2 about: manifesto with pills, live photo full-bleed, first paragraph
    slide(
      2,
      'About',
      'm-about1',
      `<h2 class="display m-h">Bass-driven <span class="pill"><img src="${asset('img/press/press-05.jpg')}" alt="" /></span> sets from Myanmar to the <span class="pill"><img src="${asset('img/live/live-03.jpg')}" alt="" /></span> region</h2>
       <img class="m-about1__ph" src="${asset('img/live/live-01.jpg')}" alt="" />
       <p class="m-lead">${paras[0]}</p>`,
    ),
    // 3 about: second paragraph over a darkened live photo
    slide(
      3,
      'About',
      'm-about2',
      `<div class="m-about2__text"><p class="m-lead">${paras[1]}</p>
       <dl class="m-facts"><div><dt>Base</dt><dd>Yangon, Myanmar</dd></div><div><dt>Study</dt><dd>AES Myanmar</dd></div><div><dt>Founder</dt><dd>THE LOLLYISM</dd></div></dl></div>`,
      `<img class="m-bgimg" src="${asset('img/live/live-02.jpg')}" alt="" /><div class="m-dim"></div>`,
    ),
    // 4 stats: portrait dissolving into the paper colour, numbers 2×3 below
    slide(
      4,
      'By the numbers',
      'm-stats',
      `<ol class="m-stats__list">
         <li><b>10+</b><span>years behind the decks</span></li><li><b>10</b><span>club residencies</span></li>
         <li><b>32</b><span>venues played</span></li><li><b>8</b><span>cities</span></li>
         <li><b>2</b><span>countries</span></li><li><b>7</b><span>original releases</span></li></ol>`,
      `<img class="photo-dissolve photo-dissolve--bottom m-stats__ph" src="${asset('img/press/press-07.jpg')}" alt="" />`,
      true,
    ),
    // 5 video: showreel on top, four posters 2×2
    slide(5, 'Video', 'm-video', `<div class="m-video__hero">${tile(0)}</div><div class="m-video__grid">${tile(1)}${tile(2)}${tile(3)}${tile(4)}</div>`),
    // 6 residencies: all ten on one timeline
    slide(6, 'Residencies', 'm-res', `<ol class="m-res__list">${resRows}</ol>`),
    // 7 Myanmar
    slide(
      7,
      'Clubs &amp; Tours',
      'm-myanmar',
      `<h2 class="display m-h">${myanmarVenues} venues<br /><span class="t-ash">${myanmar.length} cities</span></h2>
       <div class="m-myanmar__cols"><div class="m-col">${cityBlock(myanmar[0])}</div><div class="m-col">${myanmar.slice(1).map(cityBlock).join('')}</div></div>`,
    ),
    // 8 Thailand
    slide(
      8,
      'Clubs &amp; Tours',
      'm-thai',
      `<div class="m-thai__txt"><p class="micro">Regional experience · ${thailand[0].clubs.length} venues</p><h2 class="display m-h">Bangkok &amp; Phetchaburi</h2><ul class="m-thai__list">${thailand[0].clubs.map((c) => `<li>${c}</li>`).join('')}</ul></div>`,
      `<img class="m-thai__ph" src="${asset('img/live/live-04.jpg')}" alt="" /><div class="m-thai__fade"></div>`,
    ),
    // 9 releases 2×4, the eighth tile is the SoundCloud QR
    slide(9, 'Music', 'm-rel', `<div class="m-rel__grid">${releases.map(relFig).join('')}<figure class="m-rl m-rl--qr"><div class="s-qr" data-qr="${SOUNDCLOUD}"></div><figcaption class="micro"><b>Listen on SoundCloud</b></figcaption></figure></div>`),
    // 10 on stage: one big frame, three below
    slide(
      10,
      'On stage',
      'm-stage',
      `<div class="m-stage__grid"><img class="m-stage__big" src="${asset('img/live/live-01.jpg')}" alt="" /><img src="${asset('img/live/live-02.jpg')}" alt="" /><img src="${asset('img/live/live-03.jpg')}" alt="" /><img src="${asset('img/live/live-04.jpg')}" alt="" /></div>`,
    ),
    // 11 press photos 2×3 on paper
    slide(11, 'Press photos', 'm-press', `<div class="m-press__grid">${pressList.map((n) => `<img class="photo-dissolve" src="${asset(`img/press/press-${n}.jpg`)}" alt="" />`).join('')}</div>`, '', true),
    // 12 booking
    slide(
      12,
      'Booking',
      'm-book',
      `<div class="m-book__body">
         <p class="m-book__mail display">DJ.LOLLY.MT@GMAIL.COM</p>
         <ul class="m-book__list">
           <li><span class="micro">Phone</span>+959 459 181 060</li><li><span class="micro">WhatsApp</span>+959 459 181 060</li>
           <li><span class="micro">Viber</span>+959 459 181 060</li><li><span class="micro">Telegram</span>@lollymmofficial</li>
           <li><span class="micro">Instagram</span>@lolly_mmofficial</li><li><span class="micro">TikTok</span>@djlollyburma</li>
           <li><span class="micro">Facebook</span>LOLLY</li><li><span class="micro">SoundCloud</span>djlollymm</li>
         </ul>
         <div class="m-book__qr"><div class="s-qr" data-qr="site"></div><p class="micro">Scan for full press kit</p></div>
       </div>`,
      `<img class="m-bgimg m-book__bg" src="${asset('img/hero/hero-3-alt-red.jpg')}" alt="" /><div class="s-shade m-book__shade"></div>`,
    ),
  ];
  root.innerHTML = slides.join('');
}
