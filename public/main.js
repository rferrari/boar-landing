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

  frame.addEventListener("load", () => {
    frame.contentWindow?.postMessage(
      {
        type: "swapspro:style",
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
          },
          fontFamily: "Archivo, system-ui, sans-serif",
          shape: { borderRadius: 22, borderRadiusSecondary: 14 },
        },
      },
      origin,
    );
  });

  addEventListener("message", (e) => {
    if (e.origin !== origin || e.data?.type !== "swapspro:height") return;
    frame.style.height = `${e.data.height}px`;
  });
})();
