// Docs: content/docs/*.md -> public/docs/<slug>/index.html, plus the search index
// and the sitemap. Static like the rest of the site; run it after editing a page.
//   node render/docs.mjs
//
// A page is Markdown with a small front matter block:
//   ---
//   title: Install BOAR
//   description: One sentence for search results and link previews.
//   section: Start here
//   order: 20
//   ---
// index.md becomes /docs/. Links to other pages can be written as `install.md`
// or `/docs/install/`. GitHub-style callouts (> [!NOTE], > [!TIP], > [!WARNING])
// become boxes.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Marked } from "marked";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "content/docs");
const OUT = path.join(ROOT, "public/docs");
const SITE = "https://boarapp.com";
const EDIT = "https://github.com/sopa-agency/boar-landing/edit/main/content/docs";
const SECTIONS = ["Start here", "Using BOAR", "Your knowledge", "Models", "How it works", "Project"];

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const strip = (html) => html.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const slugify = (s) => strip(s).toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// ---------- read pages ----------
function frontMatter(raw, file) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) throw new Error(`${file}: missing front matter`);
  const meta = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  for (const k of ["title", "description", "section", "order"]) if (!meta[k]) throw new Error(`${file}: front matter needs "${k}"`);
  if (!SECTIONS.includes(meta.section)) throw new Error(`${file}: unknown section "${meta.section}"`);
  return { meta, body: raw.slice(m[0].length) };
}

const pages = readdirSync(SRC).filter((f) => f.endsWith(".md")).map((file) => {
  const { meta, body } = frontMatter(readFileSync(path.join(SRC, file), "utf8"), file);
  const slug = file === "index.md" ? "" : file.replace(/\.md$/, "");
  return { file, slug, url: slug ? `/docs/${slug}/` : "/docs/", ...meta, order: Number(meta.order), body };
}).sort((a, b) => SECTIONS.indexOf(a.section) - SECTIONS.indexOf(b.section) || a.order - b.order);
const bySlug = new Map(pages.map((p) => [p.slug, p]));

// ---------- markdown ----------
function render(page) {
  const toc = [];
  const used = new Set();
  const marked = new Marked({ gfm: true });
  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const html = this.parser.parseInline(tokens);
        if (depth === 1) return ""; // the title comes from front matter
        let id = slugify(html) || "section";
        while (used.has(id)) id += "-";
        used.add(id);
        if (depth <= 3) toc.push({ depth, id, text: strip(html) });
        return `<h${depth} id="${id}"><a class="anchor" href="#${id}" aria-hidden="true" tabindex="-1">#</a>${html}</h${depth}>\n`;
      },
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        let url = href;
        const md = href.match(/^(?:\.\/)?([a-z0-9-]+)\.md(#.*)?$/);
        if (md) {
          const target = md[1] === "index" ? "" : md[1];
          if (!bySlug.has(target)) throw new Error(`${page.file}: link to missing page ${href}`);
          url = `/docs/${target ? target + "/" : ""}${md[2] || ""}`;
        }
        const external = /^https?:\/\//.test(url) && !url.startsWith(SITE);
        return `<a href="${esc(url)}"${title ? ` title="${esc(title)}"` : ""}${external ? ' rel="noopener"' : ""}>${text}</a>`;
      },
      code({ text, lang }) {
        const cls = lang ? ` class="language-${esc(lang)}"` : "";
        return `<div class="code"><pre><code${cls}>${esc(text)}</code></pre><button class="copy" type="button" aria-label="Copy">Copy</button></div>\n`;
      },
      table(token) {
        return `<div class="table-wrap">${this.constructor.prototype.table.call(this, token)}</div>\n`;
      },
      blockquote({ tokens }) {
        let inner = this.parser.parse(tokens);
        const m = inner.match(/^<p>\[!(NOTE|TIP|WARNING)\]\s*/);
        if (!m) return `<blockquote>${inner}</blockquote>\n`;
        inner = inner.replace(m[0], "<p>");
        const kind = m[1].toLowerCase();
        const label = { note: "Note", tip: "Tip", warning: "Careful" }[kind];
        return `<aside class="callout callout-${kind}"><p class="callout-label">${label}</p>${inner}</aside>\n`;
      },
    },
  });
  const html = marked.parse(page.body);
  return { html, toc };
}

