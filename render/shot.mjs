// Screenshots of the landing page at desktop and phone widths, light and dark.
//   node render/shot.mjs                      -> serves ./public locally
//   node render/shot.mjs https://example.com  -> shoots a live URL
import path from "node:path";
import { existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";
import { serve } from "./serve.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "render/out/shots");
mkdirSync(OUT, { recursive: true });
const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
if (!existsSync(CHROME)) throw new Error("Chrome not found; set CHROME_PATH");

let url = process.argv[2], close = () => {};
const tag = url ? "live" : "local";
if (!url) ({ url, close } = await serve(path.join(ROOT, "public"), 0));

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--autoplay-policy=no-user-gesture-required", "--hide-scrollbars"] });
const sizes = { desktop: { width: 1440, height: 900, deviceScaleFactor: 1 }, phone: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true } };
for (const [name, vp] of Object.entries(sizes)) for (const theme of ["light", "dark"]) {
  const page = await browser.newPage();
  await page.setViewport(vp);
  await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: theme }]);
  await page.goto(url, { waitUntil: "networkidle0" });
  const state = await page.waitForFunction(() => {
    const v = document.querySelector(".hero-video");
    return v && v.classList.contains("is-playing") && v.currentTime > 2 ? { src: v.currentSrc, t: v.currentTime } : false;
  }, { timeout: 30000 }).then((h) => h.jsonValue()).catch(() => "video did not start");
  // scroll through once so scroll-in reveals fire, then back to the top
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += innerHeight / 2) { scrollTo({ top: y, behavior: "instant" }); await new Promise((r) => setTimeout(r, 150)); } scrollTo({ top: 0, behavior: "instant" }); await new Promise((r) => setTimeout(r, 1500)); });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  await page.screenshot({ path: path.join(OUT, `${tag}-${name}-${theme}.png`) });
  // tall captures at 2x repeat content in headless Chrome; take the full page at 1x
  if (vp.deviceScaleFactor > 1) { await page.setViewport({ ...vp, deviceScaleFactor: 1 }); await new Promise((r) => setTimeout(r, 400)); }
  await page.screenshot({ path: path.join(OUT, `${tag}-${name}-${theme}-full.png`), fullPage: true });
  console.log(name, theme, JSON.stringify(state), "horizontal overflow:", overflow);
  await page.close();
}
await browser.close(); close();
