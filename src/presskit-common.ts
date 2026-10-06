import { SITE_URL } from './config';

export const asset = (p: string) => `${import.meta.env.BASE_URL}assets/${p}`;
export const pad = (n: number) => String(n).padStart(2, '0');

export const SOUNDCLOUD = 'https://on.soundcloud.com/fvK5nAYr491TwBLv5';
export const videos = [
  ['aftermovie-h', 'Aftermovie', '1:42'],
  ['club-set-h', 'Club set', '1:20'],
  ['booth-pov-v', 'Booth POV', '0:45'],
  ['teaser-no-rule-v', 'Teaser: No Rule', '0:45'],
  ['extra-2009', 'From the floor', '1:49'],
] as const;
/** QR target for a full video (address comes from the one SITE_URL config). */
export const qrFor = (f: string) => `${SITE_URL}assets/video/${f}.mp4`;
