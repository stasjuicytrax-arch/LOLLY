const desktop = window.matchMedia('(hover: hover) and (pointer: fine)');

/** Video wall: drag-to-scroll track and hover-to-play loops. */
export function initWall(): void {
  const track = document.querySelector<HTMLElement>('[data-drag]');
  if (!track) return;

  // Drag with a mouse; touch uses native overflow scrolling.
  let down = false;
  let startX = 0;
  let startLeft = 0;
  let moved = 0;
  track.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return;
    down = true;
    moved = 0;
    startX = e.clientX;
    startLeft = track.scrollLeft;
  });
  window.addEventListener('pointermove', (e) => {
    if (!down) return;
    const dx = e.clientX - startX;
    moved = Math.max(moved, Math.abs(dx));
    if (moved > 5) track.classList.add('is-dragging');
    track.scrollLeft = startLeft - dx;
  });
  window.addEventListener('pointerup', () => {
    down = false;
    // Let the click that ends a drag be swallowed.
    setTimeout(() => track.classList.remove('is-dragging'), 0);
  });
  track.addEventListener(
    'click',
    (e) => {
      if (moved > 5) {
        e.stopPropagation();
        e.preventDefault();
        moved = 0;
      }
    },
    true,
  );

  if (!desktop.matches) return;
  track.querySelectorAll<HTMLElement>('.vcard button').forEach((card) => {
    const v = card.querySelector<HTMLVideoElement>('video');
    if (!v) return;
    const on = () => {
      if (!v.src) v.src = v.dataset.src!;
      void v.play().catch(() => undefined);
    };
    const off = () => v.pause();
    card.addEventListener('pointerenter', on);
    card.addEventListener('pointerleave', off);
    card.addEventListener('focus', on);
    card.addEventListener('blur', off);
  });
}
