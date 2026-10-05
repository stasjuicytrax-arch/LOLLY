import { gsap } from 'gsap';

/** Signal dot that grows into a labelled circle over [data-cursor] elements. Fine pointers only. */
export function initCursor(): void {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const dot = document.createElement('div');
  dot.className = 'cursor';
  dot.setAttribute('aria-hidden', 'true');
  const disc = document.createElement('i');
  disc.className = 'cursor__dot';
  const label = document.createElement('span');
  dot.append(disc, label);
  document.body.appendChild(dot);
  document.documentElement.classList.add('has-cursor');

  const x = gsap.quickTo(dot, 'x', { duration: 0.25, ease: 'power3.out' });
  const y = gsap.quickTo(dot, 'y', { duration: 0.25, ease: 'power3.out' });
  gsap.set(dot, { opacity: 0 });

  window.addEventListener('pointermove', (e) => {
    x(e.clientX);
    y(e.clientY);
    gsap.to(dot, { opacity: 1, duration: 0.2, overwrite: 'auto' });
    // Innermost labelled element wins (a PLAY card inside a DRAG track).
    const host = (e.target as Element).closest<HTMLElement>('[data-cursor]');
    const text = host?.dataset.cursor ?? '';
    label.textContent = text;
    dot.classList.toggle('is-label', Boolean(text));
  });
  document.addEventListener('pointerleave', () => gsap.to(dot, { opacity: 0, duration: 0.2 }));
}
