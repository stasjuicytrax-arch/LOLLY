import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type Lenis from 'lenis';
import { reducedMotion } from './smooth';

gsap.registerPlugin(ScrollTrigger);

/** Hide on scroll down, show on scroll up; 1px progress line; section highlight; mobile menu; anchor scrolling. */
export function initNav(lenis: Lenis | null): void {
  const nav = document.querySelector<HTMLElement>('.nav');
  const bar = document.querySelector<HTMLElement>('.nav__progress');
  const menu = document.querySelector<HTMLElement>('#menu');
  const toggle = document.querySelector<HTMLButtonElement>('.nav__menu');
  if (!nav || !bar) return;

  const scrollTo = (hash: string) => {
    const t = document.querySelector<HTMLElement>(hash);
    if (!t) return;
    if (lenis) lenis.scrollTo(t, { duration: 1.4, easing: (x) => 1 - Math.pow(1 - x, 4) });
    else t.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  };
  const closeMenu = () => {
    if (!menu || menu.hidden) return;
    menu.hidden = true;
    toggle?.setAttribute('aria-expanded', 'false');
    if (toggle) toggle.textContent = 'Menu';
    lenis?.start();
  };
  document.addEventListener('click', (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a || a.getAttribute('href') === '#') return;
    e.preventDefault();
    closeMenu();
    const hash = a.getAttribute('href')!;
    // Let the menu close before measuring; also pin-spacers shift positions.
    requestAnimationFrame(() => scrollTo(hash));
    history.replaceState(null, '', hash);
  });
  toggle?.addEventListener('click', () => {
    if (!menu) return;
    const open = menu.hidden;
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Close' : 'Menu';
    if (open) lenis?.stop();
    else lenis?.start();
  });
  window.addEventListener('keydown', (e) => e.key === 'Escape' && closeMenu());

  // Direction-aware hide/show.
  let last = window.scrollY;
  window.addEventListener(
    'scroll',
    () => {
      const y = window.scrollY;
      const dy = y - last;
      if (Math.abs(dy) > 6) {
        nav.classList.toggle('is-hidden', dy > 0 && y > 120);
        last = y;
      }
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    },
    { passive: true },
  );

  // Highlight the section in view.
  const links = new Map<string, HTMLElement>();
  document.querySelectorAll<HTMLAnchorElement>('.nav__links a').forEach((a) => links.set(a.getAttribute('href')!, a));
  links.forEach((_a, hash) => {
    const sec = document.querySelector(hash);
    if (!sec) return;
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => links.forEach((a, h) => (h === hash ? a.setAttribute('aria-current', String(self.isActive)) : self.isActive && a.setAttribute('aria-current', 'false'))),
    });
  });
}
