import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reducedMotion } from './smooth';

gsap.registerPlugin(ScrollTrigger);

const fine = window.matchMedia('(hover: hover) and (pointer: fine)');

function toast(text: string): void {
  const el = document.querySelector<HTMLElement>('[data-toast]');
  if (!el) return;
  el.textContent = text;
  el.classList.add('is-on');
  window.setTimeout(() => el.classList.remove('is-on'), 1800);
}

async function copy(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Clipboard API can be blocked (insecure context, permissions): fall back to a hidden textarea.
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}

/** Click-to-copy email with a toast, magnetic social links, reveal on scroll. */
export function initBooking(): void {
  document.querySelectorAll<HTMLElement>('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      toast((await copy(btn.dataset.copy!)) ? 'Copied' : 'Press Ctrl+C to copy');
    });
  });

  if (fine.matches && !reducedMotion) {
    document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
      const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
      const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        x(((e.clientX - r.left) / r.width - 0.5) * 24); // ≤12px each way
        y(((e.clientY - r.top) / r.height - 0.5) * 24);
      });
      el.addEventListener('pointerleave', () => {
        x(0);
        y(0);
      });
    });
  }

  const mail = document.querySelector<HTMLElement>('.booking__mail');
  if (mail && !reducedMotion) {
    gsap.from(mail, { yPercent: 40, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: mail, start: 'top 90%', once: true } });
  }
}
