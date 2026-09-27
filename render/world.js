// Copied from render/scene.html (helpers, the six places, the end-card sky, the app palette)
// so the thread clips share the film's drawing code without touching the film. Globals
// (W, H, S, LAND, F, HY, CCX, CCY, K, T, U, ctx, BRAND) are set by thread.html first.
// ---------- helpers ----------
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const inv = (a, b, x) => clamp((x - a) / (b - a));
const eIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const eO = (t) => 1 - Math.pow(1 - t, 3);
const eI = (t) => t * t * t;
const eBack = (t) => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
function rng(seed) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function noise1(seed) {
  const r = rng(seed), N = 512, v = Array.from({ length: N }, () => r() * 2 - 1);
  return (x) => { const i = Math.floor(x), f = x - i, a = v[((i % N) + N) % N], b = v[(((i + 1) % N) + N) % N], s = f * f * (3 - 2 * f); return a + (b - a) * s; };
}
function hex(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
const rgba = (h, a) => { const [r, g, b] = hex(h); return `rgba(${r},${g},${b},${a})`; };
function mix(h1, h2, t) { const a = hex(h1), b = hex(h2); return `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], t))).join(",")})`; }
function mixHex(h1, h2, t) { const a = hex(h1), b = hex(h2); return "#" + a.map((v, i) => Math.round(lerp(v, b[i], t)).toString(16).padStart(2, "0")).join(""); }
function lum(h) { const [r, g, b] = hex(h).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; }
function vg(y0, y1, stops) { const g = ctx.createLinearGradient(0, y0, 0, y1); for (const [o, c] of stops) g.addColorStop(o, c); return g; }
function hg(x0, x1, stops) { const g = ctx.createLinearGradient(x0, 0, x1, 0); for (const [o, c] of stops) g.addColorStop(o, c); return g; }
function rg(x, y, r0, r1, stops) { const g = ctx.createRadialGradient(x, y, r0, x, y, r1); for (const [o, c] of stops) g.addColorStop(o, c); return g; }
function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function big(fill) { ctx.fillStyle = fill; ctx.fillRect(-4 * W, -4 * H, 9 * W, 9 * H); }
function font(w, px, stretch = "normal") { ctx.font = `${w} ${px}px ${BRAND.font}`; ctx.fontStretch = stretch; }
// camera: zoom z about (cx, cy), then shift
function cam(o, cx = F.x, cy = F.y) {
  const z = o.z || 1;
  ctx.translate(cx + (o.dx || 0), cy + (o.dy || 0));
  if (o.rot) ctx.rotate(o.rot);
  ctx.scale(z, z);
  ctx.translate(-cx, -cy);
}
function screen(fn) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); fn(); ctx.restore(); }
function leaf(x, y, len, wid, ang, col, rib) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
  ctx.beginPath(); ctx.moveTo(0, 0);
  ctx.bezierCurveTo(len * 0.25, -wid, len * 0.75, -wid * 0.9, len, 0);
  ctx.bezierCurveTo(len * 0.75, wid * 0.9, len * 0.25, wid, 0, 0);
  ctx.fillStyle = col; ctx.fill();
  if (rib) { ctx.strokeStyle = rib; ctx.lineWidth = Math.max(1, wid * 0.06); ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(len * 0.5, -wid * 0.08, len * 0.97, 0); ctx.stroke(); }
  ctx.restore();
}

// ---------- seeded content ----------
let ICON;
const R0 = rng(7);
const SKY_STARS = Array.from({ length: 260 }, () => ({ x: R0() * W, y: R0() * H, r: (0.6 + R0() * R0() * 2.2) * S, a: 0.35 + R0() * 0.65, k: 2 + Math.floor(R0() * 6), p: R0() * TAU }));
const WIN_STARS = Array.from({ length: 70 }, () => ({ x: (R0() - 0.5) * 340, y: -240 + R0() * 250, r: 0.8 + R0() * 1.8, a: 0.4 + R0() * 0.6 }));
const nR = [noise1(11), noise1(23), noise1(37), noise1(41), noise1(53), noise1(67)];
function ridge(n, u) {
  const a = 1 - Math.abs(n(u)), b = 1 - Math.abs(n(u * 2.13 + 9.1)), c = n(u * 4.7 + 3.3);
  return 0.62 * a * a + 0.28 * b * b + 0.1 * c;
}

