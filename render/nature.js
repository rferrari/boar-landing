// Nature kit shared by the film (render/scene.html) and the thread clips (render/thread/):
// ink-outlined leaves, vines, branches, ferns, flowers, trees and clouds with flat cel shading,
// lit by daylight (or a cool moonlit ambient), and the foliage frame that borders every shot.
// Globals W, H, S, T, ctx, TAU and the helpers in world.js (rng, clamp, lerp, rgba, mixHex) come first.
// Every shape is a pure function of t, and every motion is periodic over T so loops stay seamless.

const PAL = {
  day: {
    ink: "#1b291c", l1: "#b5dc6e", l2: "#7cb84a", l3: "#4a8a3a", l4: "#2c6030", l5: "#1f4726",
    stem: "#8a5a36", stemD: "#5e3b22", petals: ["#f7f3ff", "#c9b5f0", "#f5a8bd", "#ffd760", "#ffffff"], eye: "#f2b13e",
    sky0: "#4f9bd8", sky1: "#9bcdee", sky2: "#e4f2f6", cloud: "#ffffff", cloudS: "#d3e3ef", hill1: "#a9c98a", hill2: "#7fae5e", hill3: "#5b9146",
  },
  night: {
    ink: "#08120f", l1: "#5f8f7c", l2: "#467565", l3: "#315a50", l4: "#21433d", l5: "#16302c",
    stem: "#4a4650", stemD: "#34313a", petals: ["#dfe4f6", "#a9b1dc", "#c9a9c8", "#e8dca0", "#eef1fb"], eye: "#cfc48a",
    sky0: "#0c1a2c", sky1: "#15304a", sky2: "#244652", cloud: "#3a5268", cloudS: "#2c4258", hill1: "#233c3c", hill2: "#1a3131", hill3: "#132624",
  },
};
// seconds -> a periodic phase: k whole turns across the loop
const wave = (t, k, ph = 0) => Math.sin(TAU * k * t / T + ph);
const lwS = (v) => Math.max(1, v * S);

// ---------- primitives ----------
function leafPath(len, wid, kind) {
  const p = new Path2D();
  if (kind === "heart") {
    p.moveTo(0, 0);
    p.bezierCurveTo(len * 0.05, -wid * 1.05, len * 0.62, -wid * 1.1, len, 0);
    p.bezierCurveTo(len * 0.62, wid * 1.1, len * 0.05, wid * 1.05, 0, 0);
  } else if (kind === "round") {
    p.moveTo(0, 0);
    p.bezierCurveTo(len * 0.1, -wid * 1.2, len * 0.95, -wid * 1.05, len, 0);
    p.bezierCurveTo(len * 0.95, wid * 1.05, len * 0.1, wid * 1.2, 0, 0);
  } else {
    p.moveTo(0, 0);
    p.bezierCurveTo(len * 0.25, -wid, len * 0.72, -wid * 0.9, len, 0);
    p.bezierCurveTo(len * 0.72, wid * 0.9, len * 0.25, wid, 0, 0);
  }
  return p;
}
// one leaf: flat fill, the far half in shade, an ink outline and midrib
function inkLeaf(x, y, len, wid, ang, c1, c2, P, kind = "lance", lw = 2.4) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
  const p = leafPath(len, wid, kind);
  ctx.fillStyle = c1; ctx.fill(p);
  ctx.save(); ctx.clip(p);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(len * 0.5, -wid * 0.1, len, 0); ctx.lineTo(len, wid * 2); ctx.lineTo(0, wid * 2); ctx.closePath();
  ctx.fillStyle = c2; ctx.fill();
  ctx.restore();
  ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.strokeStyle = P.ink;
  ctx.lineWidth = lwS(lw); ctx.stroke(p);
  ctx.lineWidth = lwS(lw * 0.55); ctx.beginPath(); ctx.moveTo(len * 0.04, 0); ctx.quadraticCurveTo(len * 0.5, -wid * 0.1, len * 0.86, 0); ctx.stroke();
  ctx.restore();
}
// a stem drawn as ink line with a coloured core
function inkStroke(pts, w, col, P) {
  ctx.lineJoin = "round"; ctx.lineCap = "round";
  const path = () => { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); };
  path(); ctx.strokeStyle = P.ink; ctx.lineWidth = w + lwS(4.4); ctx.stroke();
  path(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.stroke();
}
function flower(x, y, r, col, P, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  ctx.lineWidth = lwS(1.8); ctx.strokeStyle = P.ink;
  for (let k = 0; k < 5; k++) {
    const a = k * TAU / 5;
    ctx.beginPath(); ctx.ellipse(Math.cos(a) * r * 0.62, Math.sin(a) * r * 0.62, r * 0.52, r * 0.36, a, 0, TAU);
    ctx.fillStyle = col; ctx.fill(); ctx.stroke();
  }
  ctx.beginPath(); ctx.arc(0, 0, r * 0.3, 0, TAU); ctx.fillStyle = P.eye; ctx.fill(); ctx.stroke();
  ctx.restore();
}
// a small bell of hanging blossoms (wisteria-like)
function blossomTrail(x, y, n, r, col, P, sw) {
  for (let i = 0; i < n; i++) {
    const yy = y + i * r * 1.25, xx = x + Math.sin(i * 1.3) * r * 0.5 + sw * i * 0.6;
    ctx.beginPath(); ctx.arc(xx, yy, r * (1 - i * 0.08), 0, TAU); ctx.fillStyle = col; ctx.fill();
    ctx.strokeStyle = P.ink; ctx.lineWidth = lwS(1.6); ctx.stroke();
  }
}

