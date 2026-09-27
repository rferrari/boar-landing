# boar-landing

Landing page for [BOAR](https://github.com/rferrari/boar-app), the open-source Android app that keeps a small AI model and a library of knowledge on your phone, and still answers when there is no signal.

- **Site:** static, in `public/` (HTML + CSS + a few lines of JS). No build step.

## The film

`render/scene.html` is a canvas where every pixel is a pure function of `t`: six places with no signal (in flight, a tunnel, a mountain hut, a garden, a storm at sea, a flooded road), one question in each, answered inside the BOAR chat screen. Scenes live only inside their own time window, and the end card that spans the loop point is periodic over 15 s, so the first and last frames match exactly. Brand colours and the end line live in the `BRAND` object at the top. The six places are drawn in `render/world.js` and the foliage frame (ink-outlined leaves, vines, ferns, flowers, clouds, lit by daylight or moonlight, no glows) in `render/nature.js`; the film, the thread clips and the page's leaf sprites all use the same two files.

```bash
npm install
npm run render                                            # both variants -> public/media
node render/render.mjs --stills 0,2.3,6.5,12.6 --only desktop   # review PNGs -> render/out
node render/render.mjs --encode-only                      # re-encode from the saved masters
npm run preview                                           # scene at /render/scene.html?t=8.1 (&w=1080&h=1920 for vertical)
node render/thumbs.mjs                                    # the page's scene thumbnails -> public/scenes
node render/shot.mjs [url]                                # page screenshots, desktop + phone, light + dark
node render/thread/render.mjs [--only 2,5] [--stills 0,5.4] # the ten X-thread clips -> public/thread
node render/foliage.mjs                                   # the page's leaf sprites -> public/nature
node render/og.mjs                                        # share images -> public/og.jpg, og-roadmap.jpg
```

Needs Google Chrome (or `CHROME_PATH`) and `ffmpeg`.

| Variant | Files |
|---|---|
| 1920×1080, 30 fps, 15 s | `boar-no-signal.mp4` (H.264, faststart) and `.webm` (VP9) |
| 1080×1920 | `boar-no-signal-mobile.mp4` |
| Posters | `poster.jpg`, `poster-mobile.jpg` (+ `.webp` copies, made with Pillow: `Image.save(..., 'WEBP', quality=72)`; the same for `public/scenes`) |

One film serves both color schemes (it's a sequence of places, not a page surface). The page picks it by orientation, shows the poster first, and skips the video for `prefers-reduced-motion` and Save-Data / 2G connections.

## Credits

Mascot from [rferrari/boar-app](https://github.com/rferrari/boar-app). SOPA logo from SOPA. Fonts: Archivo and Fraunces (SIL OFL); the film's phone screen uses Roboto and Noto Sans Mono (SIL OFL / Apache 2.0).

MIT license · [sopa.team](https://sopa.team)
