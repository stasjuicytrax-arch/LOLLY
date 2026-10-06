const desktop = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 768px)');

/**
 * Loop videos play only while visible. On touch/mobile they stay on the
 * poster (TZ §7: loops start on tap, never on load).
 */
export function lazyLoops(root: ParentNode = document): void {
  const all = root.querySelectorAll<HTMLVideoElement>('video[data-src]:not(.vcard video)');
  // Phones stay on posters, except videos that opt in (small muted loops).
  const videos = [...all].filter((v) => desktop.matches || v.hasAttribute('data-autoplay-mobile'));
  if (!videos.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const v = e.target as HTMLVideoElement;
        if (e.isIntersecting) {
          if (!v.src) v.src = v.dataset.src!;
          void v.play().catch(() => undefined);
        } else {
          v.pause();
        }
      }
    },
    { rootMargin: '150px' },
  );
  videos.forEach((v) => io.observe(v));
}
