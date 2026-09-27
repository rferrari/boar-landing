// The ten thread clips. Loaded after world.js (the film's drawing code).
// Copy rules: only true things; roadmap items say so on screen; the medical scenes say "not a doctor".

const CREAM = BRAND.endText, SUN = BRAND.sun, ACC_I = "#f6c46a";
const INK = BRAND.ink, TERRA = "#9c4220", INK_MUTED = "#3d4636";

// ---------- the landing's cards (public/index.html), word for word ----------
const CARDS = {
  flight: { tag: "In flight", clock: "19:40", net: "air", accent: "#f6a96b",
    q: "The man next to me is choking and can’t speak. What do I do?",
    a: "Lean him forward and give up to five firm blows between the shoulder blades. If that fails, give up to five abdominal thrusts. Keep alternating, and call the crew.",
    src: ["Choking"] },
  peak: { tag: "Mountain hut", clock: "06:20", net: "none", accent: "#f2c14e",
    q: "My friend is shivering, clumsy and slurring words. Is it hypothermia?",
    a: "Those are classic signs. Get her out of the wind, swap wet clothes for dry layers, warm her core first, and give a warm sweet drink if she’s alert.",
    src: ["Hypothermia"] },
  garden: { tag: "In the garden", clock: "18:10", net: "none", accent: "#a6d16a",
    q: "Why plant corn, beans and squash together?",
    a: "They help each other. Corn gives the beans a pole to climb, beans add nitrogen to the soil, and squash leaves shade the ground and hold in moisture.",
    src: ["Companion planting"] },
  road: { tag: "Flooded road", clock: "20:05", net: "none", accent: "#ec9467",
    q: "Water is running across the road ahead. Can I drive through it?",
    a: "Don’t. Moving water can float a car even when it looks shallow, and the road underneath may be gone. Turn around and wait on higher ground.",
    src: ["Flash flood"] },
};

// ---------- type ----------
function sans(w, px) { ctx.font = `${w} ${px}px ${BRAND.font}`; ctx.fontStretch = "normal"; }
function serif(px, w = 560) { ctx.font = `italic ${w} ${px}px ${BRAND.serif}`; ctx.fontStretch = "normal"; }
// A headline: lines of [text, "s" | "i"] segments; "i" is the Fraunces italic accent.
function headline(lines, x, y, px, o = {}) {
  const align = o.align || "left", col = o.color || INK, accent = o.accent || TERRA, lh = px * (o.lh || 1.1);
  ctx.save(); ctx.textAlign = "left"; ctx.letterSpacing = `${-0.012 * px}px`;
  lines.forEach((segs, li) => {
    const setF = (st) => (st === "i" ? serif(px * 1.06) : sans(o.weight || 760, px));
    const widths = segs.map(([t, st]) => { setF(st); return ctx.measureText(t).width; });
    const tw = widths.reduce((a, b) => a + b, 0);
    let cx = align === "center" ? x - tw / 2 : x;
    segs.forEach(([t, st], k) => { setF(st); ctx.fillStyle = st === "i" ? accent : col; ctx.fillText(t, cx, y + li * lh); cx += widths[k]; });
  });
  ctx.restore();
}
function caps(text, x, y, px, col, o = {}) {
  ctx.save(); sans(o.weight || 700, px); ctx.letterSpacing = `${(o.ls ?? 0.12) * px}px`; ctx.fillStyle = col; ctx.textAlign = o.align || "left";
  if (o.shadow) { ctx.shadowColor = "rgba(0,0,0,0.5)"; ctx.shadowBlur = px * 0.5; }
  ctx.fillText(text, x, y); ctx.restore();
}
// the film's location tag: a filled pill with a dot
function pill(label, x, y, col, o = {}) {
  ctx.save();
  font(800, 27 * S, "semi-condensed"); ctx.letterSpacing = `${2.5 * S}px`;
  const tw = ctx.measureText(label.toUpperCase()).width, pw = tw + 64 * S, ph = 50 * S;
  const px = o.align === "center" ? x - pw / 2 : x;
  rr(px, y, pw, ph, ph / 2);
  if (o.outline) { ctx.strokeStyle = col; ctx.lineWidth = 2.5 * S; ctx.stroke(); ctx.fillStyle = rgba("#000000", 0.35); ctx.fill(); }
  else { ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.5 * S; ctx.stroke(); }
  const ink = o.outline ? col : (lum(col) > 0.35 ? "#0c0c12" : "#ffffff");
  ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(px + 24 * S, y + ph / 2, 6 * S, 0, TAU); ctx.fill();
  ctx.fillText(label.toUpperCase(), px + 40 * S, y + ph / 2 + 9.5 * S);
  ctx.restore();
  return pw;
}
// a band of daylight haze behind the headline: paper-toned, flat, so ink type reads on any sky
function hazeTop(h, a = 0.9) { ctx.fillStyle = vg(0, h, [[0, `rgba(250,246,236,${a})`], [0.55, `rgba(250,246,236,${a * 0.78})`], [1, "rgba(250,246,236,0)"]]); ctx.fillRect(0, 0, W, h); }
// a paper label with an ink edge, for the lines at the foot of a clip
function paperLabel(lines, x, y, px = 30, o = {}) {
  ctx.save(); sans(o.weight || 600, px * S);
  const lh = px * 1.36 * S, pad = 22 * S, w = Math.max(...lines.map((l) => ctx.measureText(l).width)) + pad * 2, h = lines.length * lh + pad * 1.35;
  const bx = o.align === "center" ? x - w / 2 : x - pad;
  rr(bx, y, w, h, 18 * S); ctx.fillStyle = o.fill || "rgba(255,250,238,0.96)"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.5 * S; ctx.stroke();
  ctx.fillStyle = o.color || INK; ctx.textAlign = o.align === "center" ? "center" : "left";
  lines.forEach((l, i) => ctx.fillText(l, o.align === "center" ? x : bx + pad, y + pad * 0.7 + lh * (i + 0.72)));
  ctx.restore();
  return { x: bx, y, w, h };
}

// the mascot badge from the film's end card
function badge(cx, cy, d, a = 1) {
  ctx.save(); ctx.globalAlpha *= a;
  ctx.beginPath(); ctx.arc(cx, cy, d / 2 + 5 * S, 0, TAU); ctx.fillStyle = INK; ctx.fill();
  ctx.beginPath(); ctx.arc(cx, cy, d / 2, 0, TAU); ctx.fillStyle = APP.header; ctx.fill();
  ctx.strokeStyle = SUN; ctx.lineWidth = 3 * S; ctx.stroke();
  if (ICON) { const s = d * 0.84, bb = [138, 198, 690, 606], k = s / 690; ctx.drawImage(ICON, bb[0], bb[1], bb[2], bb[3], cx - bb[2] * k / 2, cy - bb[3] * k / 2 + 4 * S, bb[2] * k, bb[3] * k); }
  ctx.restore();
}

