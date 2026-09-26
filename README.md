# boar-landing

Landing page for [BOAR](https://github.com/rferrari/boar-app), the open-source Android app that answers research questions with no signal.

- **Site:** static, in `public/` (HTML + CSS + a few lines of JS). No build step.
- **Background film:** "The Field Recorder", a 15-second seamless loop of a strip-chart recorder logging one real BOAR answer, drawn to scale. The concept and the rejected directions are in [DESIGN.md](DESIGN.md).

## The film

`render/scene.html` is a canvas where every pixel is a pure function of `t`, periodic over 15 s, so the first and last frames match exactly. Every number on screen comes from BOAR's published evidence (`docs/evidence` in the app repo).

```bash
npm install
npm run render                                          # all variants -> public/media
node render/render.mjs --stills 0,7.4,12.6 --only desktop-dark   # review PNGs -> render/out
node render/render.mjs --encode-only                    # re-encode from the saved masters
npm run preview                                         # scene at /render/scene.html?theme=dark&t=12
node render/shot.mjs [url]                              # page screenshots, desktop + phone, light + dark
```

Needs Google Chrome (or `CHROME_PATH`) and `ffmpeg`.

| Variant | Files |
|---|---|
| 1920×1080, 30 fps, 15 s | `boar-field-recorder-{light,dark}.mp4` (H.264, faststart) and `.webm` (VP9) |
| 1080×1920 | `boar-field-recorder-{light,dark}-mobile.mp4` |
| Posters | `poster-{light,dark}[-mobile].jpg` |

The page picks the film by `prefers-color-scheme` and orientation, shows the poster first, and skips the video for `prefers-reduced-motion` and Save-Data / 2G connections.

## Credits

Logo and mascot from [rferrari/boar-app](https://github.com/rferrari/boar-app). Fonts: IBM Plex Mono, Instrument Serif, Archivo Narrow (SIL OFL).

MIT license · built by vaipraonde & Vlad · SOPA
