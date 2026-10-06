// node scripts/dissolve.mjs: bakes the "dissolve into the page colour" into real pixels (CSS mask-image does not survive PDF printing).
// For each white-backdrop press photo: bottom 35% fades into --paper, left/right 8% too. Output: press-XX-dissolve.jpg next to the source.
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const PAPER = 'f1ebe6'; // must equal --paper in src/styles/tokens.css
const dir = resolve(import.meta.dirname, '../public/assets/img/press');
for (const n of ['01', '02', '03', '06', '07', '08']) {
  const src = resolve(dir, `press-${n}.jpg`);
  const out = resolve(dir, `press-${n}-dissolve.jpg`);
  const [W, H] = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', src]).toString().trim().split(',').map(Number);
  const alpha = `255*clip((H-Y)/(0.35*H),0,1)*clip(min(X,W-1-X)/(0.08*W),0,1)`;
  const graph = [
    `[0:v]format=rgba[im]`,
    `color=c=black:s=${W}x${H},format=gray,geq=lum='${alpha}'[m]`,
    `[im][m]alphamerge[fg]`,
    `color=c=0x${PAPER}:s=${W}x${H}[bg]`,
    `[bg][fg]overlay=format=auto,format=yuvj420p`,
  ].join(';');
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', src, '-filter_complex', graph, '-frames:v', '1', '-q:v', '2', out]);
  console.log(`press-${n}-dissolve.jpg  ${W}x${H}`);
}