// ---------- the phone ----------
function wifiIcon(x, y, s, col) {
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = s * 0.13; ctx.lineCap = "round";
  for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(x + s / 2, y + s * 0.95, s * (0.28 + i * 0.3), -Math.PI * 0.75, -Math.PI * 0.25); ctx.stroke(); }
  ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x + s / 2, y + s * 0.92, s * 0.09, 0, TAU); ctx.fill(); ctx.restore();
}
function netLabel(n) { return n === "air" ? "Airplane mode" : n === "wifi" ? "Wi-Fi" : "No Service"; }
// o: { acc, net, net2, roll (0..1 from net to net2), clock, VW, header, body(X, SW, top, bot), input: { text, typing, gen } }
function phone(x, y, w, h, o) {
  const acc = o.acc || SUN, r = 46 * S * (w / 640);
  ctx.save();
  ctx.shadowColor = "rgba(30,40,24,0.32)"; ctx.shadowBlur = 36 * S; ctx.shadowOffsetY = 18 * S;
  rr(x - 3 * S, y - 3 * S, w + 6 * S, h + 6 * S, r + 3 * S); ctx.fillStyle = INK; ctx.fill();
  ctx.shadowColor = "transparent";
  rr(x, y, w, h, r); ctx.fillStyle = "#0a0b0f"; ctx.fill();
  rr(x, y, w, h, r); ctx.strokeStyle = rgba(acc, 0.85); ctx.lineWidth = 2.5 * S; ctx.stroke();
  rr(x + 2.5 * S, y + 2.5 * S, w - 5 * S, h - 5 * S, r - 2.5 * S); ctx.strokeStyle = "rgba(255,255,255,0.10)"; ctx.lineWidth = 1.2 * S; ctx.stroke();
  const b = 10 * S, X = x + b, Y = y + b, SW = w - 2 * b, SH = h - 2 * b;
  ctx.save(); rr(X, Y, SW, SH, r - b); ctx.clip();
  U = SW / (o.VW || 380);
  const SB = u(40), HD = o.header === false ? 0 : u(72), IB = o.input === false ? 0 : u(84);
  ctx.fillStyle = APP.chat; ctx.fillRect(X, Y, SW, SH);
  ctx.fillStyle = APP.chatShade; ctx.beginPath(); ctx.arc(X + SW * 0.95, Y + SH * 0.95, u(230), 0, TAU); ctx.fill();
  ctx.fillStyle = "rgba(0,0,0,0.16)"; ctx.beginPath(); ctx.arc(X + SW * 0.9, Y - u(40), u(300), 0, TAU); ctx.fill();
  const top = Y + SB + HD, bot = Y + SH - IB;
  if (o.body) { ctx.save(); ctx.beginPath(); ctx.rect(X, top, SW, bot - top); ctx.clip(); o.body(X, SW, top, bot); ctx.restore(); }
  statusBar(X, Y, SW, SB, o);
  if (o.header !== false) appHeader(X, Y + SB, SW, HD, o.title);
  if (o.input !== false) inputBar(X, Y + SH - IB, SW, IB, o.input || {});
  rr(X + SW / 2 - u(55), Y + SH - u(12), u(110), u(4), u(2)); ctx.fillStyle = "rgba(235,240,238,0.75)"; ctx.fill();
  ctx.restore();
  ctx.restore();
}
function statusBar(X, Y, SW, SB, o) {
  ctx.fillStyle = APP.status; ctx.fillRect(X, Y, SW, SB);
  const sbY = Y + u(27);
  ctx.save(); ctx.beginPath(); ctx.rect(X, Y, SW, SB); ctx.clip();
  af(600, 16.5); ctx.fillStyle = "#ffffff"; ctx.fillText(o.clock || "12:00", X + u(22), sbY);
  const bx = X + SW - u(22) - u(30);
  rr(bx, sbY - u(12.5), u(26), u(14), u(5)); ctx.strokeStyle = "#ffffff"; ctx.lineWidth = u(1.4); ctx.stroke();
  rr(bx + u(2.5), sbY - u(10), u(15), u(9), u(3)); ctx.fillStyle = "#ffffff"; ctx.fill();
  ctx.fillRect(bx + u(27), sbY - u(8), u(2), u(5));
  const rh = u(26);
  const drawNet = (n, dy, a) => {
    ctx.globalAlpha = a; af(500, 14.5); ctx.fillStyle = "#ffffff";
    const lab = netLabel(n), lw = ctx.measureText(lab).width, gx = bx - u(10) - u(18);
    if (n === "air") airplaneIcon(gx, sbY - u(15) + dy, u(18), "#ffffff");
    else if (n === "wifi") wifiIcon(gx, sbY - u(15) + dy, u(17), "#ffffff");
    else noBars(gx + u(1), sbY - u(14) + dy, u(15), "#ffffff");
    ctx.fillText(lab, gx - u(8) - lw, sbY + dy); ctx.globalAlpha = 1;
  };
  const roll = o.net2 ? eIO(clamp(o.roll || 0)) : 0;
  if (o.net2 && roll > 0) { drawNet(o.net, -roll * rh, 1 - roll); drawNet(o.net2, (1 - roll) * rh, roll); }
  else drawNet(o.net || "none", 0, 1);
  ctx.restore();
}
function appHeader(X, hy, SW, HD, title) {
  ctx.fillStyle = APP.header; ctx.fillRect(X, hy, SW, HD);
  ctx.fillStyle = APP.headerRule; ctx.fillRect(X, hy + HD - u(1), SW, u(1));
  rr(X + u(14), hy + u(14), u(36), u(44), u(9)); ctx.fillStyle = APP.btn; ctx.fill();
  ctx.fillStyle = "#e8eaee"; for (let l = 0; l < 3; l++) { rr(X + u(23), hy + u(28) + l * u(7), u(18), u(2.2), u(1.1)); ctx.fill(); }
  rr(X + u(58), hy + u(15), u(42), u(42), u(10)); ctx.fillStyle = "#1a1d26"; ctx.fill();
  if (ICON) { const s = u(38) / 690; ctx.drawImage(ICON, 138, 198, 690, 606, X + u(60), hy + u(19), 690 * s, 606 * s); }
  af(500, 21); ctx.fillStyle = "#ffffff"; ctx.fillText(title || "BOAR", X + u(108), hy + u(33));
  const bw = ctx.measureText(title || "BOAR").width;
  af(700, 10.5, APP.mono); ctx.letterSpacing = `${u(1)}px`;
  const ow = ctx.measureText("OFFLINE").width + u(22), ox = X + u(108) + bw + u(9);
  rr(ox, hy + u(16), ow, u(20), u(5)); ctx.fillStyle = APP.pillBg; ctx.fill(); ctx.strokeStyle = APP.pillBorder; ctx.lineWidth = u(1.2); ctx.stroke();
  ctx.fillStyle = APP.pillText; ctx.beginPath(); ctx.arc(ox + u(8), hy + u(26), u(2.8), 0, TAU); ctx.fill();
  ctx.fillText("OFFLINE", ox + u(15), hy + u(30)); ctx.letterSpacing = "0px";
  af(400, 11.5, APP.mono); ctx.letterSpacing = `${u(1)}px`; ctx.fillStyle = APP.model; ctx.fillText("QWEN2.5-1.5B-INSTRUCT", X + u(108), hy + u(54)); ctx.letterSpacing = "0px";
  const px = X + SW - u(14) - u(46);
  rr(px, hy + u(14), u(46), u(44), u(10)); ctx.fillStyle = APP.plusBg; ctx.fill(); ctx.strokeStyle = APP.plusBorder; ctx.lineWidth = u(1.2); ctx.stroke();
  ctx.fillStyle = APP.plus; ctx.fillRect(px + u(16), hy + u(35), u(14), u(2.4)); ctx.fillRect(px + u(21.8), hy + u(29), u(2.4), u(14));
}
function inputBar(X, iy, SW, IB, inp) {
  ctx.fillStyle = APP.inputBar; ctx.fillRect(X, iy, SW, IB);
  ctx.fillStyle = "rgba(255,255,255,0.05)"; ctx.fillRect(X, iy, SW, u(1));
  const fw = SW - u(14) * 3 - u(48);
  rr(X + u(14), iy + u(10), fw, u(46), u(8)); ctx.fillStyle = APP.inputBg; ctx.fill(); ctx.strokeStyle = inp.typing ? APP.userBorder : APP.inputBorder; ctx.lineWidth = u(1.2); ctx.stroke();
  ctx.save(); ctx.beginPath(); ctx.rect(X + u(20), iy + u(10), fw - u(12), u(46)); ctx.clip();
  af(400, 16);
  if (inp.typing) {
    const s = inp.text || "", tw = ctx.measureText(s).width, tx = X + u(30) + Math.min(0, fw - u(40) - tw);
    ctx.fillStyle = APP.text; ctx.fillText(s, tx, iy + u(38)); ctx.fillStyle = APP.cursor; ctx.fillRect(tx + tw + u(2), iy + u(24), u(1.6), u(19));
  } else { ctx.fillStyle = APP.placeholder; ctx.fillText("Ask an offline research question…", X + u(30), iy + u(38)); }
  ctx.restore();
  const sx2 = X + SW - u(14) - u(48);
  rr(sx2, iy + u(10), u(48), u(46), u(8)); ctx.fillStyle = inp.gen ? APP.stop : APP.send; ctx.fill();
  if (inp.gen) { rr(sx2 + u(17), iy + u(26), u(14), u(14), u(2)); ctx.fillStyle = "#fde68a"; ctx.fill(); }
  else { ctx.fillStyle = APP.sendGlyph; ctx.beginPath(); ctx.moveTo(sx2 + u(16), iy + u(24)); ctx.lineTo(sx2 + u(34), iy + u(33)); ctx.lineTo(sx2 + u(16), iy + u(42)); ctx.lineTo(sx2 + u(20), iy + u(33)); ctx.closePath(); ctx.fill(); }
}

