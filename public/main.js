// Picks the background film for the screen's orientation, and only loads it when
// motion is welcome and the connection can take it. The poster is always there first.
(() => {
  const video = document.querySelector(".hero-video");
  if (!video) return;

  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const tall = matchMedia("(max-aspect-ratio: 4/5)");
  const conn = navigator.connection || {};
  const slow = conn.saveData || /(^|-)2g$/.test(conn.effectiveType || "");

  const canWebm = video.canPlayType('video/webm; codecs="vp9"') !== "";
  const pick = () => (tall.matches ? "/media/boar-no-signal-mobile.mp4" : `/media/boar-no-signal.${canWebm ? "webm" : "mp4"}`);

  let current = "";
  const load = () => {
    if (reduce.matches || slow) { video.pause(); video.removeAttribute("src"); video.load(); video.classList.remove("is-playing"); current = ""; return; }
    const src = pick();
    if (src === current) return;
    current = src;
    video.classList.remove("is-playing");
    video.src = src;
    video.play().catch(() => {});
  };
  video.addEventListener("playing", () => video.classList.add("is-playing"));

  // Pause when the hero is off screen (saves battery; this is a phone-first project).
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => {
      if (!current) return;
      if (e.isIntersecting) video.play().catch(() => {}); else video.pause();
    }).observe(video);
  }

  for (const mq of [reduce, tall]) mq.addEventListener?.("change", load);
  if (document.readyState === "complete") load(); else addEventListener("load", load, { once: true });
})();

// Scroll-in reveals for the lower page (CSS keeps everything visible without JS or with reduced motion).
(() => {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("in")); return; }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
  els.forEach((el) => io.observe(el));
})();

// A shared link's #anchor (e.g. #swap, for pointing straight at the trade
// section) races the browser's own jump against everything above it still
// settling into its final layout — the hero poster, web fonts, the reveal
// fade-ins above. `scroll-behavior: smooth` (styles.css) makes it worse: an
// animated scroll started toward a target that then moves can end short,
// long, or not move at all. Re-aiming once, after `load` (every image and
// font already sized), corrects the final position without touching the
// browser's own first attempt.
(() => {
  if (!location.hash) return;
  const target = document.getElementById(location.hash.slice(1));
  if (!target) return;
  const land = () => target.scrollIntoView({ behavior: "instant", block: "start" });
  if (document.readyState === "complete") land();
  else addEventListener("load", land, { once: true });
})();

// Copy the $boar contract address.
(() => {
  const box = document.querySelector(".ca");
  const btn = box?.querySelector(".ca-copy");
  if (!btn) return;
  btn.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(box.dataset.ca); btn.textContent = "Copied"; }
    catch { btn.textContent = "Select it"; }
    setTimeout(() => (btn.textContent = "Copy"), 1600);
  });
})();

// The $boar swap embed: pass our own palette in (so it reads as one more
// card on this page, not a foreign box) and let it tell us its real height
// (a fixed guess either clips the card or leaves dead space under it).
// Scoped entirely to this iframe — wallet connect lives inside it and
// touches nothing else on the page.
(() => {
  const frame = document.getElementById("boar-swap");
  if (!frame) return;
  const origin = new URL(frame.src).origin;
  const css = getComputedStyle(document.documentElement);
  const v = (name) => css.getPropertyValue(name).trim();
  // boar's own palette is a `#rrggbb` literal per var, always — turned into an
  // rgba() string here because the glass surfaces below want a translucency
  // none of boar's own tokens carry.
  const rgba = (hex, alpha) => {
    const h = hex.replace("#", "");
    const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const sendTheme = () => {
    // Which half of boar's OWN palette just got read above — `prefers-color-
    // scheme` is exactly what styles.css itself branches on. Posted alongside
    // the palette so the widget's light/dark CLASS (which a couple of its own
    // rules, like the wallet-connect backdrop, still key off directly) tracks
    // the visitor's actual scheme instead of the `?theme=` the iframe's src
    // was built with once, at write time.
    const isDark = matchMedia("(prefers-color-scheme: dark)").matches;
    frame.contentWindow?.postMessage(
      {
        type: "swapspro:style",
        style: { theme: isDark ? "dark" : "light" },
        theme: {
          colors: {
            canvas: v("--surface"),
            surface: v("--surface"),
            surfaceRaised: v("--surface-2"),
            surfaceSunken: v("--bg-2"),
            borderSubtle: v("--rule"),
            borderStrong: v("--rule"),
            text: v("--ink"),
            textMuted: v("--ink-muted"),
            textSubtle: v("--ink-subtle"),
            accent: v("--accent-fill"),
            accentText: "#1d1a0e",
            accentSoft: v("--accent-bg"),
            // Buttons, inputs and the wallet-connect dialog read a newer
            // material the keys above never touched — this was the actual
            // "still white" bug, not a card-background miss (fixed in
            // swapspro's own embed/theme.ts, 2026-09-28).
            buttonFill: v("--surface-2"),
            buttonBorder: v("--rule"),
            fieldFill: v("--bg-2"),
            panelFill: v("--surface"),
            // The wallet-connect dialog and the swap card's OWN backgrounds
            // are these — a plain CSS class overrides anything the recipe
            // token above computes to (fixed in swapspro's embed/theme.ts,
            // 2026-09-28) — without these the dialog kept its literal
            // light-mode gradient no matter what the rest of this object said.
            panelTop: rgba(v("--surface"), 0.85),
            panelBot: rgba(v("--bg-2"), 0.9),
            panelRim: v("--rule"),
            panelSheen: "rgba(255, 255, 255, 0.06)",
            rowFill: rgba(v("--surface"), 0.78),
            ctaFill: v("--accent-fill"),
            ctaText: "#1d1a0e",
            // A disabled control (the quick-amount row before a wallet is
            // connected — the first thing most visitors see) is a plain
            // app-owned variable outside Chakra's token system, not covered
            // by any of the above either.
            disabledFill: v("--bg-2"),
            disabledText: v("--ink-subtle"),
          },
          fontFamily: "Archivo, system-ui, sans-serif",
          shape: { borderRadius: 22, borderRadiusSecondary: 14 },
        },
      },
      origin,
    );
  };

  // `load` fires on the raw iframe document, which can beat the SPA inside it
  // hydrating far enough to attach its own message listener — a theme posted
  // into that gap is gone, not queued, and the widget was stuck on its
  // default light look no matter what we sent. Kept as a fast path for a warm
  // load; `swapspro:ready` (posted once the widget's listener genuinely
  // exists) is what actually guarantees delivery.
  frame.addEventListener("load", sendTheme);

  addEventListener("message", (e) => {
    if (e.origin !== origin) return;
    if (e.data?.type === "swapspro:ready") return sendTheme();
    if (e.data?.type === "swapspro:height") frame.style.height = `${e.data.height}px`;
  });
})();
