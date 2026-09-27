// Share images: render/og.html -> public/og.jpg, render/og-roadmap.html -> public/og-roadmap.jpg (1200x630).
//   node render/og.mjs   (after npm run render, so the poster is current)
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";
import { serve } from "./serve.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
if (!existsSync(CHROME)) throw new Error("Chrome not found; set CHROME_PATH");
const { url, close } = await serve(ROOT, 0);
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--force-color-profile=srgb"] });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630 });
for (const name of ["og", "og-roadmap"]) {
  await page.goto(`${url}/render/${name}.html`, { waitUntil: "networkidle0" });
  await page.evaluate(() => document.fonts.ready);
  const png = path.join(ROOT, "render/out", `${name}.png`);
  await page.screenshot({ path: png });
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", png, "-q:v", "4", path.join(ROOT, "public", `${name}.jpg`)]);
  console.log(name);
}
await browser.close(); close();