// One exchange, as the app lays it out (ported from scene.html's drawScreen).
// tm: { type0, type1, send, a0, a1 } in clip seconds. Returns the input-bar state.
function userBubble(X, SW, cy, text, pp = 1) {
  const M = u(14), maxW = (SW - 2 * M) * 0.92, pad = u(14);
  af(400, 18); const lines = wrapW(text, maxW - 2 * pad), lh = u(26);
  const qW = Math.min(maxW, Math.max(u(60), ...lines.map((l) => ctx.measureText(l.join(" ")).width)) + 2 * pad);
  const qH = pad + u(17) + lines.length * lh + pad - u(4);
  const qx = X + SW - M - qW;
  if (pp > 0) {
    ctx.save(); ctx.translate(qx + qW, cy + qH); ctx.scale(pp, pp); ctx.translate(-(qx + qW), -(cy + qH));
    ctx.beginPath(); ctx.roundRect(qx, cy, qW, qH, [u(12), u(12), u(4), u(12)]); ctx.fillStyle = APP.userBg; ctx.fill();
    ctx.strokeStyle = APP.userBorder; ctx.lineWidth = u(1.6); ctx.stroke();
    af(600, 11.5, APP.mono); ctx.letterSpacing = `${u(0.6)}px`; ctx.fillStyle = APP.you; ctx.fillText("YOU", qx + pad, cy + pad + u(11)); ctx.letterSpacing = "0px";
    af(400, 18); ctx.fillStyle = APP.text;
    lines.forEach((l, li) => ctx.fillText(l.join(" "), qx + pad, cy + pad + u(17) + lh * (li + 1) - u(7)));
    ctx.restore();
  }
  return qH;
}
// assistant bubble; p = words shown (0..1), srcP = sources reveal, skeleton = draw placeholder bars instead of text
function boarBubble(X, SW, cy, D, p, srcP, o = {}) {
  const M = u(14), aW = (SW - 2 * M) * 0.92, pad = u(14), alh = u(27);
  af(400, 18);
  const aLines = D.a ? wrapW(D.a, aW - 2 * pad) : [];
  const words = D.a ? D.a.split(" ").length : 0, nShow = Math.floor(p * words + 0.001);
  let k = 0, shown = 0; aLines.forEach((l) => { if (nShow > k) shown++; k += l.length; });
  if (o.skeleton) shown = o.skeleton;
  const done = p >= 1;
  const nSrc = (D.src || []).length, chipH = u(32), chipG = u(6);
  const srcBlock = nSrc ? u(6) + u(4) + u(26) + nSrc * (chipH + chipG) : 0;
  const streamingRows = !done ? u(22) : 0;
  const aH = pad + u(20) + Math.max(1, shown) * alh + streamingRows + srcBlock * srcP + u(36) + pad - u(4);
  const ax = X + M, ap = o.ap ?? 1;
  ctx.save(); ctx.globalAlpha *= ap; ctx.translate(0, (1 - ap) * u(10));
  ctx.beginPath(); ctx.roundRect(ax, cy, aW, aH, [u(12), u(12), u(12), u(4)]); ctx.fillStyle = APP.astBg; ctx.fill();
  ctx.strokeStyle = APP.astBorder; ctx.lineWidth = u(1.2); ctx.stroke();
  ctx.save(); ctx.beginPath(); ctx.rect(ax, cy, aW, aH); ctx.clip();
  let yy = cy + pad;
  af(400, 11, "Apple Color Emoji"); ctx.fillText("🐗", ax + pad, yy + u(11));
  af(600, 11.5, APP.mono); ctx.letterSpacing = `${u(0.6)}px`; ctx.fillStyle = APP.boar; ctx.fillText("BOAR", ax + pad + u(20), yy + u(11)); ctx.letterSpacing = "0px";
  yy += u(20);
  if (o.skeleton) {
    for (let li = 0; li < shown; li++) { const wl = (aW - 2 * pad) * (li === shown - 1 ? 0.55 : 0.92 - 0.08 * (li % 2)); rr(ax + pad, yy + alh * li + u(7), wl, u(12), u(6)); ctx.fillStyle = "rgba(247,255,252,0.16)"; ctx.fill(); }
  } else {
    af(400, 18); ctx.fillStyle = APP.text; let kk = 0;
    aLines.forEach((l, li) => { const s = l.slice(0, Math.max(0, nShow - kk)); kk += l.length; if (s.length) ctx.fillText(s.join(" "), ax + pad, yy + alh * (li + 1) - u(7)); });
  }
  yy += Math.max(1, shown) * alh;
  if (streamingRows) { rr(ax + pad, yy + u(2), u(8), u(18), u(2)); ctx.fillStyle = rgba(APP.cursor, 0.85); ctx.fill(); yy += streamingRows; }
  const ys = yy;
  if (srcP > 0 && nSrc) {
    ctx.save(); ctx.globalAlpha *= srcP;
    yy += u(6); ctx.fillStyle = APP.rule; ctx.fillRect(ax + pad, yy, aW - 2 * pad, u(1)); yy += u(4);
    af(400, 11, "Apple Color Emoji"); ctx.fillText("📚", ax + pad, yy + u(15));
    af(700, 11.5, APP.mono); ctx.letterSpacing = `${u(0.55)}px`; ctx.fillStyle = APP.srcTitle; ctx.fillText("OFFLINE VERIFIED SOURCES", ax + pad + u(18), yy + u(15)); ctx.letterSpacing = "0px";
    af(400, 11, APP.mono); const cn = String(nSrc), cw = ctx.measureText(cn).width + u(10);
    rr(ax + aW - pad - cw, yy + u(3), cw, u(16), u(4)); ctx.fillStyle = APP.countBg; ctx.fill(); ctx.fillStyle = APP.count; ctx.fillText(cn, ax + aW - pad - cw + u(5), yy + u(15));
    yy += u(26);
    D.src.forEach((s, j) => {
      const cx0 = ax + pad, cwid = aW - 2 * pad;
      // the chip lands with a small highlight so the eye finds it
      const hl = o.chipGlow ? o.chipGlow : 0;
      rr(cx0, yy, cwid, chipH, u(6)); ctx.fillStyle = APP.chipBg; ctx.fill(); ctx.strokeStyle = hl > 0 ? mix(APP.chipBorder, APP.srcTitle, hl) : APP.chipBorder; ctx.lineWidth = u(1 + hl); ctx.stroke();
      ctx.fillStyle = APP.idxBg; ctx.beginPath(); ctx.arc(cx0 + u(18), yy + chipH / 2, u(9), 0, TAU); ctx.fill();
      af(700, 10, APP.mono); ctx.fillStyle = APP.idx; ctx.textAlign = "center"; ctx.fillText(String(j + 1), cx0 + u(18), yy + chipH / 2 + u(3.5)); ctx.textAlign = "left";
      af(500, 14.5); ctx.fillStyle = APP.chipText; ctx.fillText(s, cx0 + u(34), yy + chipH / 2 + u(5));
      af(400, 9); ctx.fillStyle = APP.chev; ctx.fillText("▼", cx0 + cwid - u(20), yy + chipH / 2 + u(3.5));
      yy += chipH + chipG;
    });
    ctx.restore();
  }
  yy = ys + srcBlock * srcP;
  yy += u(6); ctx.fillStyle = "rgba(255,255,255,0.05)"; ctx.fillRect(ax + pad, yy, aW - 2 * pad, u(1)); yy += u(8);
  for (const [bx, g] of [[ax + pad, "▲"], [ax + pad + u(40), "▼"]]) { rr(bx, yy, u(32), u(22), u(4)); ctx.fillStyle = APP.footBtn; ctx.fill(); ctx.strokeStyle = APP.footBorder; ctx.lineWidth = u(1); ctx.stroke(); af(700, 9); ctx.fillStyle = APP.boar; ctx.textAlign = "center"; ctx.fillText(g, bx + u(16), yy + u(15)); ctx.textAlign = "left"; }
  ctx.restore(); ctx.restore();
  return aH;
}
function measureUser(SW, text) { const M = u(14), maxW = (SW - 2 * M) * 0.92, pad = u(14); af(400, 18); return pad + u(17) + wrapW(text, maxW - 2 * pad).length * u(26) + pad - u(4); }
function exchange(t, D, tm) {
  const typing = t >= tm.type0 && t < tm.send;
  const chars = Math.floor(clamp((t - tm.type0) / (tm.type1 - tm.type0)) * D.q.length);
  const p = clamp((t - tm.a0) / (tm.a1 - tm.a0)), srcP = eO(clamp((t - tm.a1 - 0.05) / 0.3));
  const input = { typing, text: D.q.slice(0, chars), gen: t >= tm.send && t < tm.a1 };
  const body = (X, SW, top, bot) => {
    if (t < tm.send) return;
    const qH = measureUser(SW, D.q), gap = u(12);
    // measure the answer at this state to auto-scroll (the question's last line stays on screen)
    const aH = t >= tm.send + 0.08 ? estimateA(SW, D, p, srcP) : 0;
    const contentH = u(12) + qH + (aH ? gap + aH : 0) + u(12);
    const scroll = clamp(contentH - (bot - top), 0, u(12) + qH - u(46));
    let cy = top + u(12) - scroll;
    userBubble(X, SW, cy, D.q, eBack(clamp((t - tm.send) / 0.18)));
    cy += qH + gap;
    if (aH) boarBubble(X, SW, cy, D, p, srcP, { ap: eO(clamp((t - tm.send - 0.08) / 0.16)), chipGlow: srcP > 0 ? clamp(1 - (t - tm.a1 - 0.35) / 1.2) : 0 });
  };
  return { input, body };
}
function estimateA(SW, D, p, srcP) {
  const M = u(14), aW = (SW - 2 * M) * 0.92, pad = u(14), alh = u(27);
  af(400, 18); const aLines = wrapW(D.a, aW - 2 * pad), words = D.a.split(" ").length, nShow = Math.floor(p * words + 0.001);
  let k = 0, shown = 0; aLines.forEach((l) => { if (nShow > k) shown++; k += l.length; });
  const nSrc = D.src.length, srcBlock = nSrc ? u(6) + u(4) + u(26) + nSrc * (u(32) + u(6)) : 0;
  return pad + u(20) + Math.max(1, shown) * alh + (p < 1 ? u(22) : 0) + srcBlock * srcP + u(36) + pad - u(4);
}

