import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reducedMotion } from './smooth';

gsap.registerPlugin(ScrollTrigger);

/**
 * Fade-up for every [data-fade] on the page (one place, so no section is forgotten).
 * Content is only hidden while the `js` class is on <html>; reduced motion shows everything at once.
 */
export function initReveal(): void {
  const els = gsap.utils.toArray<HTMLElement>('[data-fade]');
  if (reducedMotion) {
    gsap.set(els, { opacity: 1, y: 0 });
    return;
  }
  els.forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
    });
  });
}
