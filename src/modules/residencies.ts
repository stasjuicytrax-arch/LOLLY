import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { residencies } from '../data/content';
import { reducedMotion } from './smooth';

gsap.registerPlugin(ScrollTrigger);

const pad = (n: number) => String(n).padStart(2, '0');

function render(): void {
  const track = document.querySelector<HTMLElement>('[data-residencies]');
  const ticks = document.querySelector<HTMLElement>('[data-res-ticks]');
  if (!track || !ticks) return;
  const latest = Math.max(...residencies.map((r) => r.to ?? r.from));
  track.innerHTML = residencies
    .map((r, i) => {
      const range = r.to ? `<span class="rpanel__to">–${r.to}</span>` : '';
      return `<li class="rpanel${(r.to ?? r.from) === latest ? ' is-now' : ''}">
        <p class="rpanel__n micro">${pad(i + 1)} / ${pad(residencies.length)}</p>
        <span class="rpanel__year display">${r.from}${range}</span>
        <h3 class="rpanel__club display">${r.club}</h3>
        <p class="rpanel__tag micro">Club residency</p>
      </li>`;
    })
    .join('');
  ticks.innerHTML = residencies.map((r) => `<li>${r.from}</li>`).join('');
}

/** Vertical scroll drives a horizontal run through all residencies; a red line fills as you go. */
export function initResidencies(): void {
  render();
  const section = document.querySelector<HTMLElement>('.res');
  const stage = section?.querySelector<HTMLElement>('.res__stage');
  const track = section?.querySelector<HTMLElement>('.res__track');
  const fill = section?.querySelector<HTMLElement>('.res__fill');
  const ticks = section ? [...section.querySelectorAll<HTMLElement>('.res__ticks li')] : [];
  if (!section || !stage || !track || !fill || reducedMotion) return;

  const mm = gsap.matchMedia();
  mm.add('(min-width: 768px) and (hover: hover)', () => {
    const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
    gsap.to(track, {
      x: () => -dist(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${dist()}`,
        pin: stage,
        scrub: 0.8,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          gsap.set(fill, { scaleX: self.progress });
          const on = Math.round(self.progress * (ticks.length - 1));
          ticks.forEach((t, i) => t.classList.toggle('is-on', i <= on));
        },
      },
    });
  });
}