// ---------- the foliage frame every clip shares (render/nature.js) ----------
// Leaves hang in from the top-right corner, a climber runs up the left edge, ferns fill the
// bottom-left; the headline, the phone and the labels sit in the open middle, drawn on top.
const FRAME = {
  scene: { top: "right", vines: [[0.905, 250, 4], [0.955, 330, 8, { trail: "#c9b5f0" }], [0.99, 400, 12]], left: true, leftTop: 0.36, corners: ["bl", "br"], bottom: true, bottomFlowers: 7 },
  centre: { top: "both", reach: 0.8, reachL: 0.8, vines: [[0.04, 360, 5, { trail: "#c9b5f0" }], [0.1, 230, 9], [0.9, 250, 6], [0.965, 380, 14, { trail: "#f5a8bd" }]], corners: ["bl", "br"], bottom: true },
};
// ---------- scene clips (2, 3, 4, 6): one place, one continuous move, one exchange ----------
const PH = { x: 432 * S, y: 380 * S, w: 612 * S, h: 930 * S };
const TM = { type0: 0.2, type1: 1.45, send: 1.6, a0: 1.95, a1: 4.4 };
function sceneClip(t, drawPlace, D, head, foot, o = {}) {
  // world: the film's scene, with a slow push-in across the whole clip
  ctx.save();
  const z = 1 + 0.07 * eIO(clamp(t / T));
  ctx.translate(F.x, F.y); ctx.scale(z, z); ctx.translate(-F.x, -F.y);
  drawPlace(t + (o.lt0 || 0));
  ctx.restore();
  hazeTop(430 * S, 0.9);
  foliageFrame(t, o.frame || FRAME.scene);
  const ex = exchange(t, D, TM);
  phone(PH.x, PH.y, PH.w, PH.h, { acc: D.accent, net: D.net, clock: D.clock, body: ex.body, input: ex.input });
  pill(D.tag, 64 * S, 60 * S, D.accent);
  headline(head, 64 * S, 205 * S, 76 * S);
  if (foot) paperLabel(foot, 64 * S, (o.footY || 1062) * S, 28);
}

// ---------- the clips ----------
const CLIPS = {
  // 1 · opener: the pig, the question of the thread, the phone
  1: { poster: 4.2, draw(t) {
    drawEndSky(t, { hy: 0.9 });
    hazeTop(640 * S, 0.8);
    foliageFrame(t, FRAME.centre);
    const rise = eO(clamp(t / T));
    const qs = [CARDS.flight.q, CARDS.peak.q, CARDS.road.q, CARDS.garden.q];
    const at = [-1, 1.4, 2.9, 4.4];
    const px = 250 * S, pw = 580 * S, py = (640 - 40 * rise) * S;
    phone(px, py, pw, 1000 * S, { acc: SUN, net: "air", clock: "19:40", input: false, body: (X, SW, top, bot) => {
      let hs = []; let total = u(12);
      qs.forEach((q, i) => { if (t >= at[i]) { const h = measureUser(SW, q); hs.push(h); total += h + u(14); } });
      const view = Math.min(bot, H - 30 * S) - top - u(12);
      const scroll = Math.max(0, total - view);
      // ease the scroll so each new bubble pushes the stack up smoothly
      let cy = top + u(12) - scroll;
      qs.forEach((q, i) => { if (t < at[i]) return; const pp = i === 0 ? 1 : eBack(clamp((t - at[i]) / 0.2)); cy += userBubble(X, SW, cy, q, pp) + u(14); });
    } });
    badge(540 * S, 150 * S, 170 * S);
    headline([[["What do you need to know", "s"]], [["when there’s no signal?", "i"]]], 540 * S, 350 * S, 66 * S, { align: "center" });
    caps("OPEN SOURCE · ON YOUR PHONE · FOR ANDROID", 540 * S, 548 * S, 23 * S, INK_MUTED, { align: "center", ls: 0.14 });
  } },
  // 2 · on a flight, choking
  2: { poster: 5.4, draw(t) {
    sceneClip(t, (lt) => drawFlight(lt), CARDS.flight,
      [[["Someone’s choking.", "s"]], [["No one to call.", "i"]]],
      ["Airplane mode on.", "Not a doctor: it shows", "its source."]);
  } },
  // 3 · mountain hut, hypothermia
  3: { poster: 5.4, draw(t) {
    HIKER_X = 250 * S; sceneClip(t, (lt) => drawPeak(lt + 0.9), CARDS.peak,
      [[["Shivering, slurring.", "s"]], [["Is it hypothermia?", "i"]]],
      ["Check the source,", "don’t just trust it.", "Not a doctor."], { footY: 1150 });
  } },
  // 4 · flooded road
  4: { poster: 5.4, draw(t) {
    sceneClip(t, (lt) => drawRoad(lt), CARDS.road,
      [[["No bars, water ahead.", "s"]], [["Can I drive through?", "i"]]],
      ["The answer that matters", "shows up when the", "network doesn’t."]);
  } },
  // 5 · privacy: the question has nowhere to go
  5: { poster: 5.6, draw(t) { clip5(t); } },
  // 6 · the garden
  6: { poster: 5.4, draw(t) {
    sceneClip(t, (lt) => drawGarden(lt + 0.4), CARDS.garden,
      [[["Old knowledge,", "s"]], [["in your pocket.", "i"]]],
      ["No Wi-Fi in the garden.", "The answer, and", "where it came from."]);
  } },
  7: { poster: 7.2, draw(t) { clip7(t); } },
  8: { poster: 5.8, draw(t) { clip8(t); } },
  9: { poster: 6.2, draw(t) { clip9(t); } },
  10: { poster: 4.5, draw(t) { clip10(t); } },
};

