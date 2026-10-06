/**
 * "Download PDF press kit" opens a small chooser: Desktop (16:9) or Mobile (9:16).
 * On phones the mobile file comes first and is marked as the suggested one.
 * Triggers: any <a data-pdf>. Without JS the link itself downloads the desktop file.
 */
const FILES = {
  desktop: { href: './LOLLY-presskit-desktop.pdf', name: 'LOLLY-presskit-desktop.pdf', title: 'Desktop (16:9)', note: '1920 × 1080, for screens and email' },
  mobile: { href: './LOLLY-presskit-mobile.pdf', name: 'LOLLY-presskit-mobile.pdf', title: 'Mobile (9:16)', note: '1080 × 1920, made for reading on a phone' },
} as const;

export function initPdfMenu(): void {
  const triggers = document.querySelectorAll<HTMLAnchorElement>('a[data-pdf]');
  if (!triggers.length) return;
  const phone = window.matchMedia('(hover: none), (max-width: 767px)').matches;
  const order: (keyof typeof FILES)[] = phone ? ['mobile', 'desktop'] : ['desktop', 'mobile'];

  const dlg = document.createElement('dialog');
  dlg.className = 'pdfmenu';
  dlg.setAttribute('aria-label', 'Download PDF press kit');
  dlg.innerHTML = `
    <p class="micro pdfmenu__lab">Download PDF press kit</p>
    <ul class="pdfmenu__list">${order
      .map((k, i) => {
        const f = FILES[k];
        const rec = i === 0 && phone ? '<em class="micro">Suggested for your phone</em>' : '';
        return `<li><a class="pdfmenu__item" href="${f.href}" download="${f.name}"><span><b>${f.title}</b><small>${f.note}</small>${rec}</span><i aria-hidden="true">↓</i></a></li>`;
      })
      .join('')}</ul>
    <button class="pdfmenu__close micro" type="button">Close</button>`;
  document.body.appendChild(dlg);

  const close = () => dlg.open && dlg.close();
  dlg.querySelector('.pdfmenu__close')!.addEventListener('click', close);
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg || (e.target as Element).closest('.pdfmenu__item')) close();
  });
  triggers.forEach((a) =>
    a.addEventListener('click', (e) => {
      e.preventDefault();
      dlg.showModal();
    }),
  );
}
