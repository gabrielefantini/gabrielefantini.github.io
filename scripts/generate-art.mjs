#!/usr/bin/env node
/**
 * Procedural neon line-art generator.
 *
 * Every illustration on the site is produced by this script as a static SVG,
 * in two flavours: on a black background (`*-dark.svg`) and on a white
 * background (`*-light.svg`). Output is deterministic (seeded RNG), so
 * re-running it produces identical files.
 *
 *   node scripts/generate-art.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(root, 'public', 'art');
const PROFILE_OUT = join(root, 'profile-readme');

const W = 1600;
const H = 1000;

// ---------------------------------------------------------------- helpers

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n) => Math.round(n * 10) / 10;

/** Smooth path through points using Catmull-Rom → cubic Bézier. */
function smooth(pts, closed = false) {
  if (pts.length < 2) return '';
  const p = closed ? [pts[pts.length - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[pts.length - 1]];
  let d = `M${f(p[1][0])},${f(p[1][1])}`;
  for (let i = 1; i < p.length - 2; i++) {
    const [x0, y0] = p[i - 1];
    const [x1, y1] = p[i];
    const [x2, y2] = p[i + 1];
    const [x3, y3] = p[i + 2];
    const c1x = x1 + (x2 - x0) / 6;
    const c1y = y1 + (y2 - y0) / 6;
    const c2x = x2 - (x3 - x1) / 6;
    const c2y = y2 - (y3 - y1) / 6;
    d += `C${f(c1x)},${f(c1y)} ${f(c2x)},${f(c2y)} ${f(x2)},${f(y2)}`;
  }
  return closed ? d + 'Z' : d;
}

/** Plain polyline path (for dense parametric curves). */
function poly(pts) {
  return 'M' + pts.map(([x, y]) => `${f(x)},${f(y)}`).join('L');
}

const PALETTES = {
  dark: {
    bg: '#000000',
    cyan: '#00e5ff',
    magenta: '#ff2bd6',
    violet: '#8b5cff',
    green: '#39ff88',
    amber: '#ffb020',
    faint: 'rgba(255,255,255,0.08)',
  },
  light: {
    bg: '#ffffff',
    cyan: '#00b4d8',
    magenta: '#f0189c',
    violet: '#6b3cf5',
    green: '#00c26e',
    amber: '#ff8a00',
    faint: 'rgba(0,0,0,0.06)',
  },
};

function frame(theme, body, { w = W, h = H, gradients = '' } = {}) {
  const pal = PALETTES[theme];
  const glow =
    theme === 'dark'
      ? `<filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="7" result="b1"/>
      <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b2"/>
      <feMerge><feMergeNode in="b1"/><feMergeNode in="b2"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>`
      : `<filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="5" result="b1"/>
      <feComponentTransfer in="b1" result="b2"><feFuncA type="linear" slope="0.45"/></feComponentTransfer>
      <feMerge><feMergeNode in="b2"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice">
  <defs>
    ${glow}
    ${gradients}
  </defs>
  <rect width="${w}" height="${h}" fill="${pal.bg}"/>
  <g filter="url(#glow)" fill="none" stroke-linecap="round" stroke-linejoin="round">
${body}
  </g>
</svg>
`;
}

function linGrad(id, stops, x1 = 0, y1 = 0, x2 = 1, y2 = 0) {
  const s = stops
    .map((c, i) => `<stop offset="${f((i / (stops.length - 1)) * 100)}%" stop-color="${c}"/>`)
    .join('');
  return `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${s}</linearGradient>`;
}

// ---------------------------------------------------------------- variants

/** Flowing interference waves. */
function flow(theme, seed = 7, w = W, h = H) {
  const p = PALETTES[theme];
  const r = rng(seed);
  const lines = 34;
  const ph = r() * Math.PI * 2;
  let body = '';
  for (let i = 0; i < lines; i++) {
    const t = i / (lines - 1);
    const pts = [];
    for (let x = -60; x <= w + 60; x += 40) {
      const u = x / w;
      const y =
        h * 0.5 +
        (t - 0.5) * h * 0.38 +
        Math.sin(u * 5.2 + ph + t * 2.4) * h * 0.13 * (0.4 + t) +
        Math.sin(u * 11 + t * 6) * h * 0.025;
      pts.push([x, y]);
    }
    const op = f(0.35 + 0.65 * Math.sin(t * Math.PI));
    body += `    <path d="${smooth(pts)}" stroke="url(#g)" stroke-width="1.6" opacity="${op}"/>\n`;
  }
  return frame(theme, body, {
    w,
    h,
    gradients: linGrad('g', [p.cyan, p.violet, p.magenta]),
  });
}

/** Data-mesh: domain clusters of nodes, connected locally and across domains. */
function mesh(theme, seed = 11) {
  const p = PALETTES[theme];
  const r = rng(seed);
  const domains = [
    { cx: W * 0.24, cy: H * 0.32, c: p.cyan },
    { cx: W * 0.72, cy: H * 0.26, c: p.magenta },
    { cx: W * 0.3, cy: H * 0.74, c: p.green },
    { cx: W * 0.76, cy: H * 0.72, c: p.violet },
  ];
  let body = '';
  const all = [];
  for (const d of domains) {
    const nodes = [];
    const n = 14 + Math.floor(r() * 5);
    for (let i = 0; i < n; i++) {
      const a = r() * Math.PI * 2;
      const rad = 20 + Math.sqrt(r()) * 170;
      nodes.push([d.cx + Math.cos(a) * rad * 1.25, d.cy + Math.sin(a) * rad * 0.85]);
    }
    // local edges: each node to its 2 nearest neighbours
    const seen = new Set();
    nodes.forEach((a, i) => {
      const near = nodes
        .map((b, j) => [j, Math.hypot(a[0] - b[0], a[1] - b[1])])
        .filter(([j]) => j !== i)
        .sort((x, y) => x[1] - y[1])
        .slice(0, 3);
      for (const [j] of near) {
        const k = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (seen.has(k)) continue;
        seen.add(k);
        const b = nodes[j];
        body += `    <line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${d.c}" stroke-width="1.5" opacity="0.9"/>\n`;
      }
    });
    // domain boundary
    const ring = [];
    for (let k = 0; k < 12; k++) {
      const a = (k / 12) * Math.PI * 2;
      const rr = 270 + Math.sin(a * 3 + r() * 2) * 18;
      ring.push([d.cx + Math.cos(a) * rr * 1.2, d.cy + Math.sin(a) * rr * 0.8]);
    }
    body += `    <path d="${smooth(ring, true)}" stroke="${d.c}" stroke-width="1" stroke-dasharray="2 9" opacity="0.85"/>\n`;
    for (const [x, y] of nodes) {
      const s = 3 + r() * 4;
      body += `    <circle cx="${f(x)}" cy="${f(y)}" r="${f(s)}" stroke="${d.c}" stroke-width="1.6"/>\n`;
    }
    all.push({ d, nodes });
  }
  // cross-domain links (data products exposed through ports)
  const pairs = [[0, 1], [0, 2], [1, 3], [2, 3], [0, 3]];
  for (const [a, b] of pairs) {
    const A = all[a].nodes[0];
    const B = all[b].nodes[1];
    const mx = (A[0] + B[0]) / 2 + (r() - 0.5) * 200;
    const my = (A[1] + B[1]) / 2 + (r() - 0.5) * 200;
    body += `    <path d="M${f(A[0])},${f(A[1])} Q${f(mx)},${f(my)} ${f(B[0])},${f(B[1])}" stroke="${p.amber}" stroke-width="1.3" opacity="0.85"/>\n`;
  }
  return frame(theme, body);
}

/** Rotating elliptical orbits. */
function orbits(theme) {
  const p = PALETTES[theme];
  const cols = [p.cyan, p.violet, p.magenta];
  let body = '';
  const n = 30;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const rx = 120 + t * 560;
    const ry = 60 + t * 220;
    const rot = t * 140;
    body += `    <ellipse cx="${W / 2}" cy="${H / 2}" rx="${f(rx)}" ry="${f(ry)}" transform="rotate(${f(rot)} ${W / 2} ${H / 2})" stroke="${cols[i % 3]}" stroke-width="1.3" opacity="${f(0.3 + 0.7 * (1 - t))}"/>\n`;
  }
  body += `    <circle cx="${W / 2}" cy="${H / 2}" r="8" stroke="${p.amber}" stroke-width="2"/>\n`;
  return frame(theme, body);
}