// ---------- 5 · privacy ----------
function clip5(t) {
  // a moonlit night: cool ambient light, no halo; the frame is the same garden after dark
  drawEndSky(t, { night: true, hy: 0.9, moon: [0.86, 0.36], clouds: [[0.12, 0.1, 0.7], [0.62, 0.05, 0.6]] });
  foliageFrame(t, { ...FRAME.scene, night: true, vines: [[0.93, 200, 4], [0.975, 300, 8, { trail: "#a9b1dc" }]], leftTop: 0.28, corners: ["bl", "br"], bottom: true });
  const D = { q: "How do I talk to my kid about money?", a: "", src: [] };
  const tm = { type0: 0.15, type1: 1.2, send: 1.3 };
  const px = 150 * S, py = 400 * S, pw = 540 * S, ph = 800 * S;
  // the request tries to leave: out of the phone, up into the night, and back in (there is nowhere to send it)
  const L0 = 1.45, L1 = 3.35;
  const path = (s) => { // cubic loop from the phone's right edge and back
    const p0 = [px + pw, py + 250 * S], p1 = [px + pw + 420 * S, py - 20 * S], p2 = [px + pw + 420 * S, py + 560 * S], p3 = [px + pw, py + 420 * S];
    const a = 1 - s; const f = (i) => a * a * a * p0[i] + 3 * a * a * s * p1[i] + 3 * a * s * s * p2[i] + s * s * s * p3[i];
    return [f(0), f(1)];
  };
  const pl = clamp((t - L0) / (L1 - L0)), pe = eIO(pl);
  if (t > L0) {
    ctx.save();
    const fade = t > L1 ? clamp(1 - (t - L1) / 1.0) : 1;
    ctx.lineCap = "round"; ctx.setLineDash([1, 14 * S]); ctx.lineWidth = 7 * S;
    ctx.strokeStyle = rgba(SUN, 0.9 * fade);
    ctx.beginPath(); for (let k = 0; k <= 80; k++) { const s2 = (k / 80) * pe; const [x, y] = path(s2); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
    ctx.setLineDash([]);
    if (pl < 1) { const [x, y] = path(pe); ctx.beginPath(); ctx.arc(x, y, 15 * S, 0, TAU); ctx.fillStyle = "#fff4d6"; ctx.fill(); ctx.strokeStyle = "#08120f"; ctx.lineWidth = 3 * S; ctx.stroke(); }
    // the note at the far end of the loop
    const na = clamp((t - 2.0) / 0.4) * (t > 5.2 ? 1 : 1);
    ctx.save(); ctx.globalAlpha = na; serif(40 * S, 480); ctx.fillStyle = "rgba(255,248,234,0.92)"; ctx.textAlign = "center";
    ctx.fillText("nowhere", px + pw + 200 * S, py + 280 * S); ctx.fillText("to send it", px + pw + 200 * S, py + 326 * S); ctx.restore();
    ctx.restore();
  }
  // back inside, the phone answers on its own
  const A0 = 3.35;
  const ex = exchange(t, { ...D, a: "x" }, { ...tm, a0: 99, a1: A0 + 1.8 });
  phone(px, py, pw, ph, { acc: SUN, net: "air", clock: "22:14", VW: 360, input: ex.input, body: (X, SW, top, bot) => {
    if (t < tm.send) return;
    let cy = top + u(12);
    cy += userBubble(X, SW, cy, D.q, eBack(clamp((t - tm.send) / 0.18))) + u(12);
    if (t >= A0) { const rows = Math.min(5, 1 + Math.floor((t - A0) / 0.35)); boarBubble(X, SW, cy, { a: "", src: [] }, t > A0 + 1.8 ? 1 : 0.5, 0, { skeleton: rows, ap: eO(clamp((t - A0) / 0.2)) }); }
  } });
  // a soft pulse on the phone when the loop lands back in it
  const pulse = clamp(1 - Math.abs(t - L1) / 0.35);
  if (pulse > 0) { rr(px, py, pw, ph, 46 * S * pw / 640); ctx.strokeStyle = rgba(SUN, pulse); ctx.lineWidth = 6 * S; ctx.stroke(); }
  headline([[["Nothing leaves", "s"]], [["the phone.", "i"]]], 540 * S, 170 * S, 92 * S, { align: "center", color: CREAM, accent: ACC_I });
  // the two lines at the foot sit on a band of night so the grass never runs through them
  ctx.fillStyle = "rgba(9,20,26,0.9)"; rr(90 * S, 1222 * S, 900 * S, 110 * S, 22 * S); ctx.fill(); ctx.strokeStyle = "#08120f"; ctx.lineWidth = 2.5 * S; ctx.stroke();
  caps("NO ACCOUNT  ·  NO API  ·  NO GOOGLE PLAY SERVICES", 540 * S, 1266 * S, 25 * S, "rgba(255,248,234,0.92)", { align: "center", ls: 0.1 });
  ctx.save(); sans(500, 25 * S); ctx.fillStyle = "rgba(255,248,234,0.72)"; ctx.textAlign = "center"; ctx.fillText("Nobody logs it, because nothing is sent.", 540 * S, 1308 * S); ctx.restore();
}

// ---------- 7 · your own documents ----------
const FILES = [
  { name: "garden-log", ext: ".md", col: "#8cc063" },
  { name: "seed-inventory", ext: ".csv", col: "#f2b13e" },
  { name: "recipes", ext: ".txt", col: "#7cc3da" },
  { name: "contacts", ext: ".json", col: "#ec9467" },
];
function docCard(x, y, w, f, a = 1, rot = 0) {
  const h = w * 1.28;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot);
  ctx.shadowColor = "rgba(60,40,10,0.28)"; ctx.shadowBlur = 24 * S; ctx.shadowOffsetY = 10 * S;
  const c = w * 0.22;
  ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(w / 2 - c, -h / 2); ctx.lineTo(w / 2, -h / 2 + c); ctx.lineTo(w / 2, h / 2); ctx.lineTo(-w / 2, h / 2); ctx.closePath();
  ctx.fillStyle = "#fffbf2"; ctx.fill(); ctx.shadowColor = "transparent";
  ctx.strokeStyle = "rgba(29,36,25,0.18)"; ctx.lineWidth = 1.5 * S; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(w / 2 - c, -h / 2); ctx.lineTo(w / 2 - c, -h / 2 + c); ctx.lineTo(w / 2, -h / 2 + c); ctx.fillStyle = "#e9dfca"; ctx.fill();
  for (let i = 0; i < 4; i++) { ctx.fillStyle = "rgba(29,36,25,0.12)"; ctx.fillRect(-w / 2 + w * 0.14, -h / 2 + h * (0.3 + i * 0.1), w * (i === 3 ? 0.4 : 0.66), h * 0.035); }
  rr(-w / 2 + w * 0.12, h / 2 - h * 0.3, w * 0.76, h * 0.2, h * 0.05); ctx.fillStyle = f.col; ctx.fill();
  sans(800, w * 0.2); ctx.fillStyle = "#1d2419"; ctx.textAlign = "center"; ctx.fillText(f.ext, 0, h / 2 - h * 0.155);
  ctx.restore();
}
function clip7(t) {
  // warm paper, the landing's light theme
  ctx.fillStyle = BRAND.paper; ctx.fillRect(0, 0, W, H);
  foliageFrame(t, { top: "right", reach: 0.55, vines: [[0.955, 250, 8, { trail: "#c9b5f0" }], [0.99, 400, 12]], left: true, leftTop: 0.66, corners: ["bl", "br"], bottom: true });
  // phone: the collection first, then the chat
  const px = 432 * S, py = 380 * S, pw = 612 * S, ph = 930 * S;
  const SWITCH = 3.5;
  const DQ = { q: "How many packets of bean seeds do I have left?", a: "Your seed inventory lists three packets of bean seeds, saved from last year’s harvest.", src: ["seed-inventory"] };
  const tm = { type0: SWITCH + 0.15, type1: SWITCH + 1.1, send: SWITCH + 1.2, a0: SWITCH + 1.4, a1: SWITCH + 2.6 };
  const land = (i) => 0.35 + i * 0.55 + 0.7;   // when file i lands in the collection
  const ex = exchange(t, DQ, tm);
  const kbA = clamp((SWITCH + 0.1 - t) / 0.25);
  phone(px, py, pw, ph, { acc: "#9ccf7a", net: "air", clock: "09:12", input: t >= SWITCH ? ex.input : {}, title: t < SWITCH ? "Knowledge" : "BOAR", body: (X, SW, top, bot) => {
    if (kbA > 0) {
      ctx.save(); ctx.globalAlpha *= kbA;
      let y = top + u(18);
      af(700, 11.5, APP.mono); ctx.letterSpacing = `${u(0.8)}px`; ctx.fillStyle = APP.srcTitle; ctx.fillText("📄 PERSONAL DOCUMENTS", X + u(16), y + u(12)); ctx.letterSpacing = "0px";
      y += u(28);
      af(400, 13); ctx.fillStyle = "rgba(247,255,252,0.62)";
      wrapW("Indexed on this device only, never uploaded anywhere.", SW - u(32)).forEach((l, i) => ctx.fillText(l.join(" "), X + u(16), y + u(14) + i * u(19)));
      y += u(52);
      const n = FILES.filter((f, i) => t >= land(i)).length;
      rr(X + u(14), y, SW - u(28), u(88 + 44 * n), u(10)); ctx.fillStyle = "#0e1a16"; ctx.fill(); ctx.strokeStyle = "#1f3a2c"; ctx.lineWidth = u(1.2); ctx.stroke();
      af(600, 17); ctx.fillStyle = APP.text; ctx.fillText("My notes", X + u(30), y + u(32));
      af(400, 12.5, APP.mono); ctx.fillStyle = APP.pillText; ctx.fillText(n ? `${n} doc${n === 1 ? "" : "s"}` : "No documents yet", X + u(30), y + u(56));
      // toggle, on
      rr(X + SW - u(74), y + u(18), u(44), u(24), u(12)); ctx.fillStyle = "#1f7a4a"; ctx.fill(); ctx.fillStyle = "#e8fff2"; ctx.beginPath(); ctx.arc(X + SW - u(42), y + u(30), u(9), 0, TAU); ctx.fill();
      FILES.forEach((f, i) => {
        const lt = t - land(i); if (lt < 0) return;
        const a = eO(clamp(lt / 0.25)), ry = y + u(76) + i * u(44);
        ctx.save(); ctx.globalAlpha *= a; ctx.translate(0, (1 - a) * -u(12));
        rr(X + u(28), ry, SW - u(56), u(36), u(6)); ctx.fillStyle = APP.chipBg; ctx.fill(); ctx.strokeStyle = APP.chipBorder; ctx.lineWidth = u(1); ctx.stroke();
        rr(X + u(38), ry + u(9), u(36), u(18), u(4)); ctx.fillStyle = f.col; ctx.fill();
        af(700, 10, APP.mono); ctx.fillStyle = "#0c0c12"; ctx.textAlign = "center"; ctx.fillText(f.ext, X + u(56), ry + u(22)); ctx.textAlign = "left";
        af(500, 14.5); ctx.fillStyle = APP.chipText; ctx.fillText(f.name + f.ext, X + u(84), ry + u(23));
        af(400, 11, APP.mono); ctx.fillStyle = APP.pillText; ctx.textAlign = "right"; ctx.fillText(lt < 0.5 ? "indexing…" : "✓", X + SW - u(40), ry + u(23)); ctx.textAlign = "left";
        ctx.restore();
      });
      ctx.restore();
    }
    if (t >= SWITCH) { ctx.save(); ctx.globalAlpha *= clamp((t - SWITCH) / 0.25); ex.body(X, SW, top, bot); ctx.restore(); }
  } });
  // files fly from the left column into the phone
  FILES.forEach((f, i) => {
    const t0 = 0.35 + i * 0.55, tl = land(i), p = clamp((t - t0) / (tl - t0));
    const sx = 130 * S, sy = (560 + i * 160) * S, ex2 = (px + pw / 2), ey = py + 560 * S;
    if (p >= 1) return;
    const e = eIO(p), x = lerp(sx, ex2, e), y = lerp(sy, ey, e) - Math.sin(e * Math.PI) * 120 * S;
    const w = lerp(130, 60, e) * S, rot = lerp((i % 2 ? 0.08 : -0.07), 0.3, e);
    docCard(x, y, w, f, 1 - clamp((p - 0.85) / 0.15), rot);
    if (p === 0) { sans(600, 25 * S); ctx.fillStyle = "#474c3d"; ctx.fillText(f.name, sx + 80 * S, sy + 10 * S); }
  });
  headline([[["Your own documents,", "s"]], [["on your phone.", "i"]]], 64 * S, 150 * S, 74 * S, { color: BRAND.ink, accent: "#9c4220", shadow: false });
  caps(".TXT · .MD · .CSV · .JSON", 64 * S, 318 * S, 26 * S, "#3d7340", { ls: 0.1, weight: 800 });
  const la = clamp((t - SWITCH - 0.3) / 0.4);
  ctx.save(); ctx.globalAlpha = la; paperLabel(["A knowledge base", "only you can read."], 64 * S, 1062 * S, 28); ctx.restore();
}

