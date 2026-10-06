import type Lenis from 'lenis';

/**
 * One native <dialog> for everything: full videos (with sound) and photos.
 * Triggers: [data-lightbox-video] (data-full, data-loop, data-poster)
 *           [data-lightbox-image] (data-full, data-alt)
 * Full videos are published with the site. If one ever fails to load, the muted loop plays instead (silently).
 */
export function initLightbox(lenis: Lenis | null): void {
  const dlg = document.createElement('dialog');
  dlg.className = 'lightbox';
  dlg.setAttribute('aria-label', 'Media viewer');
  dlg.innerHTML = `
    <button class="lightbox__close" type="button">Close ✕</button>
    <div class="lightbox__stage"></div>`;
  document.body.appendChild(dlg);
  const stage = dlg.querySelector<HTMLElement>('.lightbox__stage')!;
  let opener: HTMLElement | null = null;

  const close = () => {
    if (dlg.open) dlg.close();
  };
  dlg.addEventListener('close', () => {
    stage.querySelector('video')?.pause();
    stage.replaceChildren();
    lenis?.start();
    document.documentElement.style.overflow = '';
    opener?.focus({ preventScroll: true });
  });
  dlg.querySelector('.lightbox__close')!.addEventListener('click', close);
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg || e.target === stage) close();
  });

  const show = () => {
    lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
    dlg.showModal();
  };

  document.addEventListener('click', (e) => {
    const t = (e.target as Element).closest<HTMLElement>('[data-lightbox-video], [data-lightbox-image]');
    if (!t) return;
    e.preventDefault();
    opener = t;
    stage.replaceChildren();

    if (t.hasAttribute('data-lightbox-image')) {
      const img = document.createElement('img');
      img.src = t.dataset.full!;
      img.alt = t.dataset.alt ?? '';
      stage.appendChild(img);
      show();
      return;
    }

    const v = document.createElement('video');
    v.controls = true;
    v.playsInline = true;
    v.autoplay = true;
    v.poster = t.dataset.poster ?? '';
    v.src = t.dataset.full!;
    v.addEventListener(
      'error',
      () => {
        v.muted = true;
        v.loop = true;
        v.controls = false;
        v.src = t.dataset.loop!;
        void v.play().catch(() => undefined);
      },
      { once: true },
    );
    stage.appendChild(v);
    show();
    void v.play().catch(() => undefined);
  });
}
