// Docs: copy buttons, "On this page" highlight, and search over /docs/search.json.
(() => {
  // The menu starts closed on phones, open everywhere else (it's always shown on desktop).
  const menu = document.querySelector(".dn-toggle");
  if (menu && matchMedia("(max-width: 860px)").matches) menu.open = false;

  for (const btn of document.querySelectorAll(".code .copy")) {
    btn.addEventListener("click", async () => {
      const code = btn.parentElement.querySelector("code").innerText;
      try { await navigator.clipboard.writeText(code); btn.textContent = "Copied"; }
      catch { btn.textContent = "Select and copy"; }
      setTimeout(() => (btn.textContent = "Copy"), 1600);
    });
  }

  const links = [...document.querySelectorAll(".toc a")];
  if (links.length && "IntersectionObserver" in window) {
    const byId = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
    const heads = [...byId.keys()].map((id) => document.getElementById(id)).filter(Boolean);
    const visible = new Set();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) e.isIntersecting ? visible.add(e.target) : visible.delete(e.target);
      const first = heads.find((h) => visible.has(h));
      if (!first) return;
      links.forEach((a) => a.classList.remove("is-active"));
      byId.get(first.id)?.classList.add("is-active");
    }, { rootMargin: "0px 0px -70% 0px" });
    heads.forEach((h) => io.observe(h));
  }

  const input = document.getElementById("docs-q");
  const list = document.querySelector(".dn-results");
  if (!input || !list) return;
  let index = null;
  const load = () => index || (index = fetch("/docs/search.json").then((r) => r.json()).catch(() => []));
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  const run = async () => {
    const q = input.value.trim().toLowerCase();
    if (q.length < 2) { list.hidden = true; list.innerHTML = ""; return; }
    const words = q.split(/\s+/);
    const pages = await load();
    const hits = [];
    for (const p of pages) {
      const hay = (p.t + " " + p.d + " " + p.x).toLowerCase();
      if (!words.every((w) => hay.includes(w))) continue;
      let score = 0;
      for (const w of words) {
        if (p.t.toLowerCase().includes(w)) score += 10;
        if (p.d.toLowerCase().includes(w)) score += 4;
      }
      const head = p.h.find(([t]) => words.some((w) => t.toLowerCase().includes(w)));
      if (head) score += 6;
      const at = p.x.toLowerCase().indexOf(words[0]);
      const snip = at >= 0 ? (at > 40 ? "…" : "") + p.x.slice(Math.max(0, at - 40), at + 90) + "…" : p.d;
      hits.push({ score, url: p.u + (head ? "#" + head[1] : ""), title: p.t + (head ? " › " + head[0] : ""), snip });
    }
    hits.sort((a, b) => b.score - a.score);
    list.innerHTML = hits.length
      ? hits.slice(0, 8).map((h) => `<li><a href="${h.url}"><b>${esc(h.title)}</b><span>${esc(h.snip)}</span></a></li>`).join("")
      : `<li class="none">Nothing found for “${esc(input.value.trim())}”.</li>`;
    list.hidden = false;
  };
  input.addEventListener("focus", load, { once: true });
  input.addEventListener("input", run);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { input.value = ""; run(); }
    if (e.key === "Enter") list.querySelector("a")?.click();
  });
  document.addEventListener("click", (e) => { if (!e.target.closest(".dn-search")) list.hidden = true; });
})();
