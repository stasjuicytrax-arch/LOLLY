import { defineConfig, type Plugin } from 'vite';
import { readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

// Full-length videos live only on the author's machine (CLAUDE.md: never in git). Vite copies
// everything from public/, so strip them from dist; loops and posters stay.
// Set KEEP_FULL_VIDEOS=1 to publish them anyway.
function stripFullVideos(): Plugin {
  return {
    name: 'strip-full-videos',
    apply: 'build',
    closeBundle() {
      if (process.env.KEEP_FULL_VIDEOS) return;
      const dir = join('dist', 'assets', 'video');
      for (const f of readdirSync(dir)) if (f.endsWith('.mp4') && !f.endsWith('-loop.mp4')) rmSync(join(dir, f));
    },
  };
}

// GitHub Pages: https://stasjuicytrax-arch.github.io/LOLLY/ (branch gh-pages, see `npm run deploy`)
export default defineConfig({
  base: '/LOLLY/',
  build: { target: 'es2022', assetsDir: 'static' },
  plugins: [stripFullVideos()],
});
