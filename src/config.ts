/** The one place that knows the public address of the site (set VITE_SITE_URL in .env). Always ends with "/". */
const raw = (import.meta.env.VITE_SITE_URL as string | undefined) ?? 'https://stasjuicytrax-arch.github.io/LOLLY/';
export const SITE_URL = raw.endsWith('/') ? raw : `${raw}/`;
