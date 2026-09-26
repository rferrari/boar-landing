// Picks the background film that matches the theme and orientation, and only loads it
// when motion is welcome and the connection can take it. The poster is always there first.
(() => {
  const video = document.querySelector(".hero-video");
  if (!video) return;

  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const dark = matchMedia("(prefers-color-scheme: dark)");
  const tall = matchMedia("(max-aspect-ratio: 4/5)");
  const conn = navigator.connection || {};
  const slow = conn.saveData || /(^|-)2g$/.test(conn.effectiveType || "");

  const canWebm = video.canPlayType('video/webm; codecs="vp9"') !== "";
  const pick = () => {
    const theme = dark.matches ? "dark" : "light";
    if (tall.matches) return `/media/boar-field-recorder-${theme}-mobile.mp4`;
    return `/media/boar-field-recorder-${theme}.${canWebm ? "webm" : "mp4"}`;
  };

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

  for (const mq of [reduce, dark, tall]) mq.addEventListener?.("change", load);
  if (document.readyState === "complete") load(); else addEventListener("load", load, { once: true });
})();
