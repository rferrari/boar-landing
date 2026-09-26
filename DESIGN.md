# BOAR landing: design notes

## The brief, in one line

A 15-second, seamlessly looping background film for the BOAR landing page that
shows the moments when you have no signal and still need an answer. It has to be
dynamic and good-looking without drowning the headline, and it has to be true to
the app.

## Rejected directions

### Rejected by the owner: "The Field Recorder" (first version)

A strip-chart recorder (the paper-and-pen instrument from seismology) logging
one real BOAR answer at real speed: a flat NETWORK pen, source ticks, a token
seismogram, dimension lines and a rubber-stamped receipt, on cream chart paper
with sprocket holes.

The owner's verdict: *"I don't like the aesthetics. Do something completely
different, more like something you need when you're offline in different
situations, and make it more dynamic."* What went wrong:

- It explained the product's **method** (measurement) instead of its **use**
  (you're somewhere with no network and you need to know something).
- One slow machine for 15 seconds. It was calm by design, and it read as static.
- Beige print, graph paper and a scientific instrument read as "archive", not
  "a thing in your pocket on a mountain".

So this version drops the whole family: no chart or graph paper, no sprocket
holes, no instrument panel, no stamp, no beige/print look.

### Still rejected: the showreel clichés

| # | The cliché | Why it's out |
|---|---|---|
| 1 | **Neon gradient blobs / aurora mesh**, glassmorphism on top. | Says "AI startup" and nothing else. |
| 2 | **Particle field / neural-net brain.** | The generic "AI is thinking" picture. BOAR is about where you are, not what the model looks like. |
| 3 | **Glowing 3D logo spin.** | Turns the mascot into a trophy and means redrawing the logo, which we don't do. |
| 4 | **Glitch / cyberpunk terminal**, matrix rain. | Crypto-hacker associations; unreadable as a background. |
| 5 | **Kinetic type slamming words** and **bento UI mockups** floating in 3D. | Every launch video on X. The playbook says no superlatives. |

The one piece of UI in the film is a single flat card, and it never moves. It's
not a mockup being shown off; it's the thing that stays the same while the world
changes.

## The concept: "No Signal"

**Six places where the phone has no network, cut on a steady beat. In each one,
someone asks a real question and BOAR answers it offline, with its source. The
card and its status bar never move; the world changes around them.**

The story is one contrast, repeated: the status bar says **No Service** (or
**Airplane mode**) and the answer arrives anyway, with a source chip under it.

| # | Place | Clock | Question (BOAR eval set v1) | Source shown |
|---|---|---|---|---|
| 1 | In flight, night, airplane mode | 23:40 | What is a black hole and how does one form? (`grounded-2`) | Black hole |
| 2 | Underground, a train in a tunnel | 08:15 | Why did the Western Roman Empire fall? (`grounded-1`) | Fall of the Western Roman Empire |
| 3 | Above the treeline, dawn | 06:20 | Explain photosynthesis in simple terms. (`explanation-2`) | Photosynthesis |
| 4 | Rainforest field camp, afternoon | 15:30 | Why is the Amazon rainforest considered important for global climate? (first sentence of `synthesis-3`) | Amazon rainforest |
| 5 | At sea, midday | 12:10 | Who proposed the theory of evolution by natural selection? (`factual-2`) | Evolution |
| 6 | City blackout, dusk | 20:05 | Compare the French Revolution and the Industrial Revolution. (`comparison-1`) | French Revolution, Industrial Revolution |

Then the end card: the card folds into a round badge with the mascot, over the
night sky the blackout left behind, and the line **"Offline means offline."**
(manifesto belief 1). The loop pulls back out of that sky through an airplane
window, so the film never has a hard reset.

### Why these questions

The questions are from `docs/EVAL_QUERIES.md`, and every source chip is the
expected article that BOAR's retrieval returned (ranked #1 or #2) for that exact
question in the 2026-09-24 baseline run
(`docs/evidence/2026-09-24-baseline-5-configs`, "Retrieved articles per query").
So the chips show what BOAR actually found on a real phone, not a guess.

The manifesto's "how do I treat a blister?" was the obvious mountain question,
but it isn't in the eval set, and "Blister" isn't linked from Wikipedia's Vital
Articles lists (the basis of the optional pack), so we couldn't show a source we
knew BOAR would find. We used evaluated questions instead. We also skipped
eval questions BOAR got wrong in the run (the train arrival time, the RAM
budget).

The answer text is a short, plain summary of the correct answer, abridged to
fit; it is not presented as a quoted model output. The page says so in the "No
signal, still an answer" section. The clock times are scene decoration (time of
day), not data. No other numbers appear in the film.

### What changed from "static instrument" to "dynamic"