// ---------- 8 · place packs (roadmap) ----------
// a city by day: pale facades, rooftop gardens and solar panels, ink outlined
function skyline(t, baseY, seed, sc, pf, P, cols) {
  const R = rng(seed); let x = -200 * S + (-t * 14 * pf) * S;
  const bs = [];
  while (x < W + 200 * S) { const w = (70 + R() * 90) * S * sc, h = (120 + R() * 340) * S * sc; bs.push([x, w, h, R(), R()]); x += w + 10 * S; }
  for (const [bx, w, h, r, r2] of bs) {
    const top = baseY - h;
    ctx.fillStyle = cols[Math.floor(r * cols.length)]; ctx.fillRect(bx, top, w, h + 400 * S);
    ctx.save(); ctx.beginPath(); ctx.rect(bx, top, w, h + 400 * S); ctx.clip(); ctx.fillStyle = "rgba(40,50,40,0.12)"; ctx.fillRect(bx + w * 0.62, top, w, h + 400 * S); ctx.restore();
    ctx.strokeStyle = P.ink; ctx.lineWidth = lwS(2.2); ctx.strokeRect(bx, top, w, h + 400 * S);
    for (let yy = top + 18 * S; yy < baseY - 14 * S; yy += 30 * S * sc) for (let xx = bx + 12 * S; xx < bx + w - 18 * S; xx += 24 * S * sc) { ctx.fillStyle = "#9cc6e2"; ctx.fillRect(xx, yy, 11 * S * sc, 15 * S * sc); ctx.strokeStyle = rgba(P.ink, 0.55); ctx.lineWidth = lwS(1.2); ctx.strokeRect(xx, yy, 11 * S * sc, 15 * S * sc); }
    if (r2 > 0.5) { // solar panels on the roof
      ctx.save(); ctx.translate(bx + w * 0.15, top); ctx.transform(1, 0, -0.35, 1, 0, 0);
      const pw = w * 0.55, ph2 = 16 * S * sc; ctx.fillStyle = "#3d6fb8"; ctx.fillRect(0, -ph2, pw, ph2); ctx.strokeStyle = P.ink; ctx.lineWidth = lwS(1.6); ctx.strokeRect(0, -ph2, pw, ph2);
      ctx.strokeStyle = "rgba(200,225,255,0.7)"; ctx.lineWidth = lwS(1); for (let q = 1; q < 4; q++) { ctx.beginPath(); ctx.moveTo(pw * q / 4, -ph2); ctx.lineTo(pw * q / 4, 0); ctx.stroke(); }
      ctx.restore();
    } else { // a roof garden spilling over the edge
      for (let q = 0; q < 3; q++) inkCanopy(bx + w * (0.22 + q * 0.28), top - 8 * S * sc, 16 * S * sc, P, P.l2, P.l3, 1.8);
      hangingVine(bx + w * 0.8, top, 60 * S * sc + r * 60 * S, t, Math.floor(r * 999), P, { size: 18 * sc, amp: 6, stemW: 2 });
    }
  }
}
function clip8(t) {
  const P = PAL.day;
  drawEndSky(t, { hy: 0.62, clouds: [[0.2, 0.08, 0.8], [0.78, 0.14, 0.7], [0.5, 0.26, 0.5]] });
  skyline(t, 1080 * S, 5, 1.0, 1, P, ["#e9dcc6", "#d8e2e0", "#efd3bf", "#dfe8d0"]);
  for (let i = 0; i < 9; i++) tree((i * 0.13 + 0.02) * W - t * 20 * S, 1110 * S, (110 + (i % 3) * 30) * S, P, 60 + i);
  skyline(t, 1240 * S, 9, 1.3, 2.2, P, ["#d7c6a8", "#c3d0cf", "#e2bfa6", "#cad8b8"]);
  hazeTop(440 * S, 0.9);
  foliageFrame(t, { ...FRAME.scene, leftTop: 0.5 });
  const DL0 = 0.3, DL1 = 3.0, OFF = 3.5;
  const prog = eIO(clamp((t - DL0) / (DL1 - DL0)));
  const px = 432 * S, py = 380 * S, pw = 612 * S, ph = 930 * S;
  phone(px, py, pw, ph, { acc: "#f6a96b", net: "wifi", net2: "none", roll: (t - OFF) / 0.35, clock: t < OFF ? "07:30" : "22:40", input: false, title: "Packs", body: (X, SW, top, bot) => {
    let y = top + u(18);
    af(700, 11.5, APP.mono); ctx.letterSpacing = `${u(0.8)}px`; ctx.fillStyle = "#f6c46a"; ctx.fillText("ROADMAP PREVIEW", X + u(16), y + u(12)); ctx.letterSpacing = "0px";
    y += u(30);
    rr(X + u(14), y, SW - u(28), u(300), u(12)); ctx.fillStyle = "#0e1a16"; ctx.fill(); ctx.strokeStyle = t > DL1 ? "#3f7a55" : "#1f3a2c"; ctx.lineWidth = u(1.4); ctx.stroke();
    af(400, 26, "Apple Color Emoji"); ctx.fillText("🏙️", X + u(30), y + u(44));
    af(600, 19); ctx.fillStyle = APP.text; ctx.fillText("City pack", X + u(72), y + u(32));
    af(400, 12.5, APP.mono); ctx.fillStyle = APP.pillText; ctx.fillText(t < DL1 ? "Downloading…" : "Ready offline ✓", X + u(72), y + u(52));
    // progress
    rr(X + u(30), y + u(72), SW - u(60), u(8), u(4)); ctx.fillStyle = "rgba(255,255,255,0.08)"; ctx.fill();
    rr(X + u(30), y + u(72), (SW - u(60)) * prog, u(8), u(4)); ctx.fillStyle = "#74f08e"; ctx.fill();
    [["🍽️", "Where to eat"], ["🚌", "How to get around"], ["🆘", "What to do in an emergency"]].forEach(([em, lab], i) => {
      const ry = y + u(100) + i * u(62), ok = prog >= (i + 1) / 3 - 0.001;
      rr(X + u(28), ry, SW - u(56), u(50), u(8)); ctx.fillStyle = APP.chipBg; ctx.fill(); ctx.strokeStyle = APP.chipBorder; ctx.lineWidth = u(1); ctx.stroke();
      af(400, 18, "Apple Color Emoji"); ctx.fillText(em, X + u(40), ry + u(32));
      af(500, 15); ctx.fillStyle = APP.chipText; ctx.fillText(lab, X + u(74), ry + u(31));
      af(700, 14, APP.mono); ctx.fillStyle = ok ? "#74f08e" : "rgba(255,255,255,0.25)"; ctx.textAlign = "right"; ctx.fillText(ok ? "✓" : "…", X + SW - u(44), ry + u(31)); ctx.textAlign = "left";
    });
    y += u(320);
    // after going offline: no roaming, still there
    const oa = eO(clamp((t - OFF - 0.3) / 0.4));
    if (oa > 0) {
      ctx.save(); ctx.globalAlpha *= oa; ctx.translate(0, (1 - oa) * u(12));
      rr(X + u(14), y, SW - u(28), u(92), u(12)); ctx.fillStyle = "#112f1a"; ctx.fill(); ctx.strokeStyle = APP.userBorder; ctx.lineWidth = u(1.4); ctx.stroke();
      af(600, 12, APP.mono); ctx.letterSpacing = `${u(0.8)}px`; ctx.fillStyle = APP.you; ctx.fillText("NO SERVICE · ROAMING OFF", X + u(30), y + u(30)); ctx.letterSpacing = "0px";
      af(500, 16.5); ctx.fillStyle = APP.text; ctx.fillText("Everything in the pack, offline.", X + u(30), y + u(62));
      ctx.restore();
    }
  } });
  pill("Next on the roadmap", 64 * S, 60 * S, "#f2b13e");
  headline([[["Download a city", "s"]], [["before the trip.", "i"]]], 64 * S, 205 * S, 76 * S);
  const la = eO(clamp((t - OFF - 0.2) / 0.5));
  ctx.save(); ctx.globalAlpha = la; ctx.translate(0, (1 - la) * 14 * S);
  ctx.fillStyle = "rgba(255,250,238,0.96)"; rr(42 * S, 1062 * S, 330 * S, 132 * S, 18 * S); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.5 * S; ctx.stroke();
  headline([[["Use it with", "s"]], [["no roaming.", "i"]]], 64 * S, 1116 * S, 44 * S);
  ctx.restore();
}