// ---------- page shell ----------
// The footer is the home page's, so the two never drift apart.
const FOOTER = (() => {
  const home = readFileSync(path.join(ROOT, "public/index.html"), "utf8");
  const m = home.match(/<footer class="footer">[\s\S]*?<\/footer>/);
  if (!m) throw new Error("public/index.html has no footer");
  return m[0].includes('href="/docs/"') ? m[0]
    : m[0].replace('<p class="footer-links">', '<p class="footer-links">\n      <a href="/docs/">Docs</a>');
})();
const GTAG = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-MHH6QGDK9J"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-MHH6QGDK9J');
</script>`;

function sidebar(current) {
  return SECTIONS.map((sec) => {
    const items = pages.filter((p) => p.section === sec);
    if (!items.length) return "";
    return `<div class="dn-group"><p class="dn-head">${esc(sec)}</p><ul>${items.map((p) =>
      `<li><a href="${p.url}"${p === current ? ' aria-current="page"' : ""}>${esc(p.nav || p.title)}</a></li>`).join("")}</ul></div>`;
  }).join("");
}

function shell(page, { html, toc }, i) {
  const prev = pages[i - 1], next = pages[i + 1];
  const url = SITE + page.url;
  const title = page.slug ? `${page.title} · BOAR docs` : "BOAR docs: offline AI on your phone";
  const crumbs = [{ name: "BOAR", url: SITE + "/" }, { name: "Docs", url: SITE + "/docs/" }];
  if (page.slug) crumbs.push({ name: page.title, url });
  const ld = [
    { "@context": "https://schema.org", "@type": "TechArticle", headline: page.title, description: page.description, url,
      inLanguage: "en", isPartOf: { "@type": "WebSite", name: "BOAR", url: SITE + "/" },
      about: { "@type": "SoftwareApplication", name: "BOAR", operatingSystem: "Android", applicationCategory: "UtilitiesApplication",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
      publisher: { "@type": "Organization", name: "SOPA", url: "https://sopa.team" } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: crumbs.map((c, n) => ({ "@type": "ListItem", position: n + 1, name: c.name, item: c.url })) },
  ];
  if (page.faq) ld.push({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: page.faq });
  const tocHtml = toc.filter((t) => t.depth === 2).length >= 2
    ? `<nav class="toc" aria-label="On this page"><p class="toc-head">On this page</p><ul>${toc.map((t) =>
        `<li class="toc-${t.depth}"><a href="#${t.id}">${esc(t.text)}</a></li>`).join("")}</ul></nav>` : "";

  return `<!doctype html>
<html lang="en" class="no-js">
<head>
${GTAG}
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(page.description)}">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#0f1d19">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" type="image/png" sizes="32x32" href="/icon-32.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(page.title)} · BOAR">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:image" content="${SITE}/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@boar_app">
<meta name="twitter:title" content="${esc(page.title)} · BOAR">
<meta name="twitter:description" content="${esc(page.description)}">
<meta name="twitter:image" content="${SITE}/og.jpg">
<link rel="preload" as="font" type="font/woff2" href="/fonts/Archivo-var.woff2" crossorigin>
<link rel="stylesheet" href="/styles.css">
<link rel="stylesheet" href="/docs/docs.css">
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>
<script>document.documentElement.className = "js";</script>
</head>
<body class="page-docs">