- **Cuts every ~2.1 s** (boundaries at 0, 2.3, 4.4, 6.5, 8.6, 10.7, 13.0 s),
  each one a motivated camera move, not a crossfade:
  1. **End card → flight:** zoom out from 9× through the window; the end card's
     starfield *is* the view outside.
  2. **Flight → subway:** push into the window; the oval becomes the tunnel mouth.
  3. **Subway → mountain:** the light at the end of the tunnel grows, flashes,
     and you're out on the ridge at dawn.
  4. **Mountain → rainforest:** a whip tilt down, below the treeline.
  5. **Rainforest → sea:** a wall of leaves sweeps across.
  6. **Sea → city:** the horizon line holds still and the world splits open
     along it (the sea horizon becomes the harbor waterline).
  7. **City → end card:** the grid goes down in a wave (windows, streetlights,
     and the cell tower's beacon), the stars come out, the camera tilts up.
- **Camera motion inside every scene:** parallax layers (5 mountain ridges,
  3 rainforest depths, 3 building layers), clouds rushing past the plane window,
  tunnel rings streaming at 7 per second, a ship pitching and rolling against the
  horizon, turbulence bob in the cabin.
- **Motion on the card:** the question is typed, the answer streams word by word
  with a cursor in the scene's color, the source chip pops in with a back-out
  ease, the clock rolls to the next place's time, and the card pops 1.8% on each
  cut.

## Visual language

- **Flat illustration with cinematic light**, drawn in code (canvas 2D): strong
  silhouettes, graded skies, rim light on ridges, glows from lamps, moon and sun.
  No photos, no generated images, no people beyond a small hiker silhouette.
- **One bold palette per place, one system:** violet night cabin, acid-mint
  tunnel, coral/plum dawn, gold/green rainforest, cobalt sea, magenta dusk to
  black. The card's top edge, the tag pill and the source chip take that place's
  accent, so the constant element carries the color change.
- **The card:** warm white, near-black type, 30px radius, deep shadow. Status
  bar (clock, "No Service" / "Airplane mode", battery), the BOAR header with the
  real mascot and an OFFLINE pill, "Qwen2.5-1.5B · on device" (the default
  model), the question bubble, the answer, "OFFLINE SOURCE · WIKIPEDIA" and a
  chip per source.
- **Type:** Archivo (variable, width + weight axes), one family for film and
  page. Semi-expanded 800 for headlines and the end line, semi-condensed caps for
  place tags, normal width for reading.
- **Logo:** only the existing mascot (`assets/icon.png` from rferrari/boar-app),
  in the card header and the end badge. Never redrawn.

## The readable zone

The film is composed for a headline on the left: on desktop the card sits at
61–95% of the width, focal elements (window, tunnel mouth, sun, tent, bow) sit
around 40–55%, and the page lays a dark gradient scrim over the left half. The
hero is therefore always dark, in both color schemes: the film is a sequence of
places at different times of day, not a page surface, so it doesn't swap with the
theme. Everything below the hero follows `prefers-color-scheme`.

In the vertical film the card sits in the lower 40% (scaled 1.28× so its type
stays legible on a phone) and the top is left for the copy, with a top-down
scrim. On phones the hero shows only the eyebrow, headline, lede and two short
CTAs, so it all fits above the card.

## Loop

Each scene is drawn only inside its own time window, as a function of its local
time. The only thing on screen across the loop point is the end card: a static
sky whose stars twinkle at whole-number frequencies of 1/15 s, the badge and the
line. So `frame(15 s) === frame(0)`; `render.mjs` writes both frames and they
compare byte-identical.

## Renders

`npm run render` renders `render/scene.html` frame by frame in headless Chrome
and pipes the PNGs to ffmpeg.

- `public/media/boar-no-signal.mp4` / `.webm`: 1920×1080, 30 fps, 15 s
- `public/media/boar-no-signal-mobile.mp4`: 1080×1920
- `public/media/poster.jpg`, `poster-mobile.jpg`: the in-flight scene with the
  answer and source on screen (also the reduced-motion image)

## The page below the film

The owner liked the film hero and called the first lower page sloppy, so the lower
page is designed as a product story with the same care as the film.

- **Rhythm:** six sections, each with one job, alternating surfaces:
  1. **How it works:** three steps, each with a small drawn UI moment (the one
     download, the airplane-mode tile over "No Service", an answer with its source
     chip), then four facts on a ruled grid.
  2. **Where it matters:** the six places as cards cut from real film frames, each
     with its scene color, its question as a chat bubble and its source chips.
  3. **The receipt:** the numbers as a data card, not a table. One average answer
     on a timeline (first token at 6.4 s, done at 10.6 s, with a legend and direct
     labels), six stat tiles, then the five configurations as a single-series bar
     chart of seconds per answer with the 120 s timeout marked. A "Show as a table"
     disclosure keeps the table view. Device, date and the docs/evidence link sit
     under it.
  4. **The manifesto, set large:** "Offline means offline." / "Nothing leaves your
     phone." on the film's night sky. This band is dark in both color schemes.
  5. **Not the dream, and we say so:** the honest limits, the MIT/open-source line
     and the poidh bounty #31 entry, as a restrained three-column strip.
  6. **Final call:** the mascot, the manifesto's last line, Download the APK and
     GitHub, then the footer (SOPA logo + sopa.team).
- **Type scale:** display (h2, 800, semi-expanded), title (20px, 750), body
  (17px), label (12.5px caps, tracked). Big numbers use the display face with
  tabular figures.
- **Motion:** scroll-in reveals (20px rise, 80ms stagger), bars and the timeline
  grow when their card arrives, the download bar fills and the airplane switch
  flips when their step arrives, lifts on card hover. Everything is visible
  without JavaScript, and `prefers-reduced-motion` shows the final state with no
  movement.
- **Tokens:** every page color is a CSS custom property in `:root` (light) and
  the dark block; the film's brand values (font, card surface, ink, end-card
  accent) are the `BRAND` object at the top of `render/scene.html`. A brand guide
  can be applied by editing those two places.
