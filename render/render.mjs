// Renders render/scene.html frame by frame in headless Chrome and encodes it with ffmpeg.
//
//   npm run render                      all variants -> public/media
//   node render/render.mjs --stills 0,3,7.4,12 --variant desktop   review PNGs -> render/out
//   node render/render.mjs --only mobile
//
// Deterministic: each frame is renderFrame(i / FPS); nothing depends on wall-clock time.
import { spawn, execFileSync } from "node:child_process";
import { mkdirSync, existsSync, rmSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";
import { serve } from "./serve.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "render/out");
const MEDIA = path.join(ROOT, "public/media");
const FPS = 30, SECONDS = 15, FRAMES = FPS * SECONDS;
const POSTER_T = 8.3; // in the garden at golden hour, answer and source on screen

// One film for both themes: it is a sequence of places, not a page surface.
const VARIANTS = {
  desktop: { w: 1920, h: 1080, name: "boar-no-signal", poster: "poster", webm: true },
  mobile: { w: 1080, h: 1920, name: "boar-no-signal-mobile", poster: "poster-mobile", webm: false },
};

const args = process.argv.slice(2);
const arg = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
const stills = arg("--stills")?.split(",").map(Number);
const only = (arg("--only") || arg("--variant"))?.split(",");
const encodeOnly = args.includes("--encode-only"); // reuse render/out/*.master.mkv

const CHROME = process.env.CHROME_PATH || [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser",
].find(existsSync);
if (!CHROME) throw new Error("Chrome not found; set CHROME_PATH");

const ff = (a) => execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...a], { stdio: "inherit" });

async function main() {
  mkdirSync(OUT, { recursive: true }); mkdirSync(MEDIA, { recursive: true });
  const { url, close } = await serve(ROOT, 0);
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--force-color-profile=srgb", "--disable-gpu-vsync", "--hide-scrollbars"] });
  try {
    for (const [key, v] of Object.entries(VARIANTS)) {
      if (only && !only.includes(key)) continue;
      const page = await browser.newPage();
      await page.setViewport({ width: v.w, height: v.h, deviceScaleFactor: 1 });
      await page.goto(`${url}/render/scene.html?w=${v.w}&h=${v.h}`, { waitUntil: "load" });
      await page.evaluate(() => window.ready);
      const grab = async (t) => {
        const data = await page.evaluate((t) => { window.renderFrame(t); return document.getElementById("c").toDataURL("image/png"); }, t);
        return Buffer.from(data.split(",")[1], "base64");
      };

      if (stills) {
        for (const t of stills) await writeFile(path.join(OUT, `${key}-t${String(t).replace(".", "_")}.png`), await grab(t));
        console.log(`${key}: ${stills.length} stills -> render/out`);
        await page.close(); continue;
      }

      // 1) lossless-ish intermediate
      const master = path.join(OUT, `${v.name}.master.mkv`);
      if (!(encodeOnly && existsSync(master))) {
      const enc = spawn("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "png", "-i", "-",
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "6", "-pix_fmt", "yuv444p", master], { stdio: ["pipe", "inherit", "inherit"] });
      const t0 = Date.now();
      for (let i = 0; i < FRAMES; i++) {
        const buf = await grab(i / FPS);
        if (!enc.stdin.write(buf)) await new Promise((r) => enc.stdin.once("drain", r));
        if (i % 90 === 0) process.stdout.write(`${key}: frame ${i}/${FRAMES}\r`);
      }
      enc.stdin.end(); await new Promise((r, j) => enc.on("close", (c) => (c ? j(new Error("ffmpeg " + c)) : r())));
      // loop check: frame at t = 15 must equal frame 0
      await writeFile(path.join(OUT, `${key}-loop-a.png`), await grab(0));
      await writeFile(path.join(OUT, `${key}-loop-b.png`), await grab(SECONDS));
      console.log(`${key}: ${FRAMES} frames in ${((Date.now() - t0) / 1000).toFixed(0)} s`);
      }

      // 2) web deliverables
      const mp4 = path.join(MEDIA, `${v.name}.mp4`);
      ff(["-i", master, "-c:v", "libx264", "-preset", "veryslow", "-crf", v.w > v.h ? "29" : "30", "-tune", "animation",
        "-profile:v", "high", "-level", "4.1", "-pix_fmt", "yuv420p", "-g", String(FPS * 5), "-an", "-movflags", "+faststart", mp4]);
      if (v.webm) {
        const webm = path.join(MEDIA, `${v.name}.webm`);
        ff(["-i", master, "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "46", "-row-mt", "1", "-deadline", "good", "-cpu-used", "2",
          "-pix_fmt", "yuv420p", "-g", String(FPS * 5), "-an", webm]);
      }
      const poster = path.join(MEDIA, `${v.poster}.jpg`);
      await writeFile(path.join(OUT, "poster.png"), await grab(POSTER_T));
      ff(["-i", path.join(OUT, "poster.png"), "-q:v", "6", poster]);
      execFileSync("cwebp", ["-quiet", "-q", "74", path.join(OUT, "poster.png"), "-o", path.join(MEDIA, `${v.poster}.webp`)]);
      rmSync(path.join(OUT, "poster.png"));
      await page.close();
    }
  } finally {
    await browser.close(); close();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
