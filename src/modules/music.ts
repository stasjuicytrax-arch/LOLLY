import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { links, releases } from '../data/content';
import { reducedMotion } from './smooth';

gsap.registerPlugin(ScrollTrigger);

const asset = (p: string) => `${import.meta.env.BASE_URL}assets/${p}`;
const fine = window.matchMedia('(hover: hover) and (pointer: fine)');

/** Release ribbon (tilt on hover) and a lazy SoundCloud player. */
export function initMusic(): void {
  const track = document.querySelector<HTMLElement>('[data-releases]');
  if (track) {
    track.innerHTML = releases
      .map((r, i) => {
        const base = `img/releases/cover-${r.cover}`;
        const picture = r.placeholder
          ? `<img src="${asset(`${base}.jpg`)}" alt="${r.title} cover (placeholder)" width="372" height="280" loading="lazy" decoding="async" />`
          : `<picture><source type="image/webp" srcset="${asset(`${base}.webp`)}" /><img src="${asset(`${base}.jpg`)}" alt="${r.title} cover" width="1200" height="1200" loading="lazy" decoding="async" /></picture>`;
        return `<article class="rel" style="--i:${i}">
          <a class="rel__card" href="${links.soundcloud}" target="_blank" rel="noopener" aria-label="${r.title}${r.sub ? `, ${r.sub}` : ''} on SoundCloud" data-cursor="LISTEN">${picture}</a>
          <p class="rel__meta micro"><span>${String(i + 1).padStart(2, '0')}</span><b>${r.title}</b></p>
          ${r.sub ? `<p class="rel__sub micro">${r.sub}</p>` : ''}
        </article>`;
      })
      .join('');

    if (fine.matches && !reducedMotion) {
      track.querySelectorAll<HTMLElement>('.rel__card').forEach((card) => {
        const rx = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3.out' });
        const ry = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3.out' });
        card.addEventListener('pointermove', (e) => {
          const r = card.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 16);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 16);
        });
        card.addEventListener('pointerleave', () => {
          rx(0);
          ry(0);
        });
      });
    }
  }

  // The player loads only when it is about to be seen.
  const frame = document.querySelector<HTMLIFrameElement>('[data-sc-player] iframe');
  if (frame) {
    new IntersectionObserver(
      (entries, io) => {
        if (entries[0].isIntersecting) {
          frame.src = frame.dataset.src!;
          io.disconnect();
        }
      },
      { rootMargin: '300px' },
    ).observe(frame);
  }
}