// ---------- 9 · community packs (roadmap) ----------
const PACKS = [["🩹", "First aid", "#ec9467"], ["🌊", "Disaster response", "#7cc3da"], ["🌱", "Growing food", "#8cc063"], ["🗺️", "Local guides", "#f2b13e"]];
function packTile(x, y, w, h, p, a = 1, s = 1, dashed = false) {
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  if (!dashed) { ctx.shadowColor = "rgba(0,0,0,0.45)"; ctx.shadowBlur = 20 * S; ctx.shadowOffsetY = 8 * S; }
  rr(-w / 2, -h / 2, w, h, h * 0.28); ctx.fillStyle = dashed ? "rgba(14,26,22,0.82)" : "#0e1a16"; ctx.fill(); ctx.shadowColor = "transparent";
  if (dashed) ctx.setLineDash([8 * S, 7 * S]);
  ctx.strokeStyle = p[2]; ctx.lineWidth = 2.5 * S; ctx.stroke(); ctx.setLineDash([]);
  let tx = -w / 2 + h * 0.3;
  if (p[0]) { ctx.font = `${h * 0.42}px "Apple Color Emoji"`; ctx.textAlign = "left"; ctx.fillText(p[0], tx, h * 0.15); tx += h * 0.62; }
  sans(700, h * 0.33); ctx.fillStyle = dashed ? p[2] : CREAM; ctx.textAlign = "left"; ctx.fillText(p[1], tx, h * 0.12);
  ctx.restore();
}
function miniPhone(x, y, w, acc, glow, rows = []) {
  const h = w * 1.9;
  ctx.save();
  ctx.shadowColor = "rgba(30,40,24,0.3)"; ctx.shadowBlur = 22 * S; ctx.shadowOffsetY = 10 * S;
  rr(x - w / 2 - 3 * S, y - h / 2 - 3 * S, w + 6 * S, h + 6 * S, w * 0.14 + 3 * S); ctx.fillStyle = INK; ctx.fill(); ctx.shadowColor = "transparent";
  rr(x - w / 2, y - h / 2, w, h, w * 0.14); ctx.fillStyle = "#0a0b0f"; ctx.fill();
  ctx.strokeStyle = rgba(acc, 0.85 + 0.15 * glow); ctx.lineWidth = (2 + 3 * glow) * S; ctx.stroke();
  rr(x - w / 2 + 6 * S, y - h / 2 + 6 * S, w - 12 * S, h - 12 * S, w * 0.11); ctx.fillStyle = APP.chat; ctx.fill();
  ctx.fillStyle = APP.header; ctx.fillRect(x - w / 2 + 6 * S, y - h / 2 + 20 * S, w - 12 * S, w * 0.22);
  if (ICON) { const s = w * 0.16 / 690; ctx.drawImage(ICON, 138, 198, 690, 606, x - w / 2 + 14 * S, y - h / 2 + 24 * S, 690 * s, 606 * s); }
  for (let i = 0; i < 4; i++) {
    const ry = y - h / 2 + w * 0.45 + i * w * 0.24, rw = w - 32 * S, rh = w * 0.17, r = rows[i];
    rr(x - w / 2 + 16 * S, ry, rw, rh, 6 * S); ctx.fillStyle = r ? rgba(r.p[2], 0.2 * r.a) : "rgba(116,240,142,0.08)"; ctx.fill();
    if (r) { ctx.strokeStyle = rgba(r.p[2], 0.8 * r.a); ctx.lineWidth = 1.5 * S; ctx.stroke(); ctx.globalAlpha = r.a; ctx.font = `${rh * 0.6}px "Apple Color Emoji"`; ctx.fillText(r.p[0], x - w / 2 + 24 * S, ry + rh * 0.72); ctx.globalAlpha = 1; }
  }
  ctx.restore();
}
function clip9(t) {
  // the garden from the film, out of focus, as the place where packs get written
  ctx.save(); ctx.filter = `blur(${9 * S}px) saturate(1.05)`; drawGarden(3 + t * 0.4); ctx.restore();
  ctx.filter = "none";
  ctx.fillStyle = "rgba(250,246,236,0.35)"; ctx.fillRect(0, 0, W, H);
  hazeTop(430 * S, 0.9);
  foliageFrame(t, { ...FRAME.centre, vines: [[0.9, 230, 6], [0.965, 330, 14, { trail: "#f5a8bd" }]], top: "right", corners: ["bl", "br"], bottom: false });
  // three phones; packs travel between them
  const P = [[210, 640], [540, 690], [870, 640]].map(([x, y]) => [x * S, y * S]);
  const accs = ["#ec9467", "#8cc063", "#7cc3da"];
  const hops = [[0, 1, -0.4], [1, 2, 0.7], [2, 0, 1.8], [0, 2, 2.9], [1, 0, 4.0], [2, 1, 5.1]];
  P.forEach(([x, y], i) => {
    let glow = 0; for (const [a, b, t0] of hops) { if (b === i) glow = Math.max(glow, clamp(1 - Math.abs(t - (t0 + 0.8)) / 0.4)); }
    const rows = [{ p: PACKS[i], a: 1 }];
    hops.forEach(([a, b, t0], k) => { if (b === i && t >= t0 + 0.8) rows.push({ p: PACKS[k % 4], a: eO(clamp((t - t0 - 0.8) / 0.3)) }); });
    miniPhone(x, y, 190 * S, accs[i], glow, rows);
  });
  hops.forEach(([a, b, t0], k) => {
    const p = clamp((t - t0) / 0.8); if (p <= 0 || p >= 1) return;
    const e = eIO(p), x = lerp(P[a][0], P[b][0], e), y = lerp(P[a][1], P[b][1], e) - Math.sin(e * Math.PI) * 170 * S;
    packTile(x, y - 40 * S, 380 * S, 84 * S, PACKS[k % 4], clamp(Math.min(p, 1 - p) * 8), 0.85 + 0.15 * Math.sin(e * Math.PI));
  });
  // the library grows: each pack that has been passed on lands on the shelf, then one slot waits for yours
  const shelfY = 930 * S, cw = (W - 128 * S - 20 * S) / 2, chh = 70 * S;
  { ctx.save(); sans(700, 22 * S); ctx.letterSpacing = `${0.16 * 22 * S}px`; const lw = ctx.measureText("A GROWING LIBRARY").width; ctx.restore();
    ctx.fillStyle = "rgba(255,250,238,0.96)"; rr(48 * S, shelfY - 44 * S, lw + 34 * S, 44 * S, 12 * S); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2 * S; ctx.stroke(); }
  caps("A GROWING LIBRARY", 64 * S, shelfY - 14 * S, 22 * S, INK, { ls: 0.16 });
  const slots = [...PACKS.map((p, k) => ({ p, t0: k === 0 ? -1 : hops[k][2] + 0.8 })), { p: ["", "+ Your pack", SUN], t0: 4.6, dashed: true }];
  slots.forEach((L, k) => {
    const a = L.t0 < 0 ? 1 : eO(clamp((t - L.t0) / 0.35)); if (a <= 0) return;
    const col = k % 2, row = Math.floor(k / 2), x = 64 * S + cw / 2 + col * (cw + 20 * S), y = shelfY + 30 * S + chh / 2 + row * (chh + 14 * S);
    packTile(x, y + (1 - a) * -24 * S, cw, chh, L.p, a, 1, L.dashed);
  });
  pill("On the roadmap", 64 * S, 60 * S, "#8cc063");
  headline([[["Packs people", "s"]], [["build and share.", "i"]]], 64 * S, 205 * S, 80 * S);
  paperLabel(["Written by a community, not by us.", "Open source · MIT"], 64 * S, 1218 * S, 28);
}

