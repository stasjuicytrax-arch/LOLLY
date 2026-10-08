import { defineConfig, type Plugin } from 'vite';
import { readdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';

// Full-length videos are published with the site (client decision, 06.10.2026). They are gitignored
// on main but copied from public/ into dist, then to the gh-pages branch by `npm run deploy`.
// Set STRIP_FULL_VIDEOS=1 to leave them out.
function stripFullVideos(): Plugin {
  return {
    name: 'strip-full-videos',
    apply: 'build',
    closeBundle() {
      if (!process.env.STRIP_FULL_VIDEOS) return;
      const dir = join('dist', 'assets', 'video');
      for (const f of readdirSync(dir)) if (f.endsWith('.mp4') && !f.endsWith('-loop.mp4')) rmSync(join(dir, f));
    },
  };
}

// Custom domain: https://djlolly.site (GitHub Pages, branch gh-pages, see `npm run deploy`)
// public/CNAME ships the domain to gh-pages on every deploy; base is "/" since the site is served at the domain root.
export default defineConfig({
  base: '/',
  build: {
    target: 'es2022',
    assetsDir: 'static',
    // two pages: the site and the PDF press-kit source (presskit.html, printed by `npm run pdf`)
    rollupOptions: { input: { main: resolve(import.meta.dirname, 'index.html'), presskit: resolve(import.meta.dirname, 'presskit.html') } },
  },
  plugins: [stripFullVideos()],
});
