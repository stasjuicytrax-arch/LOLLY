import { gsap } from 'gsap';
import { reducedMotion } from './smooth';

/**
 * Horizontal ribbons: video wall, residencies, city tabs, releases, press photos.
 * Every ribbon gets, always and on every device:
 *  - a hint above it, on the right: "DRAG / SCROLL →" with ← → buttons (desktop) or "SWIPE →" with a pulsing arrow (touch / narrow)
 *  - a fading right edge (removed once the end is reached)
 *  - a 1px progress line below it
 * The residencies ribbon on wide screens is a pinned scene driven by the page scroll, so it gets the hint and fade only.
 */
const SELECTOR = '.wall__track, .res__viewport, .tours__cities, .music__track, .pressph__track';

function build(track: HTMLElement): void {
  const pinned = track.classList.contains('res__viewport');
  track.classList.add('ribbon');

  const bar = document.createElement('div');
  bar.className = 'ribbon-bar';
  bar.innerHTML = `
    <span class="ribbon-bar__hint micro" aria-hidden="true">
      <span class="hint-d">${pinned ? 'Scroll' : 'Drag / Scroll'}</span><span class="hint-m">Swipe</span>
      <i class="hint-arrow">→</i>
    </span>
    <span class="ribbon-bar__btns">
      <button type="button" class="ribbon-btn" data-dir="-1" aria-label="Scroll left">←</button>
      <button type="button" class="ribbon-btn" data-dir="1" aria-label="Scroll right">→</button>
    </span>`;
  track.insertAdjacentElement('beforebegin', bar);

  const prog = document.createElement('div');
  prog.className = 'ribbon-prog';
  prog.setAttribute('aria-hidden', 'true');
  prog.innerHTML = '<i></i>';
  track.insertAdjacentElement('afterend', prog);

  const [prev, next] = [...bar.querySelectorAll<HTMLButtonElement>('.ribbon-btn')];
  const fill = prog.querySelector<HTMLElement>('i')!;

  const step = () => {
    const first = track.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return (first ? first.getBoundingClientRect().width : track.clientWidth * 0.8) + gap;
  };
  const update = () => {
    // Wide screens: the residencies ribbon is a pinned scene (overflow hidden), moved by the page scroll.
    const scene = pinned && getComputedStyle(track).overflowX === 'hidden';
    bar.classList.toggle('is-label-only', scene);
    const max = track.scrollWidth - track.clientWidth;
    const scrollable = max > 8 && !scene;
    const ratio = scrollable ? Math.min(1, Math.max(0, track.scrollLeft / max)) : 0;
    fill.style.transform = `scaleX(${scrollable ? Math.max(ratio, 0.04) : 0})`;
    const atEnd = !scrollable || track.scrollLeft >= max - 4;
    track.classList.toggle('at-end', atEnd);
    prev.disabled = !scrollable || track.scrollLeft <= 4;
    next.disabled = atEnd;
    // On wide screens the pinned residencies scene (and the vertical city list) is not a scrolling ribbon.
    const live = scrollable || scene;
    bar.hidden = !live;
    prog.hidden = !scrollable;
  };

  prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: reducedMotion ? 'auto' : 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: reducedMotion ? 'auto' : 'smooth' }));
  track.addEventListener('scroll', update, { passive: true });
  new ResizeObserver(update).observe(track);
  window.addEventListener('resize', update);
  update();
}

export function initSwipeHints(): void {
  document.querySelectorAll<HTMLElement>(SELECTOR).forEach(build);

  // Touch only: one small nudge the first time a ribbon is on screen. The hint itself never goes away.
  if (reducedMotion || !window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll<HTMLElement>('.ribbon').forEach((track) => {
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        if (track.scrollWidth <= track.clientWidth + 8) return;
        const snap = track.style.scrollSnapType;
        track.style.scrollSnapType = 'none';
        const s = { x: 0 };
        gsap
          .timeline({ onComplete: () => { track.style.scrollSnapType = snap; } })
          .to(s, { x: 56, duration: 0.55, ease: 'power2.out', delay: 0.4, onUpdate: () => (track.scrollLeft = s.x) })
          .to(s, { x: 0, duration: 0.7, ease: 'power2.inOut', onUpdate: () => (track.scrollLeft = s.x) });
      },
      { threshold: 0.6 },
    );
    io.observe(track);
  });
}
