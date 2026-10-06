import { gsap } from 'gsap';
import { cities, totalVenues } from '../data/content';
import { reducedMotion } from './smooth';

const asset = (p: string) => `${import.meta.env.BASE_URL}assets/${p}`;

// Decorative hover previews. Only the two venue-identified frames are matched to a club
// (THOR logo is visible in live-04, SONO screen in live-03); everything else cycles.
const PREVIEWS = ['img/live/live-01.jpg', 'img/live/live-02.jpg', 'img/press/press-04.jpg', 'img/press/press-06.jpg', 'img/press/press-07.jpg', 'img/press/press-08.jpg'];
const MATCHED: Record<string, string> = { 'THOR Premium Lounge': 'img/live/live-04.jpg', 'SONO Club': 'img/live/live-03.jpg' };

const fine = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)');

/** City list on the left, venues for the selected city on the right, a photo trailing the cursor. */
export function initTours(): void {
  const citiesEl = document.querySelector<HTMLElement>('[data-cities]');
  const clubsEl = document.querySelector<HTMLElement>('[data-clubs]');
  const preview = document.querySelector<HTMLElement>('[data-preview]');
  if (!citiesEl || !clubsEl) return;

  document.querySelector('[data-tours-total]')!.textContent = String(totalVenues);
  document.querySelector('[data-tours-cities]')!.textContent = String(cities.length);

  let n = 0;
  let group = '';
  citiesEl.innerHTML = cities
    .map((c, i) => {
      const head =
        c.country !== group
          ? `<li class="cities__group micro" aria-hidden="true">${c.note ? `${c.country} — ${c.note}` : c.country}</li>`
          : '';
      group = c.country;
      return `${head}<li><button class="cityrow" type="button" data-city="${c.id}" aria-pressed="${i === 0}" aria-controls="clubs-${c.id}">
        <span>${c.name}</span><small>${String(c.clubs.length).padStart(2, '0')}</small></button></li>`;
    })
    .join('');
  clubsEl.innerHTML = cities
    .map(
      (c, i) => `<ul class="clubs" id="clubs-${c.id}" ${i === 0 ? '' : 'hidden'}>
        ${c.clubs
          .map((club) => {
            const src = MATCHED[club] ?? PREVIEWS[n++ % PREVIEWS.length];
            return `<li class="clubrow" data-preview-src="${src}"><span>${club}</span><span class="micro">${c.name.split(' ')[0].slice(0, 3).toUpperCase()}</span></li>`;
          })
          .join('')}
      </ul>`,
    )
    .join('');

  const select = (id: string) => {
    citiesEl.querySelectorAll<HTMLElement>('.cityrow').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.city === id)));
    clubsEl.querySelectorAll<HTMLElement>('.clubs').forEach((u) => {
      const on = u.id === `clubs-${id}`;
      u.hidden = !on;
      if (on && !reducedMotion) gsap.fromTo(u.children, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.03, ease: 'expo.out' });
    });
  };
  citiesEl.addEventListener('click', (e) => {
    const b = (e.target as Element).closest<HTMLElement>('[data-city]');
    if (b) select(b.dataset.city!);
  });
  if (fine.matches) {
    citiesEl.addEventListener('pointerover', (e) => {
      const b = (e.target as Element).closest<HTMLElement>('[data-city]');
      if (b && b.getAttribute('aria-pressed') !== 'true') select(b.dataset.city!);
    });
  }

  if (!preview || !fine.matches || reducedMotion) return;
  // The <img> exists only once there is something to show (no empty-src placeholder).
  let img: HTMLImageElement | null = null;
  const x = gsap.quickTo(preview, 'x', { duration: 0.7, ease: 'power3.out' });
  const y = gsap.quickTo(preview, 'y', { duration: 0.7, ease: 'power3.out' });
  const rot = gsap.quickTo(preview, 'rotation', { duration: 0.8, ease: 'power3.out' });
  let lastX = 0;
  clubsEl.addEventListener('pointermove', (e) => {
    x(e.clientX + 28);
    y(e.clientY - 120);
    rot(Math.max(-8, Math.min(8, (e.clientX - lastX) * 0.4)));
    lastX = e.clientX;
  });
  clubsEl.addEventListener('pointerover', (e) => {
    const row = (e.target as Element).closest<HTMLElement>('[data-preview-src]');
    if (!row) return;
    if (!img) {
      img = document.createElement('img');
      img.alt = '';
      preview.appendChild(img);
    }
    img.src = asset(row.dataset.previewSrc!);
    gsap.to(preview, { opacity: 1, scale: 1, duration: 0.35, ease: 'expo.out', overwrite: 'auto' });
  });
  clubsEl.addEventListener('pointerleave', () => gsap.to(preview, { opacity: 0, scale: 0.92, duration: 0.3, overwrite: 'auto' }));
}