<header class="rm-top docs-top" id="top">
  <nav class="topbar" aria-label="Main">
    <a class="brand" href="/">
      <img src="/boar-96.png" alt="" width="40" height="40">
      <span>BOAR</span>
    </a>
    <div class="topbar-links">
      <a href="/#how">How it works</a>
      <a href="/docs/" aria-current="page">Docs</a>
      <a href="/roadmap/">Roadmap</a>
      <a href="https://github.com/rferrari/boar-app">GitHub</a>
    </div>
  </nav>
  <div class="wrap docs-intro">
    <p class="docs-crumb"><a href="/docs/">Docs</a>${page.slug ? ` <span aria-hidden="true">/</span> ${esc(page.section)}` : ""}</p>
    <h1>${esc(page.heading || page.title)}</h1>
    <p class="docs-lede">${esc(page.description)}</p>
  </div>
</header>

<div class="wrap docs-layout">
  <aside class="docs-nav" aria-label="Docs">
    <details class="dn-toggle" open>
      <summary>Docs menu</summary>
      <form class="dn-search" role="search" onsubmit="return false">
        <label class="visually-hidden" for="docs-q">Search the docs</label>
        <input id="docs-q" type="search" placeholder="Search the docs" autocomplete="off">
        <ul class="dn-results" hidden></ul>
      </form>
      ${sidebar(page)}
    </details>
  </aside>

  <main class="docs-main" id="content">
    <article class="prose">
${html}
    </article>
    <nav class="docs-pager" aria-label="Previous and next page">
      ${prev ? `<a class="pg-prev" href="${prev.url}"><span>Previous</span>${esc(prev.nav || prev.title)}</a>` : "<span></span>"}
      ${next ? `<a class="pg-next" href="${next.url}"><span>Next</span>${esc(next.nav || next.title)}</a>` : "<span></span>"}
    </nav>
    <p class="docs-edit"><a href="${EDIT}/${page.file}">Edit this page on GitHub</a> · <a href="https://github.com/rferrari/boar-app/issues">Something wrong? Open an issue</a></p>
  </main>

  ${tocHtml ? `<aside class="docs-toc">${tocHtml}</aside>` : ""}
</div>

${FOOTER}

<script src="/docs/docs.js" defer></script>
</body>
</html>
`;
}

// ---------- FAQ structured data ----------
// On a page with `faq: true`, every h3 is a question and what follows it (until
// the next heading) is the answer.
function faqEntities(html) {
  const out = [];
  const re = /<h3 id="[^"]*">(?:<a[^>]*>#<\/a>)?([\s\S]*?)<\/h3>\n([\s\S]*?)(?=<h[23] |$)/g;
  let m;
  while ((m = re.exec(html))) {
    const answer = strip(m[2]).replace(/\s+/g, " ").trim();
    if (answer) out.push({ "@type": "Question", name: strip(m[1]).trim(), acceptedAnswer: { "@type": "Answer", text: answer } });
  }
  return out;
}

// ---------- write ----------
for (const dir of readdirSync(OUT, { withFileTypes: true })) {
  if (dir.isDirectory() && dir.name !== "media") rmSync(path.join(OUT, dir.name), { recursive: true });
}
const search = [];
pages.forEach((page, i) => {
  const r = render(page);
  if (page.faq === "true") page.faq = faqEntities(r.html); else delete page.faq;
  const dir = path.join(OUT, page.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "index.html"), shell(page, r, i));
  search.push({
    t: page.title, u: page.url, s: page.section, d: page.description,
    h: r.toc.map((t) => [t.text, t.id]),
    x: strip(r.html).replace(/\s+/g, " ").slice(0, 4000),
  });
  console.log(page.url.padEnd(28), page.title);
});
writeFileSync(path.join(OUT, "search.json"), JSON.stringify(search));

// Sitemap: the two landing pages plus every docs page.
const today = new Date().toISOString().slice(0, 10);
const urls = ["/", "/roadmap/", ...pages.map((p) => p.url)];
writeFileSync(path.join(ROOT, "public/sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) =>
    `  <url><loc>${SITE}${u}</loc><lastmod>${today}</lastmod></url>`).join("\n")}\n</urlset>\n`);
if (!existsSync(path.join(OUT, "docs.css"))) console.warn("public/docs/docs.css is missing");
console.log(`${pages.length} pages, search index and sitemap written`);
