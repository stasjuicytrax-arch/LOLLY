import { defineConfig } from 'vite';

// GitHub Pages: https://stasjuicytrax-arch.github.io/LOLLY/
export default defineConfig({
  base: '/LOLLY/',
  build: { target: 'es2022', assetsDir: 'static' },
});
