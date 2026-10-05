import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reducedMotion } from './smooth';

gsap.registerPlugin(ScrollTrigger);

/** Pinned scrub: the centre pill opens into a full-bleed frame while the two words part. */
export function initShowreel(): void {
  const section = document.querySelector<HTMLElement>('.showreel');
  const stage = section?.querySelector<HTMLElement>('.showreel__stage');
  const media = section?.querySelector<HTMLElement>('.showreel__media');
  if (!section || !stage || !media || reducedMotion) return;

  const mm = gsap.matchMedia();
  const build = (from: string) => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: section, start: 'top top', end: '+=130%', pin: stage, scrub: 0.6, anticipatePin: 1 },
      defaults: { ease: 'none' },
    });
    tl.fromTo(media, { clipPath: from }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'power2.inOut' }, 0)
      .fromTo(media.querySelector('video'), { scale: 1.25 }, { scale: 1 }, 0)
      .to('.showreel__word--l', { xPercent: -140, opacity: 0 }, 0)
      .to('.showreel__word--r', { xPercent: 140, opacity: 0 }, 0)
      .to('.showreel__play', { opacity: 0 }, 0.8);
    return () => tl.scrollTrigger?.kill();
  };
  mm.add('(min-width: 768px)', () => build('inset(41% 30% 41% 30% round 999px)'));
  mm.add('(max-width: 767px)', () => build('inset(40% 14% 40% 14% round 999px)'));
}
