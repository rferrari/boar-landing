// Renders the landing's foliage sprites (render/foliage.html) to public/nature/*.webp (+ .png fallback).
//   node render/foliage.mjs
import { execFileSync } from "node:child_process";
import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";
import { serve } from "./serve.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public/nature");
const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
if (!existsSync(CHROME)) throw new Error("Chrome not found; set CHROME_PATH");
const JOBS = [["corner-r", false], ["corner-l", false], ["corner-r", true], ["corner-l", true], ["divider", false], ["divider", true], ["wreath", false], ["meadow", true]];

await mkdir(OUT, { recursive: true });
const { url, close } = await serve(ROOT, 0);
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--force-color-profile=srgb"] });
const page = await browser.newPage();
for (const [sprite, night] of JOBS) {
  await page.goto(`${url}/render/foliage.html?sprite=${sprite}${night ? "&night" : ""}`, { waitUntil: "load" });
  await page.evaluate(() => window.ready);
  const data = await page.evaluate(() => document.getElementById("c").toDataURL("image/png"));
  const name = `${sprite}${night ? "-night" : ""}`, png = path.join(ROOT, "render/out", `${name}.png`);
  await writeFile(png, Buffer.from(data.split(",")[1], "base64"));
  execFileSync("cwebp", ["-quiet", "-q", "82", "-alpha_q", "90", png, "-o", path.join(OUT, `${name}.webp`)]);
  console.log(name);
}
await browser.close(); close();
