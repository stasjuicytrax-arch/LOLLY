/** Single source of truth for lists. Mirrors docs/CONTENT.md; do not add anything that is not there. */

export interface Residency {
  club: string;
  from: number;
  to?: number;
}

// All 10, in order.
export const residencies: Residency[] = [
  { club: 'J One Bar', from: 2015 },
  { club: '369 Bar — ibis Styles', from: 2016, to: 2019 },
  { club: "Friend's Fusion Bar", from: 2019 },
  { club: 'The Maze Club', from: 2019, to: 2023 },
  { club: 'Nova Bar', from: 2022 },
  { club: 'Divine', from: 2022 },
  { club: 'The Bash Yangon', from: 2022, to: 2023 },
  { club: 'Sika Lounge', from: 2023 },
  { club: 'THOR Premium Lounge', from: 2023 },
  { club: 'Arena Entertainment', from: 2024 },
];

export interface City {
  id: string;
  name: string;
  country: 'Myanmar' | 'Thailand';
  note?: string;
  clubs: string[];
}

// All 32 venues across 8 cities.
export const cities: City[] = [
  {
    id: 'yangon',
    name: 'Yangon',
    country: 'Myanmar',
    clubs: [
      'Pioneer Plus', 'Pioneer Club', 'ASL', 'Arena Club', 'THOR Premium Lounge', 'Transporter Club',
      'Honey Nest Club', 'Lair Nine Club', 'FUSE', 'The Maze', 'Domino Lounge', 'Plan B Club',
      'Hyper', 'SONO Club', 'Woodland X Bar', 'J One Bar',
    ],
  },
  { id: 'mandalay', name: 'Mandalay', country: 'Myanmar', clubs: ['Pioneer Club', 'Taxx Club', 'Zeus'] },
  { id: 'mawlamyine', name: 'Mawlamyine', country: 'Myanmar', clubs: ['M Square', 'Monkey King', 'Woozy', 'Glow Bar'] },
  { id: 'taunggyi', name: 'Taunggyi', country: 'Myanmar', clubs: ['Active Bistro', '272 Club'] },
  { id: 'nay-pyi-taw', name: 'Nay Pyi Taw', country: 'Myanmar', clubs: ['Relax Bar', 'STG'] },
  { id: 'myitkyina', name: 'Myitkyina', country: 'Myanmar', clubs: ['831 Club'] },
  { id: 'laukkai', name: 'Laukkai', country: 'Myanmar', clubs: ['I Bar'] },
  {
    id: 'thailand',
    name: 'Bangkok & Phetchaburi',
    country: 'Thailand',
    note: 'Regional experience',
    clubs: ['Vision Club', 'Fenix Phetchaburi', 'Yangon Yangon Bar'],
  },
];

export const totalVenues = cities.reduce((n, c) => n + c.clubs.length, 0);

export interface Release {
  title: string;
  /** Credit line shown under the title. */
  sub?: string;
  /** File stem in assets/img/releases (cover-<stem>.jpg/.webp). */
  cover: string;
  /** True while only a low-res placeholder exists (cover-<stem>.jpg only). */
  placeholder?: boolean;
}

// All 7. Renew still has the low-res placeholder cropped from the old press kit; the artist will send the cover.
export const releases: Release[] = [
  { title: 'Overload', cover: 'overload' },
  { title: 'Dun Do Drugs', sub: 'Lolly x Zerk', cover: 'dun-do-drugs' },
  { title: 'Renew', cover: 'renew-lowres', placeholder: true },
  { title: 'Golden', cover: 'golden' },
  { title: 'GO', sub: 'BLACKPINK — GO (Lolly Remix)', cover: 'go' },
  { title: 'A Char Pin', sub: 'Nay Win Remix', cover: 'a-char-pin' },
  { title: 'A Friend', sub: 'Lolly Bootleg', cover: 'a-friend' },
];

export const links = {
  soundcloud: 'https://on.soundcloud.com/fvK5nAYr491TwBLv5',
} as const;