// ---------- assemblies ----------
// a vine hanging from (x, y0), heart leaves on alternating sides, sometimes a flower
function hangingVine(x, y0, len, t, seed, P, o = {}) {
  const R = rng(seed), n = Math.max(3, Math.round(len / (46 * S))), step = len / n;
  const amp = (o.amp ?? 22) * S, ph = R() * TAU, k = o.k || 1;
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const f = i / n, sw = amp * Math.pow(f, 1.6) * wave(t, k, ph + f * 1.2);
    pts.push([x + sw + Math.sin(f * 7 + seed) * 6 * S, y0 + i * step]);
  }
  inkStroke(pts, lwS(o.stemW || 3.2), o.stem || P.l4, P);
  const size = (o.size || 38) * S;
  for (let i = 1; i <= n; i++) {
    const [px, py] = pts[i], side = i % 2 ? 1 : -1, s = size * (0.72 + R() * 0.45) * (1 - (i / n) * 0.35);
    const a = Math.PI / 2 + side * (0.95 + R() * 0.35) + wave(t, k, ph + i) * 0.08;
    const cols = R() < 0.5 ? [P.l2, P.l3] : [P.l1, P.l2];
    inkLeaf(px, py, s, s * 0.5, a, cols[0], cols[1], P, "heart", 2);
    if (o.flowers && R() < o.flowers) flower(px - side * s * 0.4, py + s * 0.25, s * 0.34, P.petals[Math.floor(R() * 4)], P, R() * TAU);
  }
  if (o.trail) { const [ex, ey] = pts[n]; blossomTrail(ex, ey + 6 * S, 5, 9 * S, o.trail, P, 0); }
}
// leaves fanning out from a point in direction ang, spread in radians
function leafFan(x, y, ang, spread, n, len, t, seed, P, o = {}) {
  const R = rng(seed), ph = R() * TAU, k = o.k || 1, sway = (o.sway ?? 0.05);
  const shades = o.shades || [[P.l4, P.l5], [P.l3, P.l4], [P.l2, P.l3], [P.l1, P.l2]];
  for (let i = 0; i < n; i++) {
    const f = n === 1 ? 0.5 : i / (n - 1), a = ang + (f - 0.5) * spread + (R() - 0.5) * 0.18 + sway * wave(t, k, ph + i * 0.7);
    const l = len * (0.7 + R() * 0.45), c = shades[Math.min(shades.length - 1, Math.floor(R() * shades.length))];
    inkLeaf(x, y, l, l * (o.ratio || 0.3), a, c[0], c[1], P, o.kind || "lance", o.lw || 2.6);
  }
}
// a fern frond: a curved rachis with paired leaflets
function fern(x, y, len, ang, t, seed, P, o = {}) {
  const R = rng(seed), ph = R() * TAU, curl = (o.curl ?? 0.5) + 0.05 * wave(t, o.k || 1, ph), n = 16;
  const pts = []; let a = ang, px = x, py = y;
  for (let i = 0; i <= n; i++) { pts.push([px, py, a]); px += Math.cos(a) * len / n; py += Math.sin(a) * len / n; a += curl / n * (o.dir || 1); }
  inkStroke(pts.map(([x, y]) => [x, y]), lwS(2.4), P.l4, P);
  for (let i = 1; i < n; i++) {
    const [qx, qy, qa] = pts[i], f = i / n, l = len * 0.24 * Math.sin(Math.PI * (0.15 + f * 0.85)) * (1.05 - f * 0.4);
    for (const s of [-1, 1]) inkLeaf(qx, qy, l, l * 0.3, qa + s * 1.05, i % 2 ? P.l2 : P.l3, P.l4, P, "lance", 1.8);
  }
}
// a branch with twigs and leaf clusters
function branch(x, y, ang, len, t, seed, P, o = {}) {
  const R = rng(seed), ph = R() * TAU, n = 10, sway = (o.sway ?? 0.018) * wave(t, o.k || 1, ph);
  const pts = []; let a = ang, px = x, py = y;
  for (let i = 0; i <= n; i++) { pts.push([px, py]); px += Math.cos(a) * len / n; py += Math.sin(a) * len / n; a += ((o.bend ?? 0.25) / n) + sway; }
  const w = (o.w || 16) * S;
  // taper by drawing segments
  for (let i = 0; i < n; i++) inkStroke([pts[i], pts[i + 1]], Math.max(lwS(2), w * (1 - i / n * 0.75)), P.stem, P);
  const clusters = [];
  for (let i = 2; i <= n; i += 2) {
    const [bx, by] = pts[i], side = (i / 2) % 2 ? 1 : -1, ta = a + side * (0.7 + R() * 0.4);
    clusters.push([bx, by, ta]);
  }
  clusters.forEach(([bx, by, ta], j) => leafFan(bx, by, ta, 1.8, o.leaves || 6, (o.leafLen || 90) * S, t, seed * 7 + j, P, { sway: 0.06, ratio: 0.32 }));
  const [ex, ey] = pts[n];
  leafFan(ex, ey, a, 2.2, (o.leaves || 6) + 2, (o.leafLen || 90) * S, t, seed * 13, P, { sway: 0.07, ratio: 0.32 });
  return pts;
}
// grass blades, small flowers and a round bush or two along the bottom edge
function meadow(x0, x1, y, t, seed, P, o = {}) {
  const R = rng(seed), h = (o.h || 70) * S, n = Math.round((x1 - x0) / (14 * S));
  // back row: bushes
  for (let i = 0; i < (o.bushes || 0); i++) { const bx = lerp(x0, x1, R()), r = (40 + R() * 36) * S; inkCanopy(bx, y - r * 0.5, r, P, P.l3, P.l4); }
  for (let i = 0; i < n; i++) {
    const bx = x0 + i * 14 * S + R() * 8 * S, bh = h * (0.5 + R() * 0.7), lean = (R() - 0.5) * 0.5;
    ctx.beginPath(); ctx.moveTo(bx - 5 * S, y + 4 * S); ctx.quadraticCurveTo(bx + lean * bh * 0.4, y - bh * 0.55, bx + lean * bh, y - bh); ctx.quadraticCurveTo(bx + lean * bh * 0.3 + 3 * S, y - bh * 0.45, bx + 6 * S, y + 4 * S); ctx.closePath();
    ctx.fillStyle = R() < 0.5 ? P.l2 : P.l3; ctx.fill(); ctx.strokeStyle = P.ink; ctx.lineWidth = lwS(1.6); ctx.stroke();
  }
  ctx.fillStyle = P.l4; ctx.fillRect(x0, y, x1 - x0, 60 * S);
  for (let i = 0; i < (o.flowers || 0); i++) { const fx = lerp(x0, x1, R()), fy = y - (10 + R() * h * 0.7); flower(fx, fy, (8 + R() * 6) * S, P.petals[Math.floor(R() * 4)], P, R() * TAU); }
}
// a cloud-shaped canopy (trees, bushes) with an ink outline and a lit top
const CANOPY_LOBES = [[0, 0, 1], [-0.8, 0.25, 0.75], [0.8, 0.2, 0.8], [-0.35, -0.45, 0.7], [0.45, -0.4, 0.65], [0, 0.5, 0.8]];
function lobes(x, y, r, grow = 0) { const p = new Path2D(); for (const [dx, dy, k] of CANOPY_LOBES) { p.moveTo(x + dx * r + (k * r + grow), y + dy * r); p.arc(x + dx * r, y + dy * r, k * r + grow, 0, TAU); } return p; }
function inkCanopy(x, y, r, P, c1 = P.l2, c2 = P.l3, lw = 2.4) {
  const outer = lobes(x, y, r, lwS(lw) * 0.9);
  ctx.fillStyle = P.ink; ctx.fill(outer);
  const p = lobes(x, y, r);
  ctx.fillStyle = c2; ctx.fill(p);
  ctx.save(); ctx.clip(p); ctx.fillStyle = c1;
  ctx.beginPath(); ctx.arc(x - r * 0.28, y - r * 0.4, r * 1.05, 0, TAU); ctx.fill();
  ctx.restore();
}
function tree(x, gy, h, P, seed = 1, o = {}) {
  const R = rng(seed), r = h * 0.3;
  inkStroke([[x, gy], [x + (R() - 0.5) * 8 * S, gy - h * 0.55]], Math.max(lwS(3), h * 0.07), P.stem, P);
  inkCanopy(x, gy - h * 0.68, r, P, o.c1 || P.l2, o.c2 || P.l3);
  if (r > 26 * S) inkCanopy(x + r * 0.55, gy - h * 0.5, r * 0.6, P, o.c1 || P.l2, o.c2 || P.l3);
}
function pine(x, gy, h, P, c1 = P.l3, c2 = P.l4) {
  const w = h * 0.36;
  ctx.fillStyle = P.stemD; ctx.fillRect(x - h * 0.03, gy - h * 0.14, h * 0.06, h * 0.16);
  for (let k = 0; k < 3; k++) {
    const top = gy - h * (0.42 + k * 0.26), base = gy - h * (0.1 + k * 0.24), ww = w * (1 - k * 0.24);
    ctx.beginPath(); ctx.moveTo(x, top - h * 0.14); ctx.lineTo(x + ww, base); ctx.lineTo(x - ww, base); ctx.closePath();
    ctx.fillStyle = c2; ctx.fill();
    ctx.save(); ctx.clip(); ctx.fillStyle = c1; ctx.fillRect(x - ww, top - h * 0.2, ww, h); ctx.restore();
    ctx.beginPath(); ctx.moveTo(x, top - h * 0.14); ctx.lineTo(x + ww, base); ctx.lineTo(x - ww, base); ctx.closePath();
    ctx.strokeStyle = P.ink; ctx.lineWidth = lwS(2); ctx.lineJoin = "round"; ctx.stroke();
  }
}
function inkCloud(x, y, r, P, a = 1) {
  ctx.save(); ctx.globalAlpha *= a;
  const lob = [[0, 0, 1], [1.1, 0.25, 0.8], [-1.1, 0.3, 0.75], [0.5, -0.5, 0.85], [2, 0.5, 0.55], [-1.9, 0.55, 0.5]];
  const path = (g) => { const p = new Path2D(); for (const [dx, dy, k] of lob) { p.moveTo(x + dx * r + k * r + g, y + dy * r); p.arc(x + dx * r, y + dy * r, k * r + g, 0, TAU); } p.rect(x - 2.3 * r - g, y + 0.3 * r - g, 4.6 * r + 2 * g, 0.6 * r + 2 * g); return p; };
  const clipB = new Path2D(); clipB.rect(x - 4 * r, y - 4 * r, 8 * r, 4.85 * r);
  ctx.save(); ctx.clip(clipB);
  ctx.fillStyle = P.ink; ctx.fill(path(lwS(2.2)));
  const p = path(0); ctx.fillStyle = P.cloudS; ctx.fill(p);
  ctx.save(); ctx.clip(p); ctx.fillStyle = P.cloud; for (const [dx, dy, k] of lob) { ctx.beginPath(); ctx.arc(x + dx * r - r * 0.12, y + dy * r - r * 0.16, k * r, 0, TAU); ctx.fill(); } ctx.restore();
  ctx.restore();
  ctx.restore();
}
// rolling hills with an ink edge
function hills(y, amp, per, col, P, off = 0, x0 = -0.2 * W, x1 = 1.2 * W) {
  ctx.beginPath(); ctx.moveTo(x0, H * 2);
  for (let x = x0; x <= x1; x += 8 * S) ctx.lineTo(x, y - amp * (0.55 + 0.3 * Math.sin(x / per + off) + 0.15 * Math.sin(x / (per * 0.43) + off * 2.1)));
  ctx.lineTo(x1, H * 2); ctx.closePath();
  ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = P.ink; ctx.lineWidth = lwS(2.4); ctx.stroke();
}