/** Spirograph (hypotrochoid). */
function spiro(theme) {
  const p = PALETTES[theme];
  const curve = (R, rr, d, scale, steps) => {
    const pts = [];
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * Math.PI * 2 * rr;
      const x = (R - rr) * Math.cos(t) + d * Math.cos(((R - rr) / rr) * t);
      const y = (R - rr) * Math.sin(t) - d * Math.sin(((R - rr) / rr) * t);
      pts.push([W / 2 + x * scale, H / 2 + y * scale]);
    }
    return poly(pts);
  };
  let body = '';
  body += `    <path d="${curve(105, 31, 64, 3.3, 3200)}" stroke="${p.cyan}" stroke-width="1.1" opacity="0.9"/>\n`;
  body += `    <path d="${curve(96, 37, 30, 3.0, 2600)}" stroke="${p.magenta}" stroke-width="1.1" opacity="0.85"/>\n`;
  return frame(theme, body);
}

/** Perspective lattice with horizon ridges. */
function lattice(theme) {
  const p = PALETTES[theme];
  const hz = H * 0.48;
  let body = '';
  // floor: horizontal lines getting denser towards horizon
  for (let i = 1; i <= 22; i++) {
    const y = hz + Math.pow(i / 22, 2.2) * (H - hz + 40);
    body += `    <line x1="0" y1="${f(y)}" x2="${W}" y2="${f(y)}" stroke="${p.magenta}" stroke-width="1.2" opacity="${f(0.25 + 0.75 * (i / 22))}"/>\n`;
  }
  // floor: verticals converging to vanishing point
  for (let i = -20; i <= 20; i++) {
    const xb = W / 2 + i * 120;
    body += `    <line x1="${W / 2 + i * 6}" y1="${f(hz)}" x2="${f(xb)}" y2="${H + 40}" stroke="${p.violet}" stroke-width="1.1" opacity="0.7"/>\n`;
  }
  // ridges above horizon
  const r = rng(3);
  for (let k = 0; k < 5; k++) {
    const pts = [];
    const ph = r() * 10;
    for (let x = -40; x <= W + 40; x += 40) {
      const u = x / W;
      const env = Math.exp(-Math.pow((u - 0.5) * 2.4, 2));
      const y = hz - 8 - k * 26 - env * (140 - k * 18) * (0.6 + 0.4 * Math.sin(u * 14 + ph));
      pts.push([x, y]);
    }
    body += `    <path d="${smooth(pts)}" stroke="${p.cyan}" stroke-width="1.3" opacity="${f(1 - k * 0.15)}"/>\n`;
  }
  body += `    <line x1="0" y1="${f(hz)}" x2="${W}" y2="${f(hz)}" stroke="${p.amber}" stroke-width="1.6"/>\n`;
  return frame(theme, body);
}

