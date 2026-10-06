import { gsap } from 'gsap';
import { reducedMotion } from './smooth';

const touch = window.matchMedia('(hover: none)');

/**
 * Touch only: a mono "SWIPE →" label above every horizontal ribbon, and one nudge
 * (left and back) the first time the ribbon scrolls into view. Both go away after the first real swipe.
 */
export function initSwipeHints(): void {
  if (!touch.matches) return;
  const tracks = document.querySelectorAll<HTMLElement>('.wall__track, .res__viewport, .tours__cities, .music__track, .pressph__track');
  tracks.forEach((track) => {
    const label = document.createElement('p');
    label.className = 'swipe micro';
    label.setAttribute('aria-hidden', 'true');
    label.textContent = 'Swipe →';
    track.insertAdjacentElement('beforebegin', label);

    let done = false;
    const dismiss = () => {
      if (done) return;
      done = true;
      label.remove();
    };
    // Only a real touch counts as a swipe (scroll-snap also moves the ribbon by itself).
    track.addEventListener('touchmove', dismiss, { passive: true, once: true });

    if (reducedMotion) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        if (done || track.scrollWidth <= track.clientWidth + 8) return;
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