// ---------- a daylight sky with clouds, hills and a tree line (or a moonlit one) ----------
function natureSky(t, o = {}) {
  const P = o.night ? PAL.night : PAL.day, hy = o.hy ?? 0.8 * H;
  ctx.fillStyle = vg(0, hy, [[0, P.sky0], [0.6, P.sky1], [1, P.sky2]]); ctx.fillRect(0, 0, W, H);
  if (o.night) {
    const R = rng(5);
    for (let i = 0; i < 90; i++) { const x = R() * W, y = R() * hy * 0.8, r = (1 + R() * 1.6) * S; ctx.fillStyle = `rgba(236,240,226,${0.35 + 0.4 * R()})`; ctx.fillRect(x, y, r, r); }
    const mx = (o.moon?.[0] ?? 0.78) * W, my = (o.moon?.[1] ?? 0.2) * H, mr = 46 * S;
    ctx.beginPath(); ctx.arc(mx, my, mr, 0, TAU); ctx.fillStyle = "#eceedd"; ctx.fill(); ctx.strokeStyle = P.ink; ctx.lineWidth = lwS(2.4); ctx.stroke();
    ctx.save(); ctx.beginPath(); ctx.arc(mx, my, mr, 0, TAU); ctx.clip(); ctx.beginPath(); ctx.arc(mx + mr * 0.45, my + mr * 0.2, mr, 0, TAU); ctx.fillStyle = "#cfd3c2"; ctx.fill(); ctx.restore();
    for (const [dx, dy, r] of [[-0.3, -0.2, 0.16], [0.15, 0.35, 0.12], [-0.1, 0.25, 0.08]]) { ctx.beginPath(); ctx.arc(mx + dx * mr, my + dy * mr, r * mr, 0, TAU); ctx.fillStyle = "#c4c8b6"; ctx.fill(); }
  }
  const clouds = o.clouds || [[0.16, 0.14, 0.9], [0.72, 0.09, 0.7], [0.5, 0.3, 0.6], [0.95, 0.36, 0.8]];
  clouds.forEach(([cx, cy, sc], i) => inkCloud(cx * W + 26 * S * wave(t, 1, i * 1.7), cy * H, 56 * S * sc, P, o.night ? 0.55 : 1));
  if (o.ground !== false) {
    hills(hy - 30 * S, 120 * S, 300 * S, P.hill1, P, 1.3);
    const TR = rng(31);
    for (let i = 0; i < 16; i++) { const x = TR() * 1.2 * W - 0.1 * W; tree(x, hy - 20 * S + TR() * 30 * S, (90 + TR() * 80) * S, P, 40 + i); }
    hills(hy + 50 * S, 90 * S, 240 * S, P.hill2, P, 4.1);
    hills(hy + 150 * S, 70 * S, 200 * S, P.hill3, P, 2.2);
  }
}