/** Topographic contour rings. */
function contours(theme, seed = 5) {
  const p = PALETTES[theme];
  const r = rng(seed);
  const centres = [
    { x: W * 0.36, y: H * 0.46, c: [p.green, p.cyan] },
    { x: W * 0.74, y: H * 0.6, c: [p.violet, p.magenta] },
  ];
  let body = '';
  for (const c of centres) {
    const k1 = r() * 6;
    const k2 = r() * 6;
    const rings = 16;
    for (let k = 0; k < rings; k++) {
      const base = 26 + k * 26;
      const pts = [];
      for (let i = 0; i < 48; i++) {
        const a = (i / 48) * Math.PI * 2;
        const rad =
          base *
          (1 +
            0.18 * Math.sin(a * 3 + k1 + k * 0.12) +
            0.09 * Math.sin(a * 5 + k2 - k * 0.2) +
            0.04 * Math.sin(a * 9 + k * 0.5));
        pts.push([c.x + Math.cos(a) * rad * 1.15, c.y + Math.sin(a) * rad * 0.9]);
      }
      const col = k % 2 ? c.c[0] : c.c[1];
      body += `    <path d="${smooth(pts, true)}" stroke="${col}" stroke-width="1.2" opacity="${f(1 - (k / rings) * 0.7)}"/>\n`;
    }
  }
  return frame(theme, body);
}

