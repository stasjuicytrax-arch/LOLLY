import { gsap } from 'gsap';
import type Lenis from 'lenis';
import { reducedMotion } from './smooth';

/**
 * Two genre lines moving against each other. Base drift is slow; scroll
 * velocity adds speed and the direction follows the scroll.
 */
export function initMarquee(lenis: Lenis | null): void {
  const rows = gsap.utils.toArray<HTMLElement>('[data-marquee]');
  if (!rows.length) return;

  rows.forEach((row) => {
    const set = row.querySelector<HTMLElement>('.marquee__set')!;
    // Clone the set until the row is wider than two viewports so the loop is seamless.
    const need = Math.ceil((window.innerWidth * 2) / set.offsetWidth) + 1;
    for (let i = 0; i < need; i++) {
      const c = set.cloneNode(true) as HTMLElement;
      c.setAttribute('aria-hidden', 'true');
      row.appendChild(c);
    }
  });
  if (reducedMotion) return;

  const state = rows.map((row) => ({
    row,
    dir: Number(row.dataset.marquee) || -1,
    x: 0,
    w: row.querySelector<HTMLElement>('.marquee__set')!.offsetWidth,
  }));
  window.addEventListener('resize', () => state.forEach((s) => (s.w = s.row.querySelector<HTMLElement>('.marquee__set')!.offsetWidth)));

  let boost = 0;
  gsap.ticker.add((_t, dt) => {
    const v = lenis ? lenis.velocity : 0;
    boost += (Math.min(Math.abs(v), 40) - boost) * 0.08;
    const flip = v < -0.5 ? -1 : 1; // scroll up reverses the drift
    for (const s of state) {
      s.x += s.dir * flip * (0.5 + boost * 0.35) * (dt / 16.7);
      if (s.x <= -s.w) s.x += s.w;
      if (s.x > 0) s.x -= s.w;
      s.row.style.transform = `translate3d(${s.x}px,0,0)`;
    }
  });
}
