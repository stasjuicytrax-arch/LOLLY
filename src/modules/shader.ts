/**
 * Hero "heat": a raw-WebGL fragment shader. Slow red light bands drift through
 * fbm noise and a warmer pool follows the cursor. Rendered at reduced
 * resolution, paused when the hero is off screen.
 */
const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uTime;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x),
             mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++){ v += a * noise(p); p = p * 2.02 + 7.3; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 asp = vec2(uRes.x / uRes.y, 1.0);
  float t = uTime * 0.08;

  vec2 q = uv * asp * 1.6;
  float flow = fbm(q + vec2(t, -t * 0.6) + fbm(q * 1.7 - t));
  float bands = smoothstep(0.42, 0.9, flow);

  float d = distance(uv * asp, uMouse * asp);
  float pool = exp(-d * d * 7.0);

  // Keep it a red light, never white: capped alpha, no channel pushed to 1 across the whole frame.
  float heat = clamp(bands * 0.30 + pool * 0.55, 0.0, 0.7);
  vec3 col = mix(vec3(0.62, 0.03, 0.02), vec3(0.95, 0.20, 0.06), pool);
  gl_FragColor = vec4(col * heat, heat);
}
`;

export function initShader(canvas: HTMLCanvasElement, host: HTMLElement): { mouse: (x: number, y: number) => void } | null {
  const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false, powerPreference: 'low-power' });
  if (!gl) return null;
  // A lost context paints as a pale slab: drop the layer instead (GPU reset, too many contexts, headless).
  let dead = false;
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    dead = true;
    canvas.style.display = 'none';
  });

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, 'uRes');
  const uMouse = gl.getUniformLocation(prog, 'uMouse');
  const uTime = gl.getUniformLocation(prog, 'uTime');

  const SCALE = 0.5;
  const resize = () => {
    canvas.width = Math.max(2, Math.round(host.clientWidth * SCALE));
    canvas.height = Math.max(2, Math.round(host.clientHeight * SCALE));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
  };
  resize();
  window.addEventListener('resize', resize);

  // Mouse target in uv space (0..1, y up) and a smoothed copy.
  const target = { x: 0.5, y: 0.45 };
  const cur = { x: 0.5, y: 0.45 };
  let visible = true;
  let raf = 0;
  const t0 = performance.now();

  const frame = () => {
    if (dead) return;
    cur.x += (target.x - cur.x) * 0.06;
    cur.y += (target.y - cur.y) * 0.06;
    gl.uniform2f(uMouse, cur.x, cur.y);
    gl.uniform1f(uTime, (performance.now() - t0) / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    raf = visible ? requestAnimationFrame(frame) : 0;
  };
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !raf) raf = requestAnimationFrame(frame);
  }).observe(host);
  raf = requestAnimationFrame(frame);

  return {
    mouse: (x, y) => {
      target.x = x;
      target.y = 1 - y;
    },
  };
}
