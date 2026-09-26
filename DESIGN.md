# BOAR landing: design notes

## The brief, in one line

A 15-second, seamlessly looping background film for the BOAR landing page. It
has to be spectacular without drowning the headline, and it has to be true to
the app.

## Step 1: the obvious directions, rejected

These are the first things anyone (human or model) reaches for when asked for an
"AI app showreel". Each one is rejected on purpose.

| # | The cliché | Why it's out |
|---|---|---|
| 1 | **Neon gradient blobs / aurora mesh.** Slow purple-to-teal blobs, glassmorphism on top. | Says "AI startup" and nothing else. Could be any product. BOAR has no cloud, no glow, no magic. |
| 2 | **Particle field / neural-net brain.** Dots connected by lines, a glowing brain, synapses firing. | The generic "AI is thinking" picture. BOAR's point is the opposite of mystique: it shows its measurements. |
| 3 | **Glowing 3D logo spin.** The mascot rotating on a turntable with rim light and lens flares. | Turns a friendly pig into a trophy. Also means redrawing the logo, which we don't do. |
| 4 | **Glitch / cyberpunk terminal.** Green monospace scrolling, RGB split, "hacking" vibes, matrix rain. | Reads as crypto-hacker aesthetic, which is exactly the association the project is steering away from. Also unreadable as a background. |
| 5 | **Kinetic type slamming words** ("OFFLINE." "PRIVATE." "FAST.") and **bento-grid UI mockups** of the chat screen floating in 3D. | Every launch video on X. Superlatives shouted at the viewer; the playbook says no superlatives. |

Also rejected, because it was *my* first instinct for "offline + mountain":
**topographic contour lines**. It's the default "outdoorsy" texture on Dribbble
and it says "hiking app", not "research tool that measures itself".

## Step 2: what is actually true about BOAR

Mined from MANIFESTO.md, README, docs/evidence and the playbook:

- **Offline means offline.** One download at setup, then nothing.
- **BOAR measures itself.** Every answer records model, load time, time to first
  token, tokens/sec and peak memory. "A model card isn't a benchmark."
- **Failures included.** It writes down what happened, good or bad.
- **Sources on every answer.** 4 retrieved chunks per answer.
- **Measured on a real phone**: Xiaomi, Dimensity 8300, 11.6 GB RAM.
- The mascot wears a **pith helmet**. It's an explorer. BOAR goes where there's
  no signal.

The common thread: BOAR is less like a chatbot and more like a **field
instrument**. It goes out into the world, answers, and keeps a record.

## Step 3: the concept, "The Field Recorder"

**The film is a strip-chart recorder, the kind of paper-and-pen instrument that
logs earthquakes and weather at remote stations, recording one real BOAR answer
in real time.**

Three pens write on a slowly moving roll of chart paper:

- **CH1 NETWORK.** A flat line. It never moves. That's the whole point.
- **CH2 SOURCES.** Four ticks when retrieval pulls its 4 chunks.
- **CH3 TOKENS.** One tick per generated token, like a seismogram.

**The film is drawn to scale: 1 second on screen = 1 second on the phone.** The
answer it records is the measured average from the Wikipedia Vital Articles
pack run (Qwen2.5-1.5B, Xiaomi / Dimensity 8300, 2026-09-24,
`docs/evidence/2026-09-24-vital-articles-pack/summary.txt`):

| Beat | Real number | Film time |
|---|---|---|
| Question asked | | 1.0 s |
| Sources retrieved | 4 chunks per answer | ~1.4 to 2.2 s |
| First token | TTFT avg 6.4 s | 7.4 s |
| Tokens | 17.5 tok/s avg, one tick each | 7.4 to 11.6 s |
| Answer done | 10.6 s avg per query | 11.6 s |
| Receipt stamped | peak memory 1.76 GB | ~11.8 s |
| Silence | | 11.6 to 15 s |

When the answer finishes, engineering **dimension lines** measure it on the
paper ("time to first token 6.4 s", "answer 10.6 s") and a **rubber stamp**
thumps down with the receipt. Then the paper keeps moving, the network pen
keeps drawing its flat line, and fifteen seconds later the next question comes.

The idea in one sentence: **every answer leaves a trace; the network never
does.**

### Why this is not the cliché

- There's no "AI imagery" in it at all. No glow, no brain, no chat bubbles. It's
  an analog scientific instrument, which is what the manifesto describes ("BOAR
  measures itself").
- The spectacle comes from *real data at real speed*. The token seismogram is
  17.5 ticks per second because that's what the phone did. The quiet stretch is
  quiet because nothing else happened.
- **The calm zone behind the headline is the product's argument.** The flat
  network line runs under the text. Readability and the message are the same
  design decision: silence.
- Failures and limits belong on a chart. The same paper could draw a timeout;
  the language is built for honesty, not hype.

## Graphic language

- **Material:** chart paper. Light theme = cream stock with a rust-orange grid
  (classic recorder paper, and the same orange as the pig). Dark theme = carbon
  paper: charcoal stock, warm grey grid, pale ink.
- **Type:** IBM Plex Mono for instrument labels (small caps, tracked out, like
  printed chart margins). Instrument Serif italic for the hand-annotated notes.
  Archivo Narrow for the stamp.
- **Marks:** hairline ink traces, sprocket holes along both edges, typewritten
  question, dimension lines with arrowheads, a rubber stamp with ink bleed and a
  slight rotation.
- **Logo:** the existing BOAR mascot image only (`assets/icon.png` from
  rferrari/boar-app), shown as the maker's plate on the recorder housing. Never
  redrawn.
- **Composition:** the recorder housing and the pens sit on the right, where the
  ink is fresh and the motion lives. Ink fades as the paper travels left, so the
  left side (where the landing page headline sits) is always the calmest part of
  the frame.

## Motion

- **Paper:** constant 80 px/s at 1920×1080, which means 1,200 px per loop. The
  grid (24 px / 120 px) and the paper texture tile at 1,200 px, so frame 0 and
  frame 15 s are identical.
- **Every trace is a pure function of time**, `signal(t − (penX − x) / v)`,
  with `signal` periodic over 15 s. No state, no drift, a perfect loop by
  construction.
- **Pens:** critically damped springs, so a token tick kicks and settles instead
  of teleporting.
- **Easing:** dimension lines grow with ease-out-cubic; arrowheads snap in with a
  small overshoot; the stamp lands with a back-out ease (scale 1.35 to 1,
  rotation settle), a 2-frame paper shudder and an ink-spread ring.
- **Rhythm:** 1 s of silence, a question, 6.4 s of waiting (the honest part:
  that's what the phone does), 4.2 s of fast ticks, a stamp, 3.4 s of silence.
  Quiet, busy, punctuation, quiet.
- **Housing timer:** mechanical rolling digits count the answer (0.0 to 10.6 s),
  hold, then roll back to 0.0 before the loop point.

## Copy rules applied

- Every number on screen is from the evidence files. Provenance is printed in
  the chart margin, like a figure caption.
- The example question ("how do I treat a blister?") is the manifesto's own
  example.
- Nothing financial and no endorsements implied: the film and the page talk about the app only.

## Renders

`npm run render` renders the scene (`render/scene.html`, a canvas driven by
`t`) frame by frame in headless Chrome and pipes the PNGs to ffmpeg.

- `public/media/boar-field-recorder-{light,dark}.mp4` / `.webm`: 1920×1080, 30 fps, 15 s
- `public/media/boar-field-recorder-{light,dark}-mobile.mp4`: 1080×1920
- `public/media/poster-{light,dark}.jpg` (+ mobile posters): a frame from right after the stamp
