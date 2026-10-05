import { gsap } from 'gsap';
import { reducedMotion } from './smooth';

const MIN_MS = 1600;
const MAX_MS = 2000; // TZ §9: preloader never longer than 2s

/** Resolves when the hero image is decoded, or after the cap. */
function heroReady(): Promise<void> {
  const img = document.querySelector<HTMLImageElement>('.hero__bg img');
  const decode = img ? img.decode().catch(() => undefined) : Promise.resolve();
  return Promise.race([decode, new Promise<void>((r) => setTimeout(r, MAX_MS))]).then(() => undefined);
}

/**
 * Spiral spins, counter runs 000→100, a red plane rises over the screen and
 * leaves upward, uncovering the hero. Resolves the moment the hero is visible.
 */
export function runPreloader(): Promise<void> {
  const pre = document.querySelector<HTMLElement>('.pre');
  if (!pre) return Promise.resolve();
  const done = () => {
    pre.remove();
    document.body.classList.remove('is-loading');
  };
  if (reducedMotion) {
    done();
    return Promise.resolve();
  }

  const count = pre.querySelector<HTMLElement>('[data-pre-count]')!;
  const spiral = pre.querySelector<HTMLElement>('.pre__spiral')!;
  const curtain = pre.querySelector<HTMLElement>('.pre__curtain')!;
  const counter = { v: 0 };

  return new Promise((resolve) => {
    const tl = gsap.timeline();
    tl.to(counter, {
      v: 100,
      duration: MIN_MS / 1000,
      ease: 'power2.inOut',
      onUpdate: () => {
        count.textContent = String(Math.round(counter.v)).padStart(3, '0');
      },
    })
      .to(spiral, { rotation: 540, duration: MIN_MS / 1000, ease: 'power3.in' }, 0)
      .add(() => {
        tl.pause();
        heroReady().then(() => tl.resume());
      })
      .to(curtain, { yPercent: 0, duration: 0.7, ease: 'power3.inOut' })
      .set(pre, { backgroundColor: 'transparent' })
      .set([spiral, count, '.pre__label'], { autoAlpha: 0 })
      .set(curtain, { borderRadius: '0 0 32px 32px' })
      .to(curtain, { yPercent: -101, duration: 0.9, ease: 'power3.inOut' })
      .add(() => resolve(), '<+0.35')
      .add(done);
  });
}