/** Radiating rays and arcs from below. */
function rays(theme) {
  const p = PALETTES[theme];
  const r = rng(19);
  const ox = W / 2;
  const oy = H * 1.05;
  let body = '';
  for (let i = 0; i < 64; i++) {
    const a = Math.PI + (i / 63) * Math.PI;
    const len = 380 + r() * 520;
    const col = [p.cyan, p.violet, p.magenta, p.amber][i % 4];
    body += `    <line x1="${f(ox + Math.cos(a) * 140)}" y1="${f(oy + Math.sin(a) * 140)}" x2="${f(ox + Math.cos(a) * len)}" y2="${f(oy + Math.sin(a) * len)}" stroke="${col}" stroke-width="1.2" opacity="${f(0.45 + r() * 0.55)}"/>\n`;
  }
  for (let k = 0; k < 6; k++) {
    const rad = 180 + k * 120;
    body += `    <path d="M${f(ox - rad)},${f(oy)} A${rad},${rad} 0 0 1 ${f(ox + rad)},${f(oy)}" stroke="${p.cyan}" stroke-width="1" stroke-dasharray="${2 + k} ${10 + k * 3}" opacity="0.7"/>\n`;
  }
  return frame(theme, body);
}

/** Twisting ribbon of parallel strands. */
function ribbon(theme) {
  const p = PALETTES[theme];
  const strands = 26;
  let body = '';
  for (let i = 0; i < strands; i++) {
    const ph = (i / strands) * Math.PI;
    const pts = [];
    for (let x = -60; x <= W + 60; x += 30) {
      const u = x / W;
      const twist = Math.cos(ph + u * Math.PI * 2.2);
      const y = H * 0.5 + Math.sin(u * Math.PI * 1.6 + 0.4) * H * 0.18 + twist * H * 0.17;
      pts.push([x, y]);
    }
    body += `    <path d="${smooth(pts)}" stroke="url(#rg)" stroke-width="1.3" opacity="${f(0.4 + 0.6 * Math.abs(Math.sin(ph)))}"/>\n`;
  }
  return frame(theme, body, {
    gradients: linGrad('rg', [p.green, p.cyan, p.violet]),
  });
}

/**
 * EventStorming / context-map line art: a timeline of "sticky notes"
 * (events, commands, policies) grouped into bounded-context outlines,
 * linked by context-map relationships.
 */
