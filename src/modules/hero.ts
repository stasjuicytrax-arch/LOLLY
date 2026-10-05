import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import type Lenis from 'lenis';
import { initShader } from './shader';
import { reducedMotion } from './smooth';

gsap.registerPlugin(ScrollTrigger, SplitText);

const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/** Letters rise from a mask, one by one. Called once the preloader curtain has left. */
export function revealHero(): void {
  const word = document.querySelector<HTMLElement>('[data-hero-word] span');
  const bg = document.querySelectorAll('.hero__bg, .hero__cutout');
  const meta = gsap.utils.toArray<HTMLElement>('.hero [data-reveal]');
  if (reducedMotion || !word) {
    gsap.set(meta, { opacity: 1, y: 0 });
    return;
  }
  const split = SplitText.create(word, { type: 'chars', mask: 'chars', charsClass: 'hero-char' });
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.fromTo(bg, { scale: 1.12 }, { scale: 1, duration: 1.8 }, 0)
    .from(split.chars, { yPercent: 115, duration: 1.2, stagger: 0.055 }, 0.1)
    .to(meta, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.6);
}

/** Cursor and scroll parallax, shader hookup, velocity-driven width "breathing". */
export function initHero(lenis: Lenis | null): void {
  const hero = document.querySelector<HTMLElement>('.hero');
  const word = document.querySelector<HTMLElement>('[data-hero-word]');
  const bg = document.querySelector<HTMLElement>('[data-hero-bg]');
  const cut = document.querySelector<HTMLElement>('[data-hero-cutout]');
  const canvas = document.querySelector<HTMLCanvasElement>('[data-hero-shader]');
  if (!hero || !word || !bg || !cut) return;
  if (reducedMotion) return;

  const shader = canvas ? initShader(canvas, hero) : null;

  // Photo and figure move as one body; the word sits at a different depth.
  const bodyX = gsap.quickTo([bg, cut], 'x', { duration: 1.1, ease: 'power3.out' });
  const bodyY = gsap.quickTo([bg, cut], 'y', { duration: 1.1, ease: 'power3.out' });
  const wordX = gsap.quickTo(word, 'x', { duration: 1.1, ease: 'power3.out' });
  const wordY = gsap.quickTo(word, 'y', { duration: 1.1, ease: 'power3.out' });

  let sy = 0; // scroll offset contribution
  if (finePointer) {
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      bodyX(nx * -22);
      bodyY(ny * -14 + sy * 0.18);
      wordX(nx * 46);
      wordY(ny * 28 + sy * 0.5);
      shader?.mouse(nx + 0.5, ny + 0.5);
    });
  }

  // Scroll parallax: photo+figure drift slowly, the word faster, opposite way.
  ScrollTrigger.create({
    trigger: hero,
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => {
      sy = self.progress * hero.offsetHeight;
      gsap.set([bg, cut], { yPercent: self.progress * 8 });
      gsap.set(word, { yPercent: self.progress * -22 });
    },
  });

  // "Breathing": the word compresses on fast scrolling and relaxes at rest.
  if (lenis) {
    const setW = gsap.quickTo(word, '--wdth', { duration: 0.5, ease: 'power2.out' });
    lenis.on('scroll', ({ velocity }: { velocity: number }) => {
      setW(125 - Math.min(Math.abs(velocity) * 5, 63));
    });
    gsap.ticker.add(() => {
      if (Math.abs(lenis.velocity) < 0.05) setW(125);
    });
  }
}
