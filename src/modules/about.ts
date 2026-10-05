import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type Lenis from 'lenis';
import { reducedMotion } from './smooth';

gsap.registerPlugin(ScrollTrigger);

const wide = window.matchMedia('(min-width: 768px)');

/** Manifesto: lines rise from masks, pills open, copy fades up, the headline breathes with scroll speed. */
export function initAbout(lenis: Lenis | null): void {
  const title = document.querySelector<HTMLElement>('.about__title');
  if (!title) return;
  const lines = title.querySelectorAll('.line__in');
  const pills = title.querySelectorAll<HTMLElement>('[data-pill]');
  const fades = gsap.utils.toArray<HTMLElement>('.about [data-fade]');
  if (reducedMotion) return;

  gsap.set(lines, { yPercent: 112 });
  gsap.set(pills, { clipPath: 'inset(0% 50% 0% 50% round 999px)' });

  gsap
    .timeline({ scrollTrigger: { trigger: title, start: 'top 80%', once: true }, defaults: { ease: 'expo.out' } })
    .to(lines, { yPercent: 0, duration: 1.2, stagger: 0.12 })
    .to(pills, { clipPath: 'inset(0% 0% 0% 0% round 999px)', duration: 1.3, stagger: 0.15 }, 0.35);

  fades.forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  // Width "breathing" (DESIGN_SYSTEM §7.3): compress while scrolling fast, relax at rest. Desktop only: wrapped lines would reflow.
  if (lenis) {
    const set = gsap.quickTo(title, '--wdth', { duration: 0.6, ease: 'power2.out' });
    lenis.on('scroll', ({ velocity }: { velocity: number }) => {
      if (wide.matches) set(100 - Math.min(Math.abs(velocity) * 3, 38));
    });
    gsap.ticker.add(() => {
      if (Math.abs(lenis.velocity) < 0.05) set(100);
    });
  }
}
