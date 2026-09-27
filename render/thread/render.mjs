// Renders the ten X-thread clips (render/thread/thread.html) to public/thread/tNN.mp4 + tNN.jpg.
//
//   node render/thread/render.mjs                         all ten
//   node render/thread/render.mjs --only 2,5              some
//   node render/thread/render.mjs --stills 0,3,6 --only 2 review PNGs -> render/out/thread
//
// 1080x1350 (4:5), 30 fps, H.264 yuv420p, faststart, no audio. Deterministic: frame i is renderFrame(i / FPS).
import { spawn, execFileSync } from "node:child_process";
import { mkdirSync, existsSync, statSync, rmSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";
import { serve } from "../serve.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const OUT = path.join(ROOT, "render/out/thread");
const DEST = path.join(ROOT, "public/thread");
const FPS = 30, W = 1080, H = 1350;

const args = process.argv.slice(2);
const arg = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
const stills = arg("--stills")?.split(",").map(Number);
const only = arg("--only")?.split(",").map(Number);
const CHROME = process.env.CHROME_PATH || ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/google-chrome", "/usr/bin/chromium"].find(existsSync);
if (!CHROME) throw new Error("Chrome not found; set CHROME_PATH");
const ff = (a) => execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...a], { stdio: "inherit" });
const nn = (n) => String(n).padStart(2, "0");

mkdirSync(OUT, { recursive: true }); mkdirSync(DEST, { recursive: true });
const { url, close } = await serve(ROOT, 0);
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--force-color-profile=srgb", "--hide-scrollbars"] });
try {
  for (let c = 1; c <= 10; c++) {
    if (only && !only.includes(c)) continue;
    const page = await browser.newPage();
    await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
    await page.goto(`${url}/render/thread/thread.html?clip=${c}`, { waitUntil: "load" });
    await page.evaluate(() => window.ready);
    const info = await page.evaluate(() => window.CLIPINFO);
    const grab = async (t) => {
      const data = await page.evaluate((t) => { window.renderFrame(t); return document.getElementById("c").toDataURL("image/png"); }, t);
      return Buffer.from(data.split(",")[1], "base64");
    };
    if (stills) {
      for (const t of stills) await writeFile(path.join(OUT, `t${nn(c)}-${String(t).replace(".", "_")}.png`), await grab(t));
      console.log(`clip ${c}: stills`); await page.close(); continue;
    }
    const frames = Math.round(info.T * FPS);
    const mp4 = path.join(DEST, `t${nn(c)}.mp4`);
    const enc = spawn("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "png", "-i", "-",
      "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-tune", "animation", "-profile:v", "high", "-level", "4.1", "-pix_fmt", "yuv420p",
      "-r", String(FPS), "-g", String(FPS * 2), "-an", "-movflags", "+faststart", mp4], { stdio: ["pipe", "inherit", "inherit"] });
    for (let i = 0; i < frames; i++) {
      const buf = await grab(i / FPS);
      if (!enc.stdin.write(buf)) await new Promise((r) => enc.stdin.once("drain", r));
    }
    enc.stdin.end(); await new Promise((r, j) => enc.on("close", (code) => (code ? j(new Error("ffmpeg " + code)) : r())));
    const png = path.join(OUT, `t${nn(c)}-poster.png`);
    await writeFile(png, await grab(info.poster));
    ff(["-i", png, "-q:v", "3", path.join(DEST, `t${nn(c)}.jpg`)]);
    await writeFile(path.join(OUT, `t${nn(c)}-frame0.png`), await grab(0));
    console.log(`clip ${c}: ${frames} frames, ${(statSync(mp4).size / 1e6).toFixed(2)} MB`);
    await page.close();
  }
} finally { await browser.close(); close(); }