// ============================================================
// SCENE 1: in flight by day, airplane mode
// ============================================================
function flightSky(cx, cy, lt, k) {
  const P = PAL.day;
  ctx.fillStyle = vg(cy - 240 * S, cy + 240 * S, [[0, "#3f8fd4"], [0.45, "#8cc6ec"], [0.7, "#d4ecf7"], [1, "#eef7fb"]]);
  ctx.fillRect(cx - 180 * S, cy - 250 * S, 360 * S, 500 * S);
  // sea of clouds, three layers rushing past, cel shaded with an ink edge
  const cols = [["#c9dbe9", "#e9f2f8"], ["#dbe8f2", "#f7fbfd"], ["#e8f1f7", "#ffffff"]];
  for (let j = 0; j < 3; j++) {
    const y0 = cy + (40 + j * 62) * S, sp = (90 + j * 260) * S, amp = (10 + j * 9) * S, per = (34 + j * 22) * S;
    ctx.beginPath(); ctx.moveTo(cx - 200 * S, cy + 260 * S);
    for (let x = cx - 200 * S; x <= cx + 200 * S; x += 5 * S) {
      const u = (x + lt * sp) / per;
      ctx.lineTo(x, y0 - amp * Math.abs(Math.sin(u)) - amp * 0.5 * Math.abs(Math.sin(u * 0.47 + j)));
    }
    ctx.lineTo(cx + 200 * S, cy + 260 * S); ctx.closePath();
    ctx.fillStyle = vg(y0 - amp * 1.5, y0 + 90 * S, [[0, cols[j][1]], [0.5, cols[j][0]], [1, "#b4c9da"]]); ctx.fill();
    ctx.strokeStyle = rgba(P.ink, 0.55); ctx.lineWidth = lwS(2); ctx.stroke();
  }
  if (k === 0) {
    // wing
    ctx.beginPath(); ctx.moveTo(cx - 200 * S, cy + 132 * S); ctx.lineTo(cx + 104 * S, cy + 70 * S); ctx.lineTo(cx + 114 * S, cy + 80 * S); ctx.lineTo(cx - 200 * S, cy + 232 * S); ctx.closePath();
    ctx.fillStyle = vg(cy + 70 * S, cy + 232 * S, [[0, "#e9edf1"], [1, "#b3bcc6"]]); ctx.fill();
    ctx.strokeStyle = P.ink; ctx.lineWidth = lwS(2.6); ctx.lineJoin = "round"; ctx.stroke();
    ctx.strokeStyle = rgba(P.ink, 0.35); ctx.lineWidth = lwS(1.6); ctx.beginPath(); ctx.moveTo(cx - 200 * S, cy + 175 * S); ctx.lineTo(cx + 60 * S, cy + 96 * S); ctx.stroke();
    const on = ((lt * 1.25) % 1 + 1) % 1 < 0.14;
    ctx.fillStyle = on ? "#ff5a4a" : "#9a2a2a"; ctx.beginPath(); ctx.arc(cx + 110 * S, cy + 75 * S, 5 * S, 0, TAU); ctx.fill();
    ctx.strokeStyle = P.ink; ctx.lineWidth = lwS(1.6); ctx.stroke();
  }
}
function flightWindow(cx, cy, lt, k, portal, skyA) {
  const P = PAL.day;
  // bezel: cabin plastic, ink outlined
  rr(cx - 225 * S, cy - 305 * S, 450 * S, 610 * S, 215 * S);
  ctx.fillStyle = hg(cx - 225 * S, cx + 225 * S, [[0, "#e4ddd0"], [0.5, "#f2ede4"], [1, "#d9d1c2"]]); ctx.fill();
  ctx.strokeStyle = rgba(P.ink, 0.7); ctx.lineWidth = lwS(2.6); ctx.stroke();
  rr(cx - 190 * S, cy - 262 * S, 380 * S, 524 * S, 190 * S);
  ctx.fillStyle = vg(cy - 262 * S, cy + 262 * S, [[0, "#cfc6b6"], [1, "#b9ae9c"]]); ctx.fill();
  ctx.strokeStyle = rgba(P.ink, 0.6); ctx.lineWidth = lwS(2.2); ctx.stroke();
  ctx.save();
  rr(cx - 165 * S, cy - 235 * S, 330 * S, 470 * S, 165 * S); ctx.clip();
  if (portal) portal();
  if (!portal || skyA > 0) { ctx.globalAlpha = portal ? skyA : 1; flightSky(cx, cy, lt, k); ctx.globalAlpha = 1; }
  if (!portal || skyA > 0) {
    ctx.globalAlpha = portal ? skyA : 1;
    const sh = [0.62, 0.16, 0.34][k + 1];
    ctx.fillStyle = vg(cy - 235 * S, cy - 235 * S + 470 * S * sh, [[0, "#f7f3ec"], [1, "#e6dfd2"]]);
    ctx.fillRect(cx - 170 * S, cy - 240 * S, 340 * S, 470 * S * sh + 5 * S);
    ctx.strokeStyle = rgba(P.ink, 0.6); ctx.lineWidth = lwS(2); ctx.beginPath(); ctx.moveTo(cx - 170 * S, cy - 235 * S + 470 * S * sh + 5 * S); ctx.lineTo(cx + 170 * S, cy - 235 * S + 470 * S * sh + 5 * S); ctx.stroke();
    ctx.fillStyle = "#b8ab96"; ctx.fillRect(cx - 40 * S, cy - 235 * S + 470 * S * sh - 10 * S, 80 * S, 6 * S);
    // glass reflection
    ctx.fillStyle = "rgba(255,255,255,0.16)";
    ctx.beginPath(); ctx.moveTo(cx - 120 * S, cy + 240 * S); ctx.lineTo(cx - 40 * S, cy + 240 * S); ctx.lineTo(cx + 150 * S, cy - 240 * S); ctx.lineTo(cx + 70 * S, cy - 240 * S); ctx.fill();
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  rr(cx - 165 * S, cy - 235 * S, 330 * S, 470 * S, 165 * S); ctx.strokeStyle = rgba(P.ink, 0.75); ctx.lineWidth = lwS(2.4); ctx.stroke();
}
function drawFlight(lt, o = {}) {
  const P = PAL.day;
  ctx.save();
  const zi = 1 + 0.07 * clamp(lt / 2.5);
  const bob = Math.sin(lt * 6.1) * 2.5 * S + Math.sin(lt * 14.3) * 1.2 * S;
  cam({ z: (o.z || 1) * zi, dy: bob });
  // a bright cabin by day: cream walls, soft window light
  big(vg(F.y - 900 * S, F.y + 900 * S, [[0, "#e6dfd2"], [0.3, "#f1ece3"], [0.6, "#e9e2d6"], [1, "#cfc5b4"]]));
  // overhead bins
  ctx.fillStyle = vg(F.y - 1000 * S, F.y - 400 * S, [[0, "#ddd5c7"], [1, "#f5f1ea"]]);
  ctx.fillRect(F.x - 3000 * S, F.y - 1400 * S, 6000 * S, 1000 * S);
  ctx.fillStyle = rgba(P.ink, 0.55); ctx.fillRect(F.x - 3000 * S, F.y - 404 * S, 6000 * S, 3 * S);
  ctx.fillStyle = "rgba(120,105,85,0.18)"; ctx.fillRect(F.x - 3000 * S, F.y - 401 * S, 6000 * S, 26 * S);
  // reading light and call button, off by day
  for (const dx of [330, 400]) { ctx.beginPath(); ctx.arc(F.x + dx * S, F.y - 450 * S, 18 * S, 0, TAU); ctx.fillStyle = dx === 330 ? "#f7f2e6" : "#e8dfcf"; ctx.fill(); ctx.strokeStyle = rgba(P.ink, 0.7); ctx.lineWidth = lwS(2); ctx.stroke(); }
  // panel seams
  ctx.strokeStyle = "rgba(90,78,60,0.28)"; ctx.lineWidth = 3 * S;
  for (let k = -3; k <= 3; k++) { ctx.beginPath(); ctx.moveTo(F.x + (k * 600 + 300) * S, F.y - 400 * S); ctx.lineTo(F.x + (k * 600 + 300) * S, F.y + 1400 * S); ctx.stroke(); }
  for (const k of [-1, 0, 1]) flightWindow(F.x + k * 600 * S, F.y, lt, k, k === 0 ? o.portal : null, o.skyA ?? 1);
  // seat backs in the foreground
  const seat = (x, y, w, h) => {
    rr(x, y, w, h, [150 * S, 150 * S, 20 * S, 20 * S]); ctx.fillStyle = vg(y, y + h * 0.6, [[0, "#4f7196"], [1, "#2f4a68"]]); ctx.fill();
    ctx.strokeStyle = P.ink; ctx.lineWidth = lwS(3); ctx.stroke();
    ctx.save(); rr(x, y, w, h, [150 * S, 150 * S, 20 * S, 20 * S]); ctx.clip(); ctx.fillStyle = "#6389b0"; ctx.beginPath(); ctx.arc(x + w * 0.3, y + 60 * S, w * 0.55, 0, TAU); ctx.fill(); ctx.restore();
    rr(x + w * 0.2, y + 26 * S, w * 0.6, 92 * S, 30 * S); ctx.fillStyle = "#f4efe4"; ctx.fill(); ctx.strokeStyle = rgba(P.ink, 0.8); ctx.lineWidth = lwS(2.2); ctx.stroke();
    ctx.fillStyle = "rgba(150,130,100,0.35)"; ctx.fillRect(x + w * 0.2, y + 96 * S, w * 0.6, 22 * S);
  };
  if (LAND) { seat(F.x - 720 * S, F.y + 330 * S, 420 * S, 700 * S); seat(F.x + 330 * S, F.y + 300 * S, 420 * S, 700 * S); }
  else { seat(F.x - 520 * S, F.y + 420 * S, 440 * S, 900 * S); seat(F.x + 180 * S, F.y + 460 * S, 440 * S, 900 * S); }
  ctx.restore();
}

// ============================================================
// SCENE 2: underground, a train in a tunnel
// ============================================================
function drawSubway(lt, o = {}) {
  ctx.save();
  cam({ z: o.z || 1, dx: Math.sin(lt * 29) * 1.8 * S, dy: Math.sin(lt * 23 + 1) * 1.8 * S });
  const vx = F.x, vy = F.y;
  big("#021210");
  const ph = lt * 7 + (o.boost || 0);
  const n0 = Math.floor(ph) + 1, N = 40;
  const fog = "#021210";
  for (let n = n0; n < n0 + N; n++) {
    const d = n - ph, z = 0.22 + d * 0.4, r = 470 * S / z;
    const f = clamp((z - 0.6) / 14);
    const base = n % 2 ? "#1c7563" : "#145a4c";
    ctx.fillStyle = mix(base, fog, Math.pow(f, 0.7));
    ctx.beginPath(); ctx.arc(vx, vy, r, 0, TAU); ctx.fill();
    ctx.strokeStyle = mix("#3fae90", fog, Math.pow(f, 0.6)); ctx.lineWidth = Math.max(1, 7 * S / z);
    ctx.stroke();
  }
  // cables along the walls (radial in projection)
  ctx.strokeStyle = "rgba(0,10,8,0.8)";
  for (const a of [-2.75, -2.62, 0.35, 2.95]) { ctx.lineWidth = 6 * S; ctx.beginPath(); ctx.moveTo(vx + Math.cos(a) * 30 * S, vy + Math.sin(a) * 30 * S); ctx.lineTo(vx + Math.cos(a) * 2600 * S, vy + Math.sin(a) * 2600 * S); ctx.stroke(); }
  // floor
  const Rb = 4000 * S;
  ctx.beginPath(); ctx.moveTo(vx, vy + 2 * S); ctx.lineTo(vx - 0.8 * Rb, vy + 0.6 * Rb); ctx.lineTo(vx + 0.8 * Rb, vy + 0.6 * Rb); ctx.closePath();
  ctx.fillStyle = vg(vy, vy + 700 * S, [[0, "#021210"], [1, "#0c2a24"]]); ctx.fill();
  for (let n = n0; n < n0 + N; n++) {
    const d = n - ph, z = 0.22 + d * 0.4, r = 470 * S / z, f = clamp((z - 0.6) / 14);
    ctx.fillStyle = mix("#2c4a42", fog, f);
    ctx.fillRect(vx - 0.36 * r, vy + 0.6 * r, 0.72 * r, Math.max(1, 0.05 * r));
  }
  for (const s of [-1, 1]) {
    ctx.beginPath(); ctx.moveTo(vx + s * 1 * S, vy + 1 * S); ctx.lineTo(vx + s * 0.2 * Rb, vy + 0.6 * Rb); ctx.lineTo(vx + s * 0.214 * Rb, vy + 0.6 * Rb); ctx.closePath();
    ctx.fillStyle = vg(vy, vy + 600 * S, [[0, "rgba(190,230,215,0.1)"], [1, "rgba(190,230,215,0.6)"]]); ctx.fill();
  }
  // lamps along the walls: flat fittings in soft ambient light, no bloom
  ctx.lineCap = "round";
  for (let n = n0; n < n0 + N; n++) {
    const d = n - ph, z = 0.22 + d * 0.4, z2 = Math.max(0.12, z - 0.18), r = 470 * S / z, r2 = 470 * S / z2, f = clamp((z - 0.6) / 14);
    const lamps = n % 2 === 0 ? [[-2.3, "#e6f4e8"], [-0.84, "#e6f4e8"]] : [];
    if (n % 7 === 3) lamps.push([0.55, "#e0664e"]);
    for (const [a, c] of lamps) {
      const x1 = vx + Math.cos(a) * r * 0.9, y1 = vy + Math.sin(a) * r * 0.9, x2 = vx + Math.cos(a) * r2 * 0.9, y2 = vy + Math.sin(a) * r2 * 0.9;
      ctx.globalAlpha = 1 - f;
      ctx.strokeStyle = "#081410"; ctx.lineWidth = 15 * S / z; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = 9 * S / z; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }
  // the way out: a plain opening onto daylight, ink edged
  const er = o.exitR || 13 * S;
  ctx.beginPath(); ctx.arc(vx, vy, er + 3 * S, 0, TAU); ctx.fillStyle = "#081410"; ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(vx, vy, er, 0, TAU); ctx.clip();
  if (o.portal) o.portal(); else big("#cfe8f5");
  ctx.restore();
  ctx.restore();
}

// ============================================================
// SCENE 3: a mountain hut above the treeline, dawn
// ============================================================
let HIKER_X = null;
function peakY(L, x, pan) { return L.base - L.amp * ridge(L.n, (x - pan * L.pf) / L.sc + L.off); }
function drawPeak(lt, o = {}) {
  const P = PAL.day;
  ctx.save();
  const emerge = 1 + 0.22 * (1 - eO(clamp((lt + 0.2) / 1.1)));
  cam({ z: (o.z || 1) * emerge, dy: o.dy || 0 });
  const hy = LAND ? 0.64 * H : 0.54 * H;
  const pan = -lt * 60 * S;
  // clear morning above the treeline
  big(vg(hy - 1100 * S, hy + 100 * S, [[0, "#3f8ed6"], [0.45, "#7fbde9"], [0.8, "#cbe7f5"], [1, "#eef7f9"]]));
  for (const [cx0, cy0, sc] of [[0.12, -760, 0.9], [0.66, -900, 0.7], [0.92, -640, 0.8]]) inkCloud(cx0 * W - lt * 18 * S, hy + cy0 * S, 52 * S * sc, P);
  const layers = [
    { base: hy + 10 * S, amp: 300 * S, sc: 820 * S, pf: 0.12, col: "#b9cfdc", n: nR[0], off: 3 },
    { base: hy + 120 * S, amp: 300 * S, sc: 700 * S, pf: 0.25, col: "#94b8b0", n: nR[1], off: 7 },
    { base: hy + 240 * S, amp: 260 * S, sc: 600 * S, pf: 0.45, col: "#78a672", n: nR[2], off: 1 },
    { base: hy + (LAND ? 380 : 420) * S, amp: 240 * S, sc: 540 * S, pf: 0.72, col: "#528a4c", n: nR[3], off: 5 },
    { base: hy + (LAND ? 440 : 560) * S, amp: 300 * S, sc: 520 * S, pf: 1.0, col: "#346a38", n: nR[4], off: 2.4 },
  ];
  const x0 = -0.3 * W, x1 = 1.3 * W, step = 7 * S;
  layers.forEach((L, i) => {
    ctx.beginPath(); ctx.moveTo(x0, H * 3);
    for (let x = x0; x <= x1; x += step) ctx.lineTo(x, peakY(L, x, pan));
    ctx.lineTo(x1, H * 3); ctx.closePath();
    ctx.fillStyle = vg(L.base - L.amp, L.base + 200 * S, [[0, L.col], [1, mixHex(L.col, "#1f3a26", 0.25)]]); ctx.fill();
    if (i === 0) { // snow on the far peaks
      ctx.save(); ctx.clip(); ctx.fillStyle = "#f4f8fa";
      ctx.beginPath(); ctx.moveTo(x0, 0); for (let x = x0; x <= x1; x += step) ctx.lineTo(x, peakY(L, x, pan) + 40 * S); ctx.lineTo(x1, 0); ctx.closePath();
      ctx.save(); ctx.clip(); ctx.fillRect(x0, 0, x1 - x0, L.base - L.amp * 0.62); ctx.restore(); ctx.restore();
    }
    // an ink ridge line in place of the old rim light
    ctx.strokeStyle = rgba(P.ink, 0.5 + i * 0.1); ctx.lineWidth = lwS(2 + i * 0.4); ctx.lineJoin = "round";
    ctx.beginPath(); for (let x = x0; x <= x1; x += step) { const y = peakY(L, x, pan); x === x0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke();
    if (i === 2 || i === 3) { // pines along the ridge
      const PR = rng(90 + i);
      for (let k = 0; k < 18; k++) { const px = lerp(x0, x1, PR()) , py = peakY(L, px, pan) + (12 + PR() * 40) * S; pine(px, py, (i === 2 ? 46 : 70) * S * (0.7 + PR() * 0.6), P, i === 2 ? "#5f9a58" : "#3f7a3c", i === 2 ? "#437a44" : "#2b5a2e"); }
    }
    if (i === 3) { // the hut: timber walls, a warm window, smoke from the chimney
      const hx = F.x + (LAND ? -330 : -250) * S + pan * L.pf, hb = peakY(L, hx, pan) + 14 * S, hw = 120 * S, hh = 70 * S;
      ctx.lineWidth = lwS(2.4); ctx.strokeStyle = P.ink; ctx.lineJoin = "round";
      ctx.fillStyle = "#9a6a3e"; ctx.fillRect(hx - hw / 2, hb - hh, hw, hh + 20 * S); ctx.strokeRect(hx - hw / 2, hb - hh, hw, hh + 20 * S);
      ctx.strokeStyle = rgba(P.ink, 0.35); for (let q = 1; q < 4; q++) { ctx.beginPath(); ctx.moveTo(hx - hw / 2, hb - hh + q * 20 * S); ctx.lineTo(hx + hw / 2, hb - hh + q * 20 * S); ctx.stroke(); }
      ctx.strokeStyle = P.ink;
      ctx.fillStyle = "#6a4128"; ctx.fillRect(hx + 24 * S, hb - hh - 58 * S, 16 * S, 40 * S); ctx.strokeRect(hx + 24 * S, hb - hh - 58 * S, 16 * S, 40 * S);
      ctx.beginPath(); ctx.moveTo(hx - hw / 2 - 18 * S, hb - hh + 4 * S); ctx.lineTo(hx, hb - hh - 62 * S); ctx.lineTo(hx + hw / 2 + 18 * S, hb - hh + 4 * S); ctx.closePath(); ctx.fillStyle = "#b8452e"; ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#ffd57a"; ctx.fillRect(hx - 36 * S, hb - hh + 20 * S, 28 * S, 24 * S); ctx.strokeRect(hx - 36 * S, hb - hh + 20 * S, 28 * S, 24 * S);
      ctx.fillStyle = P.ink; ctx.fillRect(hx - 23 * S, hb - hh + 20 * S, 2 * S, 24 * S);
      for (let k = 0; k < 7; k++) { const q = ((lt * 0.5 + k / 7) % 1), px2 = hx + 32 * S + Math.sin(q * 5 + k) * 14 * S + q * 60 * S, py2 = hb - hh - 62 * S - q * 170 * S; ctx.fillStyle = `rgba(250,250,250,${0.6 * (1 - q)})`; ctx.beginPath(); ctx.arc(px2, py2, (8 + q * 22) * S, 0, TAU); ctx.fill(); ctx.strokeStyle = rgba(P.ink, 0.25 * (1 - q)); ctx.lineWidth = lwS(1.5); ctx.stroke(); }
    }
    if (i < 3) { // morning mist in the valleys
      ctx.fillStyle = vg(L.base - 40 * S, L.base + 110 * S, [[0, "rgba(240,248,250,0)"], [0.5, "rgba(240,248,250,0.3)"], [1, "rgba(240,248,250,0)"]]);
      ctx.fillRect(x0, L.base - 40 * S, x1 - x0, 150 * S);
    }
  });
  // hiker on the nearest ridge
  const L = layers[4];
  if (HIKER_X === null) { HIKER_X = F.x; let best = Infinity; for (let x = F.x - (LAND ? 150 : 250) * S; x <= F.x + 260 * S; x += 4 * S) { const y = peakY(L, x, 0); if (y < best) { best = y; HIKER_X = x; } } }
  const hx = HIKER_X + pan * L.pf, hyk = peakY(L, hx, pan) + 4 * S, h = 118 * S;
  ctx.save(); ctx.translate(hx, hyk);
  ctx.fillStyle = "#23402a";
  ctx.beginPath(); ctx.moveTo(-14 * S, 0); ctx.lineTo(-6 * S, -h * 0.5); ctx.lineTo(8 * S, -h * 0.5); ctx.lineTo(18 * S, 0); ctx.lineTo(10 * S, 0); ctx.lineTo(2 * S, -h * 0.34); ctx.lineTo(-6 * S, 0); ctx.closePath(); ctx.fill();
  rr(-12 * S, -h * 0.86, 24 * S, h * 0.4, 8 * S); ctx.fillStyle = "#d8542e"; ctx.fill(); ctx.strokeStyle = P.ink; ctx.lineWidth = lwS(2); ctx.stroke();
  rr(-30 * S, -h * 0.84, 22 * S, h * 0.36, 7 * S); ctx.fillStyle = "#e0a93a"; ctx.fill(); ctx.stroke(); // pack
  ctx.beginPath(); ctx.arc(1 * S, -h * 0.94, 10 * S, 0, TAU); ctx.fillStyle = "#e7b58f"; ctx.fill(); ctx.stroke();
  ctx.lineWidth = 3.5 * S; ctx.strokeStyle = "#3a2a1c"; ctx.beginPath(); ctx.moveTo(12 * S, -h * 0.6); ctx.lineTo(34 * S, 2 * S); ctx.stroke();
  ctx.restore();
  // birds
  ctx.strokeStyle = P.ink; ctx.lineWidth = 3 * S; ctx.lineCap = "round";
  for (let b = 0; b < 3; b++) {
    const bx = F.x - 260 * S + lt * (110 + b * 25) * S + b * 70 * S, by = hy - 330 * S + b * 36 * S + Math.sin(lt * 3 + b) * 8 * S, fl = Math.sin(lt * 14 + b * 2) * 6 * S;
    ctx.beginPath(); ctx.moveTo(bx - 14 * S, by - fl); ctx.quadraticCurveTo(bx - 6 * S, by - 4 * S, bx, by); ctx.quadraticCurveTo(bx + 6 * S, by - 4 * S, bx + 14 * S, by - fl); ctx.stroke();
  }
  ctx.restore();
}

// ============================================================
// SCENE 4: a kitchen garden at golden hour
// ============================================================
function canopy(x, y, r, col) { ctx.fillStyle = col; ctx.beginPath(); for (const [dx, dy, k] of [[0, 0, 1], [-0.8, 0.25, 0.75], [0.8, 0.2, 0.8], [-0.35, -0.45, 0.7], [0.45, -0.4, 0.65], [0, 0.5, 0.8]]) { ctx.moveTo(x + dx * r + k * r, y + dy * r); ctx.arc(x + dx * r, y + dy * r, k * r, 0, TAU); } ctx.fill(); }
function corn(x, y, h, sw, col, leafCol) {
  // a stalk with alternating leaves and a tassel, ink outlined
  const P = PAL.day;
  inkStroke([[x, y], [x + sw * 0.25, y - h * 0.5], [x + sw, y - h]], 7 * S, col, P);
  for (let k = 0; k < 6; k++) {
    const t = 0.18 + k * 0.13, lx = x + sw * t * t, ly = y - h * t, side = k % 2 ? 1 : -1;
    inkLeaf(lx, ly, (150 - k * 12) * S, 16 * S, side > 0 ? -0.45 + sw / (900 * S) : Math.PI + 0.45 + sw / (900 * S), leafCol, mixHex(leafCol, "#1f4726", 0.35), P, "lance", 2);
  }
  ctx.strokeStyle = "#d9a93a"; ctx.lineWidth = 3 * S;
  for (let k = -2; k <= 2; k++) { ctx.beginPath(); ctx.moveTo(x + sw, y - h); ctx.lineTo(x + sw + k * 9 * S, y - h - 36 * S + Math.abs(k) * 8 * S); ctx.stroke(); }
}
function butterfly(x, y, s, col, lt, ph) {
  const P = PAL.day, f = 0.35 + 0.65 * Math.abs(Math.sin(lt * 9 + ph));
  ctx.save(); ctx.translate(x, y);
  for (const sd of [-1, 1]) {
    ctx.beginPath(); ctx.ellipse(sd * s * 0.55 * f, -s * 0.2, s * 0.6 * f, s * 0.45, sd * 0.4, 0, TAU); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = P.ink; ctx.lineWidth = lwS(1.6); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(sd * s * 0.4 * f, s * 0.35, s * 0.4 * f, s * 0.3, -sd * 0.4, 0, TAU); ctx.fill(); ctx.stroke();
  }
  ctx.fillStyle = P.ink; ctx.fillRect(-s * 0.08, -s * 0.5, s * 0.16, s);
  ctx.restore();
}
function drawGarden(lt, o = {}) {
  const P = PAL.day;
  ctx.save();
  cam({ z: (o.z || 1) * (1.05 - 0.05 * clamp(lt / 2.2)), dy: o.dy || 0 });
  const gy = LAND ? 0.62 * H : 0.5 * H;          // horizon
  const pan = -lt * 50 * S;
  // a clear afternoon
  big(vg(gy - 1100 * S, gy, [[0, "#3f8ed6"], [0.5, "#86c2ea"], [0.85, "#d2ebf6"], [1, "#eef7f6"]]));
  for (const [cx0, cy0, sc] of [[0.1, -720, 0.9], [0.55, -860, 0.75], [0.85, -560, 0.85], [0.35, -430, 0.55]]) inkCloud(cx0 * W - lt * 16 * S, gy + cy0 * S, 52 * S * sc, P);
  // far hills and a tree line
  for (const [amp, per, col, off, pf] of [[60, 700, "#b3cf94", 1.3, 0.1], [44, 460, "#8fb86c", 4.1, 0.2]]) {
    ctx.beginPath(); ctx.moveTo(-W, gy + 4 * S);
    for (let x = -W; x <= 2 * W; x += 10 * S) ctx.lineTo(x, gy - amp * S * (0.55 + 0.45 * Math.sin((x - pan * pf) / (per * S) + off)));
    ctx.lineTo(2 * W, gy + 4 * S); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = rgba(P.ink, 0.6); ctx.lineWidth = lwS(2); ctx.stroke();
  }
  const TR = rng(31);
  for (let i = 0; i < 26; i++) { const x = TR() * 2.6 * W - 0.8 * W + pan * 0.3, r = (26 + TR() * 30) * S; inkCanopy(x, gy - r * 0.8, r, P, i % 3 ? "#7fb455" : "#94c463", i % 3 ? "#5a9140" : "#6a9f48", 2); }
  // fields: rows running to the horizon, crops and soil
  ctx.fillStyle = vg(gy, H, [[0, "#9dbb62"], [0.25, "#7fa24a"], [1, "#4f7a30"]]); ctx.fillRect(-W, gy, 3 * W, 3 * H);
  ctx.fillStyle = rgba(P.ink, 0.5); ctx.fillRect(-W, gy - 1 * S, 3 * W, 2 * S);
  const vx = F.x + pan * 0.4, n = 22;
  for (let r = -n; r <= n; r++) {
    const bx = vx + r * 190 * S, bx2 = vx + (r + 0.45) * 190 * S;
    ctx.beginPath(); ctx.moveTo(vx + r * 3 * S, gy); ctx.lineTo(bx * 1 + (bx - vx) * 1.6, H + 400 * S); ctx.lineTo(bx2 + (bx2 - vx) * 1.6, H + 400 * S); ctx.lineTo(vx + (r + 0.45) * 3 * S, gy); ctx.closePath();
    ctx.fillStyle = vg(gy, H, [[0, "rgba(150,96,56,0.35)"], [1, "rgba(140,86,48,0.85)"]]); ctx.fill();
  }
  // bean poles and squash between the corn
  const sway = Math.sin(lt * 1.5) * 10 * S;
  const cornAt = LAND ? [[0.04, 1.0], [0.12, 0.86], [0.2, 1.08], [0.3, 0.8], [0.9, 0.7]] : [[0.02, 0.78], [0.14, 0.64], [0.86, 0.66], [0.98, 0.8]];
  const base = LAND ? H + 20 * S : 0.66 * H;
  for (const [fx, k] of cornAt) {
    const x = fx * W + pan * 1.1, h = (LAND ? 820 : 760) * S * k;
    corn(x, base, h, sway * k + 18 * S, "#5f8a34", "#7cb84a");
    // a bean vine twining up
    const pts = [];
    for (let t = 0; t <= 0.7; t += 0.01) pts.push([x + (sway * k + 18 * S) * t * t + Math.sin(t * 38) * 12 * S, base - h * t]);
    inkStroke(pts, 3 * S, "#8cc063", P);
    for (let t = 0.1; t < 0.7; t += 0.12) inkLeaf(x + (sway * k + 18 * S) * t * t + Math.sin(t * 38) * 12 * S, base - h * t, 36 * S, 14 * S, Math.sin(t * 38) > 0 ? -0.3 : Math.PI + 0.3, "#b5dc6e", "#7cb84a", P, "heart", 1.8);
  }
  // squash: broad leaves on the ground and one ripe fruit
  const sqx = (LAND ? 0.2 : 0.5) * W + pan * 1.2, sqy = LAND ? H - 40 * S : 0.64 * H;
  for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * 0.42 + Math.sin(lt * 1.2 + i) * 0.03; inkLeaf(sqx, sqy + 40 * S, (190 + (i % 2) * 40) * S, 80 * S, a, i % 2 ? "#5d9a3a" : "#7cb84a", i % 2 ? "#3f7a30" : "#5a9140", P, "round", 2.6); }
  ctx.fillStyle = vg(sqy - 70 * S, sqy + 20 * S, [[0, "#f6ad48"], [1, "#e0822e"]]);
  ctx.beginPath(); ctx.ellipse(sqx + 90 * S, sqy - 10 * S, 70 * S, 52 * S, -0.1, 0, TAU); ctx.fill();
  ctx.strokeStyle = P.ink; ctx.lineWidth = lwS(2.6); ctx.stroke();
  ctx.strokeStyle = "rgba(120,60,20,0.5)"; ctx.lineWidth = 3 * S;
  for (const d of [-36, 0, 36]) { ctx.beginPath(); ctx.ellipse(sqx + 90 * S + d * S * 0.5, sqy - 10 * S, Math.max(4, (70 - Math.abs(d)) * 0.35) * S, 50 * S, -0.1, 0, TAU); ctx.stroke(); }
  // butterflies over the rows
  for (let i = 0; i < 3; i++) {
    const bx = ((0.2 + i * 0.3) * W + lt * (40 + i * 14) * S + Math.sin(lt * 1.7 + i * 2) * 40 * S), by = gy + (60 + i * 70) * S + Math.sin(lt * 2.3 + i) * 30 * S;
    butterfly(bx, by, 13 * S, ["#ffd760", "#f7f3ff", "#f5a8bd"][i], lt, i * 1.3);
  }
  ctx.restore();
}

// ============================================================
// SCENE 5: at sea, a storm on the horizon
// ============================================================
function drawSea(lt, o = {}) {
  ctx.save();
  const roll = Math.sin(lt * 1.7 + 0.4) * 0.028, bob = Math.sin(lt * 1.7) * 14 * S;
  cam({ z: o.z || 1, dy: (o.dy || 0), rot: 0 }, W / 2, HY);
  ctx.translate(W / 2, HY); ctx.rotate(roll); ctx.translate(-W / 2, -HY + bob);
  // sky
  big(vg(HY - 1100 * S, HY, [[0, "#0a2fa6"], [0.5, "#2a7cf0"], [0.85, "#8fd2ff"], [1, "#e8f8ff"]]));
  const sx = F.x + (LAND ? 240 : 160) * S, sy = HY - (LAND ? 470 : 640) * S;
  ctx.beginPath(); ctx.arc(sx, sy, 44 * S, 0, TAU); ctx.fillStyle = "#fff6cf"; ctx.fill(); ctx.strokeStyle = rgba(PAL.day.ink, 0.6); ctx.lineWidth = lwS(2.2); ctx.stroke();
  // clouds
  for (const [cx0, cy0, sc] of [[-0.05, -300, 1.2], [0.38, -210, 0.8], [0.66, -380, 1], [1.02, -250, 0.9]]) inkCloud(cx0 * W - lt * 26 * S, HY + cy0 * S * (LAND ? 1 : 1.5), 60 * S * sc, PAL.day);
  // a storm building on the horizon, with lightning in it
  const flash = (lt > 0.55 && lt < 0.62) || (lt > 0.7 && lt < 0.75) || (lt > 1.5 && lt < 1.56) ? 1 : 0;
  const stx = (LAND ? 0.16 : 0.24) * W - lt * 8 * S, sty = HY - (LAND ? 150 : 230) * S;
  const SR = rng(88);
  for (let i = 0; i < 14; i++) {
    const r = (70 + SR() * 90) * S * (LAND ? 1 : 0.9), x = stx + (SR() - 0.5) * 620 * S, y = sty - SR() * 200 * S + (i < 6 ? 110 * S : 0);
    canopy(x, y, r, flash ? "#8d96a8" : i % 2 ? "#4f5b6e" : "#5c687a");
  }
  // rain falling out of the cloud base: a soft curtain, streaked
  ctx.beginPath(); ctx.moveTo(stx - 330 * S, sty + 70 * S); ctx.lineTo(stx + 300 * S, sty + 70 * S); ctx.lineTo(stx + 250 * S, HY); ctx.lineTo(stx - 400 * S, HY); ctx.closePath();
  ctx.fillStyle = vg(sty + 60 * S, HY, [[0, flash ? "rgba(140,150,170,0.8)" : "rgba(70,82,100,0.75)"], [1, "rgba(70,82,100,0.25)"]]); ctx.fill();
  ctx.strokeStyle = "rgba(200,212,228,0.18)"; ctx.lineWidth = 2 * S;
  for (let k = 0; k < 22; k++) { const x = stx - 320 * S + k * 28 * S; ctx.beginPath(); ctx.moveTo(x, sty + 80 * S); ctx.lineTo(x - 40 * S, HY); ctx.stroke(); }
  if (flash) {
    ctx.strokeStyle = "#fffbe6"; ctx.lineWidth = 4 * S; ctx.lineJoin = "round";
    ctx.beginPath(); let bx0 = stx + 60 * S, by0 = sty + 70 * S; ctx.moveTo(bx0, by0);
    const BR = rng(lt < 1 ? 5 : 6);
    while (by0 < HY - 4 * S) { bx0 += (BR() - 0.5) * 60 * S; by0 += (18 + BR() * 26) * S; ctx.lineTo(bx0, Math.min(by0, HY)); }
    ctx.stroke();
    ctx.fillStyle = "rgba(255,250,230,0.16)"; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  }
  // sea
  ctx.fillStyle = vg(HY, H + 200 * S, [[0, "#3e8ff2"], [0.08, "#1a5bd0"], [0.5, "#0b3196"], [1, "#051a5e"]]);
  ctx.fillRect(-W, HY, 3 * W, 3 * H);
  // distant freighter
  const fx = (LAND ? 0.22 : 0.2) * W + lt * 6 * S;
  ctx.fillStyle = "#18306e"; ctx.fillRect(fx, HY - 9 * S, 70 * S, 9 * S); ctx.fillRect(fx + 48 * S, HY - 20 * S, 14 * S, 11 * S);
  // sun glitter
  const R = rng(3);
  for (let i = 0; i < 90; i++) {
    const gy = HY + 6 * S + Math.pow(R(), 1.6) * (H - HY) * 0.6, spread = 30 * S + (gy - HY) * 0.45;
    const gx = sx + (R() - 0.5) * spread * 2, on = Math.sin(lt * 9 + i * 12.9) > 0.2;
    if (on) { ctx.fillStyle = "rgba(255,255,255,0.85)"; ctx.fillRect(gx, gy, (4 + (gy - HY) * 0.05) * S, 2 * S); }
  }
  // swells
  for (let k = 0; k < 30; k++) {
    const y = HY + 7 * S * Math.pow(1.19, k);
    if (y > H + 200 * S) break;
    const dd = (y - HY) / S, A = (1 + dd * 0.035) * S, lam = (40 + dd * 0.9) * S, ph = lt * 2.2 + k * 1.3;
    ctx.beginPath();
    for (let x = -0.3 * W; x <= 1.3 * W; x += 12 * S) { const yy = y + A * Math.sin((x - lt * 40 * S) / lam * TAU + ph); x === -0.3 * W ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); }
    ctx.strokeStyle = `rgba(150,205,255,${0.18 + Math.min(0.3, dd * 0.0008)})`; ctx.lineWidth = (1 + dd * 0.012) * S; ctx.stroke();
    // whitecaps
    const r2 = rng(200 + k);
    for (let c = 0; c < 5; c++) {
      const cxp = (r2() * 1.6 - 0.3) * W - lt * (20 + dd * 0.2) * S, ph2 = Math.sin(lt * 3 + c * 2.3 + k);
      if (ph2 > 0.3) { ctx.fillStyle = `rgba(255,255,255,${(ph2 - 0.3) * 0.9})`; ctx.beginPath(); ctx.ellipse(cxp, y, (6 + dd * 0.12) * S, (1.5 + dd * 0.02) * S, 0, 0, TAU); ctx.fill(); }
    }
  }
  // the bow
  const pitch = Math.sin(lt * 1.7 - 1.3) * 26 * S;
  const tipX = F.x + (LAND ? 60 : 0) * S, tipY = HY + (LAND ? 200 : 330) * S + pitch;
  const bl = tipX - (LAND ? 760 : 620) * S, br = tipX + (LAND ? 820 : 620) * S, bb = H + 80 * S;
  // bulwarks (red hull edge)
  ctx.fillStyle = "#d8352a";
  ctx.beginPath(); ctx.moveTo(tipX, tipY - 26 * S); ctx.lineTo(bl - 90 * S, bb); ctx.lineTo(br + 90 * S, bb); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#a82519";
  ctx.beginPath(); ctx.moveTo(tipX, tipY - 26 * S); ctx.lineTo(br + 90 * S, bb); ctx.lineTo(br + 40 * S, bb); ctx.lineTo(tipX, tipY - 6 * S); ctx.closePath(); ctx.fill();
  // deck
  ctx.beginPath(); ctx.moveTo(tipX, tipY); ctx.lineTo(bl, bb); ctx.lineTo(br, bb); ctx.closePath();
  ctx.fillStyle = vg(tipY, bb, [[0, "#f7f4ec"], [1, "#cfc8ba"]]); ctx.fill();
  ctx.strokeStyle = "rgba(120,110,95,0.35)"; ctx.lineWidth = 2 * S;
  for (let i = 1; i < 6; i++) { const t = i / 6; ctx.beginPath(); ctx.moveTo(tipX, tipY); ctx.lineTo(lerp(bl, br, t), bb); ctx.stroke(); }
  // hatch + bollards + chain
  const at = (u, v) => [lerp(tipX, lerp(bl, br, u), v), lerp(tipY, bb, v)];
  ctx.fillStyle = "#1f2a44";
  for (const [u, v] of [[0.35, 0.35], [0.65, 0.35]]) { const [x, y] = at(u, v); ctx.beginPath(); ctx.ellipse(x, y, 14 * S * (0.6 + v), 8 * S * (0.6 + v), 0, 0, TAU); ctx.fill(); }
  ctx.strokeStyle = "#39415a"; ctx.lineWidth = 5 * S; ctx.setLineDash([9 * S, 5 * S]);
  { const [x1, y1] = at(0.5, 0.08), [x2, y2] = at(0.47, 0.6); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
  ctx.setLineDash([]);
  // railings
  for (const [ex, sgn] of [[bl - 70 * S, -1], [br + 70 * S, 1]]) {
    ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 5 * S;
    ctx.beginPath(); ctx.moveTo(tipX, tipY - 60 * S); ctx.lineTo(ex, bb - 300 * S); ctx.stroke();
    ctx.lineWidth = 3 * S;
    for (let i = 1; i <= 6; i++) { const t = i / 6.5; const x = lerp(tipX, ex, t), y0 = lerp(tipY - 26 * S, bb, t), y1 = lerp(tipY - 60 * S, bb - 300 * S, t); ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke(); }
    if (sgn < 0) { // life ring on the rail
      const t = 0.5, x = lerp(tipX, ex, t), y = lerp(tipY - 60 * S, bb - 300 * S, t) + 40 * S, r = 40 * S;
      ctx.lineWidth = 17 * S; ctx.strokeStyle = "#ff6a1a"; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
      ctx.strokeStyle = "#ffffff"; for (let q = 0; q < 4; q++) { ctx.beginPath(); ctx.arc(x, y, r, q * TAU / 4, q * TAU / 4 + 0.35); ctx.stroke(); }
    }
  }
  // spray when the bow dips
  const dip = clamp((pitch / S - 8) / 18);
  if (dip > 0) { const R2 = rng(9); ctx.fillStyle = `rgba(255,255,255,${0.8 * dip})`; for (let i = 0; i < 24; i++) { ctx.beginPath(); ctx.arc(tipX + (R2() - 0.5) * 160 * S, tipY - R2() * 70 * S * dip, (2 + R2() * 5) * S, 0, TAU); ctx.fill(); } }
  // gulls
  ctx.strokeStyle = "#0d2a6a"; ctx.lineWidth = 3.5 * S; ctx.lineCap = "round";
  for (let g = 0; g < 2; g++) { const gx = F.x - 380 * S + g * 170 * S + lt * 70 * S, gy = HY - 300 * S - g * 60 * S + Math.sin(lt * 2 + g) * 10 * S, fl = Math.sin(lt * 9 + g * 2) * 9 * S; ctx.beginPath(); ctx.moveTo(gx - 22 * S, gy - fl); ctx.quadraticCurveTo(gx - 10 * S, gy - 10 * S, gx, gy); ctx.quadraticCurveTo(gx + 10 * S, gy - 10 * S, gx + 22 * S, gy - fl); ctx.stroke(); }
  ctx.restore();
}

// ============================================================
// SCENE 6: a flooded road at dusk, the storm moving off
// ============================================================
const RAIN = (() => { const r = rng(61); return Array.from({ length: 220 }, () => ({ x: r() * 1.4 * W - 0.2 * W, y: r() * H, l: (30 + r() * 50) * S, sp: (1400 + r() * 900) * S, a: 0.12 + r() * 0.25 })); })();
function drawRoad(lt, o = {}) {
  const P = PAL.day;
  ctx.save();
  cam({ z: (o.z || 1) * (1 + 0.035 * clamp(lt / 2.3)), dy: o.dy || 0 }, F.x, HY);
  const vx = F.x + (LAND ? -40 : 0) * S;
  // sky: the rain easing off, soft grey cloud breaking to blue, no sunset
  big(vg(HY - 1300 * S, HY, [[0, "#5f87a8"], [0.45, "#8fb0c6"], [0.8, "#c6d7df"], [1, "#e2eaea"]]));
  const GP = { ...P, cloud: "#dfe6ea", cloudS: "#aebdc8" };
  const cR = rng(19);
  for (let i = 0; i < 12; i++) {
    const x = cR() * 1.8 * W - 0.4 * W - lt * (14 + cR() * 10) * S, y = HY - (380 + cR() * 520) * S * (LAND ? 1 : 1.3), r = (60 + cR() * 70) * S;
    inkCloud(x, y, r, GP);
  }
  // fields to the horizon, a line of trees
  ctx.fillStyle = vg(HY, H, [[0, "#86a95a"], [1, "#4a6e2e"]]); ctx.fillRect(-W, HY, 3 * W, 3 * H);
  const tR = rng(23);
  for (let i = 0; i < 30; i++) { const x = tR() * 2.4 * W - 0.7 * W, r = (18 + tR() * 26) * S; inkCanopy(x, HY - r * 0.7, r, P, i % 2 ? "#6f9f4c" : "#7fae55", i % 2 ? "#4f7f38" : "#5a8a3e", 2); }
  ctx.fillStyle = rgba(P.ink, 0.5); ctx.fillRect(-W, HY - 1 * S, 3 * W, 2 * S);
  // power line along the road, running out to the horizon
  for (let k = 0; k < 9; k++) {
    const z = 1 + k * 1.1, x = vx + 560 * S / z, top = HY - 420 * S / z, bot = HY + 260 * S / z;
    ctx.strokeStyle = "#4a3b2c"; ctx.lineWidth = Math.max(1.2, 12 * S / z);
    ctx.beginPath(); ctx.moveTo(x, bot); ctx.lineTo(x, top); ctx.moveTo(x - 50 * S / z, top + 18 * S / z); ctx.lineTo(x + 50 * S / z, top + 18 * S / z); ctx.stroke();
    if (k < 8) { const z2 = z + 1.1, x2 = vx + 560 * S / z2, t2 = HY - 420 * S / z2; ctx.strokeStyle = P.ink; ctx.lineWidth = Math.max(1, 2 * S / z); ctx.beginPath(); ctx.moveTo(x, top + 18 * S / z); ctx.quadraticCurveTo((x + x2) / 2, (top + t2) / 2 + 40 * S / z, x2, t2 + 18 * S / z2); ctx.stroke(); }
  }
  // the road
  const bw = (LAND ? 1500 : 1300) * S;
  ctx.beginPath(); ctx.moveTo(vx - 6 * S, HY); ctx.lineTo(vx + 6 * S, HY); ctx.lineTo(vx + bw, H + 60 * S); ctx.lineTo(vx - bw, H + 60 * S); ctx.closePath();
  ctx.fillStyle = vg(HY, H, [[0, "#7c7b78"], [1, "#55565a"]]); ctx.fill(); ctx.strokeStyle = rgba(P.ink, 0.6); ctx.lineWidth = lwS(2); ctx.stroke();
  // centre dashes
  const px = (yy) => (yy - HY) / (H + 60 * S - HY);
  for (let k = 0; k < 14; k++) {
    const d0 = ((k + lt * 0.35) % 14) / 14, a = Math.pow(d0, 2.2), b = Math.pow(Math.min(1, d0 + 0.03), 2.2);
    const y0 = HY + a * (H - HY), y1 = HY + b * (H - HY), w0 = 8 * S * px(y0) * 3 + 1, w1 = 8 * S * px(y1) * 3 + 1;
    ctx.fillStyle = "#f3e2a6"; ctx.beginPath(); ctx.moveTo(vx - w0, y0); ctx.lineTo(vx + w0, y0); ctx.lineTo(vx + w1, y1); ctx.lineTo(vx - w1, y1); ctx.fill();
  }
  // the water: a sheet across road and fields, reflecting the grey sky, flowing left to right
  const w0 = HY + 0.07 * (H - HY), w1 = HY + 0.42 * (H - HY);
  ctx.beginPath(); ctx.moveTo(-W, w0 + 6 * S);
  for (let x = -W; x <= 2 * W; x += 16 * S) ctx.lineTo(x, w0 + 5 * S * Math.sin(x / (90 * S) + lt * 2));
  ctx.lineTo(2 * W, w1); for (let x = 2 * W; x >= -W; x -= 16 * S) ctx.lineTo(x, w1 + 7 * S * Math.sin(x / (120 * S) - lt * 2.4)); ctx.closePath();
  ctx.fillStyle = vg(w0, w1, [[0, "#d3dfe3"], [0.3, "#a9bcc4"], [0.7, "#8a7f66"], [1, "#6d6450"]]); ctx.fill();
  ctx.strokeStyle = rgba(P.ink, 0.55); ctx.lineWidth = lwS(2); ctx.stroke();
  ctx.save(); ctx.clip();
  for (let k = 0; k < 16; k++) {
    const y = lerp(w0, w1, (k + 0.5) / 16), t = (k + 0.5) / 16;
    ctx.strokeStyle = `rgba(245,250,252,${0.5 - t * 0.25})`; ctx.lineWidth = (1 + t * 2.5) * S;
    ctx.setLineDash([(40 + t * 140) * S, (30 + t * 90) * S]); ctx.lineDashOffset = -lt * (140 + t * 300) * S - k * 50 * S;
    ctx.beginPath(); ctx.moveTo(-W, y); ctx.lineTo(2 * W, y); ctx.stroke();
  }
  ctx.setLineDash([]); ctx.restore();
  // foam where the water crosses the near edge of the road
  ctx.strokeStyle = "rgba(255,255,255,0.85)"; ctx.lineWidth = 3 * S; ctx.setLineDash([22 * S, 12 * S]); ctx.lineDashOffset = -lt * 160 * S;
  ctx.beginPath(); for (let x = -W; x <= 2 * W; x += 16 * S) { const y = w1 + 7 * S * Math.sin(x / (120 * S) - lt * 2.4) - 2 * S; x === -W ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); ctx.setLineDash([]);
  // a warning sign at the edge of the water
  const sgx = vx + (LAND ? -300 : -260) * S, sgy = w1 + 30 * S;
  ctx.fillStyle = "#5a5a5a"; ctx.fillRect(sgx - 4 * S, sgy - 150 * S, 8 * S, 170 * S); ctx.strokeStyle = P.ink; ctx.lineWidth = lwS(1.6); ctx.strokeRect(sgx - 4 * S, sgy - 150 * S, 8 * S, 170 * S);
  ctx.save(); ctx.translate(sgx, sgy - 190 * S); ctx.rotate(Math.PI / 4);
  rr(-48 * S, -48 * S, 96 * S, 96 * S, 8 * S); ctx.fillStyle = "#f2b13e"; ctx.fill(); ctx.strokeStyle = "#1a1f1a"; ctx.lineWidth = 5 * S; ctx.stroke();
  ctx.restore();
  ctx.strokeStyle = "#1a1f1a"; ctx.lineWidth = 6 * S; ctx.lineCap = "round";
  for (const dy of [-10, 10]) { ctx.beginPath(); for (let x = -34; x <= 34; x += 2) { const y = sgy - 190 * S + dy * S + Math.sin(x / 7) * 6 * S; x === -34 ? ctx.moveTo(sgx + x * S, y) : ctx.lineTo(sgx + x * S, y); } ctx.stroke(); }
  // the last of the rain
  ctx.strokeStyle = "rgba(90,110,130,0.55)"; ctx.lineWidth = 1.6 * S;
  for (const d of RAIN) {
    const y = ((d.y + lt * d.sp) % (H + 200 * S)) - 100 * S, x = d.x - (y - d.y) * 0.18;
    ctx.globalAlpha = d.a; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - d.l * 0.18, y + d.l); ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

// ============================================================
// END CARD sky (periodic over T; it is on screen across the loop point)
// ============================================================
function drawEndSky(tau, o = {}) {
  // a clear day over hills and a tree line (or a moonlit night): no sunburst, no halo
  natureSky(tau, { hy: (o.hy ?? 0.84) * H, night: o.night, clouds: o.clouds, moon: o.moon });
}

function inScreen(fn) { return () => screen(fn); }
function clipRect(x, y, w, h, fn) { ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); fn(); ctx.restore(); }
const APP = {
  sans: "Roboto", mono: "Noto Sans Mono",
  status: "#03110a", header: "#0c0f18", headerRule: "#141926", btn: "#181b24",
  chat: "#081d18", chatShade: "#06180e",
  userBg: "#112f1a", userBorder: "#74f08e", you: "#7eeea2",
  astBg: "#06190e", astBorder: "#1c3f27", boar: "#75ed8b",
  text: "#f7fffc", rule: "rgba(255,255,255,0.08)",
  srcTitle: "#65bffa", countBg: "rgba(255,255,255,0.07)", count: "#7c8a94",
  chipBg: "#0e1724", chipBorder: "#1f2938", idxBg: "rgba(6,182,212,0.16)", idx: "#5fb0e0", chipText: "#f2f5f7", chev: "#6b788d",
  pillBg: "#122226", pillBorder: "#22493e", pillText: "#6cca9d", model: "#6b7688",
  plusBg: "#0e2a20", plusBorder: "#23473e", plus: "#70d9a4",
  cursor: "#3ef08a", footBtn: "#0b2414", footBorder: "#173a21",
  inputBar: "#03120a", inputBg: "#020d06", inputBorder: "#1e4029", placeholder: "#498c5a", send: "#18231e", sendGlyph: "#6a7b77",
  stop: "#dc2626",
};
function af(weight, px, fam = APP.sans) { ctx.font = `${weight} ${u(px)}px "${fam}"`; ctx.fontStretch = "normal"; }
function wrapW(text, maxW) {
  const words = text.split(" "), lines = []; let line = [];
  for (const w of words) { const test = [...line, w].join(" "); if (line.length && ctx.measureText(test).width > maxW) { lines.push(line); line = [w]; } else line.push(w); }
  if (line.length) lines.push(line);
  return lines;
}
function airplaneIcon(x, y, s, col) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s / 24, s / 24); ctx.fillStyle = col;
  ctx.beginPath(); ctx.moveTo(12, 1.5); ctx.bezierCurveTo(13.2, 1.5, 13.6, 3, 13.6, 4.5); ctx.lineTo(13.6, 9); ctx.lineTo(22, 14); ctx.lineTo(22, 16.2); ctx.lineTo(13.6, 13.6); ctx.lineTo(13.6, 18.4); ctx.lineTo(16, 20.2); ctx.lineTo(16, 22); ctx.lineTo(12, 20.8); ctx.lineTo(8, 22); ctx.lineTo(8, 20.2); ctx.lineTo(10.4, 18.4); ctx.lineTo(10.4, 13.6); ctx.lineTo(2, 16.2); ctx.lineTo(2, 14); ctx.lineTo(10.4, 9); ctx.lineTo(10.4, 4.5); ctx.bezierCurveTo(10.4, 3, 10.8, 1.5, 12, 1.5); ctx.fill();
  ctx.restore();
}
function noBars(x, y, s, col) {
  for (let i = 0; i < 4; i++) { const h = s * (0.35 + i * 0.21), w = s * 0.17; rr(x + i * s * 0.25, y + s - h, w, h, s * 0.06); ctx.strokeStyle = col; ctx.lineWidth = s * 0.07; ctx.stroke(); }
  ctx.strokeStyle = col; ctx.lineWidth = s * 0.1; ctx.beginPath(); ctx.moveTo(x - s * 0.08, y + s * 1.04); ctx.lineTo(x + s * 0.95, y - s * 0.04); ctx.stroke();
}
