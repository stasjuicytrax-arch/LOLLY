import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reducedMotion } from './smooth';

gsap.registerPlugin(ScrollTrigger);

/** Scoreboard digits: each digit is a column of 0–9 that rolls to its value. */
export function initStats(): void {
  const nums = gsap.utils.toArray<HTMLElement>('[data-count]');
  if (reducedMotion) return;

  nums.forEach((el) => {
    const value = el.dataset.count!;
    const suffix = el.dataset.suffix ?? '';
    el.textContent = '';
    const cols: HTMLElement[] = [];
    const targets: number[] = [];

    [...value].forEach((ch, i) => {
      const loops = 1 + i; // later digits spin further so the roll reads as counting
      const odo = document.createElement('span');
      odo.className = 'odo';
      odo.setAttribute('aria-hidden', 'true');
      const col = document.createElement('span');
      col.className = 'odo__col';
      for (let n = 0; n < (loops + 1) * 10; n++) {
        const s = document.createElement('span');
        s.textContent = String(n % 10);
        col.appendChild(s);
      }
      odo.appendChild(col);
      el.appendChild(odo);
      cols.push(col);
      targets.push(loops * 10 + Number(ch));
    });
    if (suffix) {
      const p = document.createElement('span');
      p.className = 'stat__plus';
      p.setAttribute('aria-hidden', 'true');
      p.textContent = suffix;
      el.appendChild(p);
    }

    cols.forEach((col) => gsap.set(col, { yPercent: 0 }));
    gsap.to(cols, {
      yPercent: (i: number) => -(targets[i] / col_len(cols[i])) * 100,
      duration: 2.2,
      ease: 'expo.out',
      stagger: 0.12,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });

}

function col_len(col: HTMLElement): number {
  return col.children.length;
}