// ---------- the foliage frame ----------
// Everything grows in from the edges; the middle stays open for the phone and the words.
// spec: { night, top: "right" | "left" | "both" | "none", vines: [[x, len], ...] (x as a fraction of W),
//         left: bool (climber up the left edge), right: bool, bottom: bool (meadow), corners: ["bl", "br", "tl", "tr"] }
function foliageFrame(t, spec = {}) {
  const P = spec.night ? PAL.night : PAL.day;
  const top = spec.top ?? "right";
  const L = (fx) => fx * W;
  // hanging vines first (they sit behind the branches they hang from)
  for (const [fx, len, seed, extra] of (spec.vines || [])) hangingVine(L(fx), -10 * S, len * S, t, seed || Math.round(fx * 100), P, { flowers: 0.18, amp: 18, ...(extra || {}) });
  if (top === "right" || top === "both") {
    branch(W + 30 * S, 38 * S, Math.PI + 0.12, 420 * S * (spec.reach || 1), t, 3, P, { bend: -0.35, w: 20, leafLen: 92, leaves: 6 });
    leafFan(W + 10 * S, -10 * S, Math.PI * 0.72, 1.2, 7, 150 * S, t, 11, P, { ratio: 0.3, sway: 0.05 });
  }
  if (top === "left" || top === "both") {
    branch(-30 * S, 30 * S, 0.1, 360 * S * (spec.reachL || 1), t, 5, P, { bend: 0.3, w: 18, leafLen: 86, leaves: 6 });
    leafFan(-10 * S, -10 * S, Math.PI * 0.3, 1.2, 6, 140 * S, t, 12, P, { ratio: 0.3, sway: 0.05 });
  }
  if (spec.left) {
    // a climber up the left edge
    const pts = []; const y0 = H + 20 * S, y1 = (spec.leftTop ?? 0.35) * H;
    for (let i = 0; i <= 14; i++) { const f = i / 14; pts.push([18 * S + Math.sin(f * 9) * 12 * S + 6 * S * wave(t, 1, f * 3), lerp(y0, y1, f)]); }
    inkStroke(pts, lwS(3.6), P.l4, P);
    const R = rng(71);
    pts.slice(1).forEach(([x, y], i) => { const s = (40 + R() * 22) * S; inkLeaf(x, y, s, s * 0.5, (i % 2 ? -0.35 : -2.8) + 0.08 * wave(t, 1, i), i % 3 ? P.l2 : P.l1, P.l3, P, "heart", 2); if (R() < 0.2) flower(x + 20 * S, y - 10 * S, 12 * S, P.petals[i % 4], P, i); });
  }
  if (spec.right) {
    const pts = []; const y0 = H + 20 * S, y1 = (spec.rightTop ?? 0.45) * H;
    for (let i = 0; i <= 14; i++) { const f = i / 14; pts.push([W - 16 * S - Math.sin(f * 8 + 1) * 10 * S + 6 * S * wave(t, 1, f * 3 + 1), lerp(y0, y1, f)]); }
    inkStroke(pts, lwS(3.6), P.l4, P);
    const R = rng(73);
    pts.slice(1).forEach(([x, y], i) => { const s = (38 + R() * 20) * S; inkLeaf(x, y, s, s * 0.5, (i % 2 ? Math.PI + 0.35 : -0.4) + 0.08 * wave(t, 1, i + 2), i % 3 ? P.l2 : P.l1, P.l3, P, "heart", 2); });
  }
  if (spec.bottom) meadow(-20 * S, W + 20 * S, H - (spec.bottomH ?? 26) * S, t, 17, P, { h: spec.grassH || 64, flowers: spec.bottomFlowers ?? 9, bushes: 0 });
  const corners = spec.corners || [];
  if (corners.includes("bl")) {
    fern(-20 * S, H + 10 * S, 330 * S, -1.2, t, 21, P, { curl: 0.7 });
    leafFan(-30 * S, H + 30 * S, -0.9, 1.2, 6, 250 * S, t, 22, P, { ratio: 0.28, kind: "lance", sway: 0.04 });
    fern(40 * S, H + 20 * S, 260 * S, -1.45, t, 23, P, { curl: 0.9 });
    if (spec.blFlowers !== false) { flower(150 * S, H - 120 * S, 16 * S, P.petals[1], P, 0.3); flower(96 * S, H - 190 * S, 13 * S, P.petals[0], P, 1.2); flower(210 * S, H - 60 * S, 14 * S, P.petals[3], P, 2); }
  }
  if (corners.includes("br")) {
    fern(W + 20 * S, H + 10 * S, 320 * S, -1.95, t, 25, P, { curl: -0.7, dir: 1 });
    leafFan(W + 30 * S, H + 30 * S, -2.25, 1.2, 6, 240 * S, t, 26, P, { ratio: 0.28, sway: 0.04 });
    if (spec.brFlowers !== false) { flower(W - 140 * S, H - 110 * S, 15 * S, P.petals[2], P, 0.8); flower(W - 80 * S, H - 170 * S, 12 * S, P.petals[0], P, 2.2); }
  }
  if (corners.includes("tl")) {
    leafFan(-20 * S, -20 * S, 0.75, 1.1, 6, 170 * S, t, 27, P, { ratio: 0.3, sway: 0.05 });
    flower(70 * S, 90 * S, 14 * S, P.petals[1], P, 0.5);
  }
  if (corners.includes("tr")) {
    leafFan(W + 20 * S, -20 * S, Math.PI - 0.75, 1.1, 6, 170 * S, t, 28, P, { ratio: 0.3, sway: 0.05 });
  }
}
