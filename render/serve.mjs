// Tiny static server (the scene needs http:// so the canvas isn't tainted by file:// images).
// `npm run preview` serves the repo: /render/scene.html?theme=dark&t=12 or /public/ for the site.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2", ".mp4": "video/mp4", ".webm": "video/webm", ".svg": "image/svg+xml", ".json": "application/json" };

export function serve(root, port = 0) {
  const server = createServer(async (req, res) => {
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (p.endsWith("/")) p += "index.html";
    const file = path.join(root, path.normalize(p));
    if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
    try { const body = await readFile(file); res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" }).end(body); }
    catch { res.writeHead(404).end("not found"); }
  });
  return new Promise((resolve) => server.listen(port, "127.0.0.1", () => {
    resolve({ url: `http://127.0.0.1:${server.address().port}`, close: () => server.close() });
  }));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const { url } = await serve(root, +(process.env.PORT || 4321));
  console.log(`serving ${root} at ${url}  (scene: ${url}/render/scene.html, site: ${url}/public/)`);
}