function contextsBody(theme, region, seed = 29, scale = 1) {
  const p = PALETTES[theme];
  const r = rng(seed);
  const { x: rx, y: ry, w: rw, h: rh } = region;
  const cy = ry + rh * 0.52;
  const timelineY = (x) => cy + Math.sin(((x - rx) / rw) * Math.PI * 2.2 + 0.6) * rh * 0.07;
  let body = '';

  // Timeline: a double neon rail with an arrow head.
  const rail = (off) => {
    const pts = [];
    for (let x = rx; x <= rx + rw; x += 24) pts.push([x, timelineY(x) + off]);
    return smooth(pts);
  };
  body += `    <path d="${rail(0)}" stroke="url(#tl)" stroke-width="${f(1.8 * scale)}"/>\n`;
  body += `    <path d="${rail(7 * scale)}" stroke="url(#tl)" stroke-width="${f(0.8 * scale)}" opacity="0.5"/>\n`;
  const ex = rx + rw;
  const ey = timelineY(ex);
  body += `    <path d="M${f(ex - 16 * scale)},${f(ey - 9 * scale)} L${f(ex)},${f(ey)} L${f(ex - 16 * scale)},${f(ey + 9 * scale)}" stroke="${p.magenta}" stroke-width="${f(1.8 * scale)}"/>\n`;

  // Bounded contexts: split the timeline into segments.
  const segments = 3;
  const segW = rw / segments;
  const ctxColours = [p.green, p.violet, p.cyan];
  const centres = [];
  for (let s = 0; s < segments; s++) {
    const sx = rx + segW * s + segW * 0.5;
    const sy = timelineY(sx);
    const bw = segW * 0.46;
    const bh = rh * 0.36;
    const ring = (grow) => {
      const pts = [];
      for (let k = 0; k < 14; k++) {
        const a = (k / 14) * Math.PI * 2;
        const wob = 1 + 0.08 * Math.sin(a * 3 + s * 2.1) + 0.05 * Math.sin(a * 5 + s);
        pts.push([sx + Math.cos(a) * (bw + grow) * wob, sy + Math.sin(a) * (bh + grow) * wob]);
      }
      return smooth(pts, true);
    };
    body += `    <path d="${ring(0)}" stroke="${ctxColours[s]}" stroke-width="${f(1.4 * scale)}"/>\n`;
    body += `    <path d="${ring(10 * scale)}" stroke="${ctxColours[s]}" stroke-width="${f(0.8 * scale)}" stroke-dasharray="${f(2 * scale)} ${f(8 * scale)}" opacity="0.8"/>\n`;
    centres.push([sx, sy, bw, bh]);

    // Sticky notes inside the context, alternating above / below the rail.
    const notes = 5;
    const size = Math.min(rh * 0.085, 46) * 1;
    for (let i = 0; i < notes; i++) {
      const nx = sx - bw * 0.72 + (i / (notes - 1)) * bw * 1.44;
      const up = i % 2 === 0;
      const ny = timelineY(nx) + (up ? -1 : 1) * (rh * 0.11 + r() * rh * 0.06);
      const roll = r();
      const col = roll < 0.6 ? p.amber : roll < 0.8 ? p.cyan : roll < 0.92 ? p.violet : p.magenta;
      const rot = (r() - 0.5) * 14;
      body += `    <line x1="${f(nx)}" y1="${f(timelineY(nx))}" x2="${f(nx)}" y2="${f(ny + (up ? size / 2 : -size / 2))}" stroke="${col}" stroke-width="${f(0.9 * scale)}" opacity="0.6"/>\n`;
      body += `    <rect x="${f(nx - size / 2)}" y="${f(ny - size / 2)}" width="${f(size)}" height="${f(size)}" rx="${f(3 * scale)}" transform="rotate(${f(rot)} ${f(nx)} ${f(ny)})" stroke="${col}" stroke-width="${f(1.5 * scale)}"/>\n`;
      body += `    <line x1="${f(nx - size * 0.28)}" y1="${f(ny - size * 0.1)}" x2="${f(nx + size * 0.28)}" y2="${f(ny - size * 0.1)}" transform="rotate(${f(rot)} ${f(nx)} ${f(ny)})" stroke="${col}" stroke-width="${f(1 * scale)}" opacity="0.7"/>\n`;
      body += `    <line x1="${f(nx - size * 0.28)}" y1="${f(ny + size * 0.12)}" x2="${f(nx + size * 0.12)}" y2="${f(ny + size * 0.12)}" transform="rotate(${f(rot)} ${f(nx)} ${f(ny)})" stroke="${col}" stroke-width="${f(1 * scale)}" opacity="0.7"/>\n`;
    }
  }

  // Context map: relationships arcing over and under neighbouring contexts.
  for (let s = 0; s < segments - 1; s++) {
    const [ax, ay, aw, ah] = centres[s];
    const [bx, by, , bh] = centres[s + 1];
    const over = s % 2 === 0;
    const y1 = ay + (over ? -ah : ah);
    const y2 = by + (over ? -bh : bh);
    const my = (y1 + y2) / 2 + (over ? -1 : 1) * rh * 0.16;
    const x1 = ax + aw * 0.35;
    const x2 = bx - aw * 0.35;
    body += `    <path d="M${f(x1)},${f(y1)} C${f(x1)},${f(my)} ${f(x2)},${f(my)} ${f(x2)},${f(y2)}" stroke="${p.magenta}" stroke-width="${f(1.2 * scale)}" stroke-dasharray="${f(6 * scale)} ${f(6 * scale)}"/>\n`;
    for (const [cx, cyy] of [[x1, y1], [x2, y2]]) {
      body += `    <circle cx="${f(cx)}" cy="${f(cyy)}" r="${f(4 * scale)}" stroke="${p.magenta}" stroke-width="${f(1.4 * scale)}"/>\n`;
    }
  }
  // A long upstream link from the first to the last context.
  const [fx, fy, , fh] = centres[0];
  const [lx, ly, , lh] = centres[segments - 1];
  const top = Math.min(fy - fh, ly - lh) - rh * 0.14;
  body += `    <path d="M${f(fx)},${f(fy - fh)} C${f(fx)},${f(top)} ${f(lx)},${f(top)} ${f(lx)},${f(ly - lh)}" stroke="${p.amber}" stroke-width="${f(0.9 * scale)}" opacity="0.55"/>\n`;
  return body;
}

function contextsGradients(theme) {
  const p = PALETTES[theme];
  return linGrad('tl', [p.cyan, p.violet, p.magenta]);
}

