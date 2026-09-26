# boar-landing

Landing page for [BOAR](https://github.com/rferrari/boar-app), the open-source Android app that answers research questions with no signal.

- **Site:** static, in `public/` (HTML + CSS + a few lines of JS). No build step.
- **Background film:** "No Signal", a 15-second seamless loop through six places where the phone has no network (a night flight, a subway tunnel, a mountain at dawn, a rainforest field camp, a ship at sea, a city blackout). In each one a question from BOAR's evaluation set gets an answer with its offline source. The concept and the rejected directions are in [DESIGN.md](DESIGN.md).

## The film

`render/scene.html` is a canvas where every pixel is a pure function of `t`. Scenes live only inside their own time window, and the end card that spans the loop point is periodic over 15 s, so the first and last frames match exactly.

```bash
npm install
npm run render                                            # both variants -> public/media
node render/render.mjs --stills 0,2.3,6.5,12.6 --only desktop   # review PNGs -> render/out
node render/render.mjs --encode-only                      # re-encode from the saved masters
npm run preview                                           # scene at /render/scene.html?t=8.1 (&w=1080&h=1920 for vertical)
node render/shot.mjs [url]                                # page screenshots, desktop + phone, light + dark
```

Needs Google Chrome (or `CHROME_PATH`) and `ffmpeg`.

| Variant | Files |
|---|---|
| 1920×1080, 30 fps, 15 s | `boar-no-signal.mp4` (H.264, faststart) and `.webm` (VP9) |
| 1080×1920 | `boar-no-signal-mobile.mp4` |
| Posters | `poster.jpg`, `poster-mobile.jpg` |

One film serves both color schemes (it's a sequence of places, not a page surface). The page picks it by orientation, shows the poster first, and skips the video for `prefers-reduced-motion` and Save-Data / 2G connections.

## Credits

Mascot from [rferrari/boar-app](https://github.com/rferrari/boar-app). SOPA logo from SOPA. Font: Archivo (SIL OFL).

MIT license · [sopa.team](https://sopa.team)
