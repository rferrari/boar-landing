// Scene thumbnails for the page (public/scenes/*.jpg): the world without the phone, 4:3 around the focal point.
//   node render/thumbs.mjs
import { execFileSync } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";
import { serve } from "./serve.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
if (!existsSync(CHROME)) throw new Error("Chrome not found; set CHROME_PATH");
// [t, crop top]: a frame in each scene, cropped 1080x810 around the focal point
const SHOTS = { flight: [1.2, 67], subway: [3.3, 67], peak: [5.6, 250], garden: [7.7, 150], sea: [9.19, 67], road: [11.9, 67] };

const { url, close } = await serve(ROOT, 0);
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--force-color-profile=srgb"] });
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });
await page.goto(`${url}/render/scene.html?w=1920&h=1080&nocard`, { waitUntil: "load" });
await page.evaluate(() => window.ready);
for (const [id, [t, top]] of Object.entries(SHOTS)) {
  const data = await page.evaluate((t) => { window.renderFrame(t); return document.getElementById("c").toDataURL("image/png"); }, t);
  const png = path.join(ROOT, "render/out", `thumb-${id}.png`);
  await writeFile(png, Buffer.from(data.split(",")[1], "base64"));
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", png, "-vf", `crop=1080:810:266:${top},scale=800:600`, "-q:v", "5", path.join(ROOT, "public/scenes", `${id}.jpg`)]);
}
await browser.close(); close();
console.log("thumbnails -> public/scenes");