/** EventStorming timeline + bounded contexts. */
function contexts(theme) {
  const body = contextsBody(theme, { x: 120, y: 140, w: W - 240, h: H - 280 }, 29, 1.6);
  return frame(theme, body, { gradients: contextsGradients(theme) });
}

/** Two families of sweeping curves crossing into a moiré. Purely abstract. */
function fanBody(theme, region, scale = 1) {
  const p = PALETTES[theme];
  const { x: rx, y: ry, w: rw, h: rh } = region;
  const n = 46;
  let body = '';
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    // Family A: rising from bottom-right, fanning out to the top.
    const ax0 = rx + rw * 1.02;
    const ay0 = ry + rh * 1.08;
    const ax1 = rx + rw * (0.05 + t * 0.9);
    const ay1 = ry - rh * 0.05;
    const acx = rx + rw * (0.15 + t * 0.35);
    const acy = ry + rh * (1.0 - t * 0.35);
    body += `    <path d="M${f(ax0)},${f(ay0)} Q${f(acx)},${f(acy)} ${f(ax1)},${f(ay1)}" stroke="url(#fa)" stroke-width="${f(1.1 * scale)}" opacity="${f(0.35 + 0.65 * Math.sin(t * Math.PI))}"/>\n`;
    // Family B: mirrored, falling from top-right, crossing family A.
    const bx0 = rx + rw * 1.02;
    const by0 = ry - rh * 0.08;
    const bx1 = rx + rw * (0.25 + t * 0.75);
    const by1 = ry + rh * 1.05;
    const bcx = rx + rw * (0.3 + t * 0.25);
    const bcy = ry + rh * (0.1 + t * 0.4);
    body += `    <path d="M${f(bx0)},${f(by0)} Q${f(bcx)},${f(bcy)} ${f(bx1)},${f(by1)}" stroke="url(#fb)" stroke-width="${f(0.9 * scale)}" opacity="${f(0.25 + 0.5 * Math.sin(t * Math.PI))}"/>\n`;
  }
  return body;
}

function fanGradients(theme) {
  const p = PALETTES[theme];
  return linGrad('fa', [p.cyan, p.violet, p.magenta], 0, 1, 1, 0) + linGrad('fb', [p.magenta, p.amber], 0, 0, 1, 1);
}

function fan(theme) {
  return frame(theme, fanBody(theme, { x: 0, y: 0, w: W, h: H }, 1.6), { gradients: fanGradients(theme) });
}

/** Profile banner for the GitHub README (wide, with name). */
function banner(theme) {
  const w = 1280;
  const h = 320;
  const ink = theme === 'dark' ? '#ffffff' : '#0d0d0d';
  const sub = theme === 'dark' ? 'rgba(255,255,255,0.72)' : 'rgba(0,0,0,0.62)';
  const accent = PALETTES[theme].cyan;
  const body = fanBody(theme, { x: 560, y: 0, w: 720, h }, 1);
  const svg = frame(theme, body, { w, h, gradients: fanGradients(theme) });
  const text = `  <g font-family="Inter, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif">
    <text x="64" y="130" font-size="52" font-weight="600" letter-spacing="-1.5" fill="${ink}">Gabriele Fantini</text>
    <text x="66" y="178" font-size="24" fill="${sub}">From conversations to code.</text>
    <text x="66" y="228" font-size="12" fill="${accent}" letter-spacing="1.4">DDD · CLEAN ARCHITECTURE · EVENTSTORMING · AI IN SOFTWARE ENGINEERING</text>
  </g>
</svg>
`;
  return svg.replace('</svg>\n', text);
}

// ---------------------------------------------------------------- output

const variants = { flow, mesh, orbits, spiro, lattice, contours, rays, ribbon, contexts, fan };

mkdirSync(OUT, { recursive: true });
mkdirSync(PROFILE_OUT, { recursive: true });

let count = 0;
for (const [name, fn] of Object.entries(variants)) {
  for (const theme of ['dark', 'light']) {
    writeFileSync(join(OUT, `${name}-${theme}.svg`), fn(theme));
    count++;
  }
}
for (const theme of ['dark', 'light']) {
  const svg = banner(theme);
  writeFileSync(join(OUT, `banner-${theme}.svg`), svg);
  writeFileSync(join(PROFILE_OUT, `banner-${theme}.svg`), svg);
  count++;
}
console.log(`Generated ${count} SVGs in public/art (+ profile banners).`);