// ---------- 10 · try it in airplane mode ----------
function qsTile(x, y, w, h, icon, label, sub, on, dim) {
  ctx.save();
  rr(x, y, w, h, h / 2);
  ctx.fillStyle = on > 0 ? mix("#1f2a26", SUN, on) : "#1f2a26"; ctx.fill();
  ctx.globalAlpha = dim ? 0.45 : 1;
  const ink = on > 0.5 ? "#1d2419" : CREAM;
  icon(x + h * 0.55, y + h / 2, h * 0.42, ink);
  sans(700, h * 0.24); ctx.fillStyle = ink; ctx.fillText(label, x + h * 1.05, y + h * 0.47);
  sans(500, h * 0.19); ctx.fillStyle = on > 0.5 ? "rgba(29,36,25,0.75)" : "rgba(255,248,234,0.6)"; ctx.fillText(sub, x + h * 1.05, y + h * 0.75);
  ctx.restore();
}
function clip10(t) {
  drawEndSky(t, { hy: 0.9 });
  hazeTop(480 * S, 0.8);
  foliageFrame(t, { ...FRAME.centre, vines: [[0.04, 300, 5, { trail: "#c9b5f0" }], [0.1, 200, 9], [0.975, 240, 14, { trail: "#f5a8bd" }]] });
  const ON = 1.0, on = eIO(clamp((t - ON) / 0.3));
  // the phone: Android quick settings, airplane mode goes on
  const px = 250 * S, py = 540 * S, pw = 580 * S, ph = 600 * S;
  phone(px, py, pw, ph, { acc: SUN, net: "wifi", net2: "air", roll: (t - ON) / 0.35, clock: "08:00", header: false, input: false, VW: 380, body: (X, SW, top, bot) => {
    ctx.fillStyle = "#101614"; ctx.fillRect(X, top, SW, bot - top);
    const g = 16 * S, tw = (SW - 3 * g) / 2, th = 110 * S;
    const air = (cx, cy, s, c) => airplaneIcon(cx - s / 2, cy - s / 2, s, c);
    const wf = (cx, cy, s, c) => wifiIcon(cx - s / 2, cy - s / 2, s, c);
    const md = (cx, cy, s, c) => { for (let i = 0; i < 4; i++) { const hh = s * (0.3 + i * 0.22); rr(cx - s / 2 + i * s * 0.27, cy + s / 2 - hh, s * 0.18, hh, 2 * S); ctx.fillStyle = c; ctx.fill(); } };
    qsTile(X + g, top + g * 1.5, tw, th, wf, "Wi-Fi", on > 0.5 ? "Off" : "Home", 0, on > 0.5);
    qsTile(X + 2 * g + tw, top + g * 1.5, tw, th, md, "Mobile data", on > 0.5 ? "Off" : "On", 0, on > 0.5);
    const ay = top + g * 2.5 + th;
    const pr = 1 + 0.04 * Math.sin(clamp((t - ON + 0.15) / 0.4) * Math.PI);
    ctx.save(); ctx.translate(X + SW / 2, ay + th * 0.6); ctx.scale(pr, pr); ctx.translate(-(X + SW / 2), -(ay + th * 0.6));
    qsTile(X + g, ay, SW - 2 * g, th * 1.2, air, "Airplane mode", on > 0.5 ? "On" : "Off", on, false);
    ctx.restore();
    // a finger tap
    const tap = clamp(1 - Math.abs(t - ON + 0.05) / 0.25);
    if (tap > 0) { ctx.fillStyle = `rgba(255,255,255,${0.35 * tap})`; ctx.beginPath(); ctx.arc(X + SW * 0.7, ay + th * 0.6, (30 + 40 * (1 - tap)) * S, 0, TAU); ctx.fill(); }
    // then BOAR, still answering
    const ba = eO(clamp((t - ON - 0.7) / 0.4));
    if (ba > 0) {
      ctx.save(); ctx.globalAlpha *= ba; const y = ay + th * 1.2 + g * 1.6;
      rr(X + g, y, SW - 2 * g, 110 * S, 24 * S); ctx.fillStyle = APP.header; ctx.fill(); ctx.strokeStyle = APP.pillBorder; ctx.lineWidth = 2 * S; ctx.stroke();
      if (ICON) { const s = 66 * S / 690; ctx.drawImage(ICON, 138, 198, 690, 606, X + g + 22 * S, y + 24 * S, 690 * s, 606 * s); }
      sans(700, 30 * S); ctx.fillStyle = CREAM; ctx.fillText("BOAR", X + g + 104 * S, y + 50 * S);
      ctx.font = `600 ${20 * S}px "Noto Sans Mono"`; ctx.letterSpacing = `${2 * S}px`; ctx.fillStyle = APP.pillText; ctx.fillText("● OFFLINE · READY", X + g + 104 * S, y + 84 * S); ctx.letterSpacing = "0px";
      ctx.restore();
    }
  } });
  badge(540 * S, 140 * S, 150 * S);
  headline([[["Try it", "s"], [" in airplane mode.", "i"]]], 540 * S, 330 * S, 70 * S, { align: "center" });
  ctx.save(); sans(500, 30 * S); ctx.fillStyle = INK_MUTED; ctx.textAlign = "center"; ctx.fillText("Ask it something that matters.", 540 * S, 410 * S); ctx.restore();
  // the address, on a paper label
  ctx.fillStyle = "rgba(255,250,238,0.97)"; rr(250 * S, 1168 * S, 580 * S, 168 * S, 22 * S); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.5 * S; ctx.stroke();
  ctx.save(); sans(800, 64 * S); ctx.textAlign = "center"; ctx.fillStyle = INK; ctx.letterSpacing = `${-0.5 * S}px`;
  ctx.fillText("boarapp.com", 540 * S, 1238 * S); const uw = ctx.measureText("boarapp.com").width + 20 * S; ctx.restore(); ctx.fillStyle = SUN; rr(540 * S - uw / 2, 1256 * S, uw, 6 * S, 3 * S); ctx.fill();
  caps("OPEN SOURCE · MIT · FOR ANDROID", 540 * S, 1306 * S, 22 * S, INK_MUTED, { align: "center", ls: 0.16 });
}

// ---------- frame ----------
window.CLIPINFO = { poster: CLIPS[CLIP].poster, T };
window.renderFrame = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over"; ctx.letterSpacing = "0px"; ctx.textAlign = "left"; ctx.filter = "none";
  ctx.clearRect(0, 0, W, H);
  CLIPS[CLIP].draw(clamp(t, 0, T));
};
function loadImage(src) { return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; }); }
window.ready = (async () => {
  await Promise.all([document.fonts.load(`800 20px ${BRAND.font}`), document.fonts.load(`500 20px ${BRAND.font}`), document.fonts.load(`italic 560 20px ${BRAND.serif}`),
    document.fonts.load(`400 20px "Roboto"`), document.fonts.load(`600 20px "Noto Sans Mono"`), document.fonts.load(`20px "Apple Color Emoji"`)]);
  ICON = await loadImage("../assets/boar-icon.png");
  renderFrame(+(Q.get("t") || 0));
})();
