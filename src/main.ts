import '@fontsource-variable/archivo/wdth.css';
import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/preloader.css';
import './styles/hero.css';
import './styles/sections.css';

import { initSmoothScroll } from './modules/smooth';
import { runPreloader } from './modules/preloader';
import { initHero, revealHero } from './modules/hero';
import { initMarquee } from './modules/marquee';
import { initAbout } from './modules/about';
import { initStats } from './modules/stats';
import { lazyLoops } from './modules/media';

const lenis = initSmoothScroll();
lenis?.stop();

initHero(lenis);
initMarquee(lenis);
initAbout(lenis);
initStats();
lazyLoops();
runPreloader().then(() => {
  lenis?.start();
  revealHero();
});

// Buttons: the fill spreads from where the pointer entered.
document.querySelectorAll<HTMLElement>('.btn').forEach((btn) => {
  btn.addEventListener('pointerenter', (e) => {
    const r = btn.getBoundingClientRect();
    btn.style.setProperty('--x', `${e.clientX - r.left}px`);
    btn.style.setProperty('--y', `${e.clientY - r.top}px`);
  });
});
