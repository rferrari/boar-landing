---
title: Benchmark your phone
description: Run BOAR's 17-question evaluation on your own Android phone with one command, and get time to first token, tokens per second, peak memory and every answer side by side.
section: Models
order: 20
---

BOAR can benchmark any installed model on a real phone. It records the same measurements for every answer, straight from the phone: load time, time to the first word, speed, total time, peak memory, and which articles it retrieved.

## On the phone

Menu → **Execution Telemetry** → **Evaluate**. Tick the models (and adaptive routing, if you want it), tap **Run**, and export the results as JSONL or CSV through the share sheet when it's done.

## From a computer, with one command

The recommended way: the computer checks the phone, starts the run, waits and prints a report. Nothing to tap.

```bash
npm run eval:device -- --models lfm2.5
```

```
✓ device SSYLAQFILNBEKBEQ
✓ Metro running, adb reverse tcp:8081 set
  [00:20] 0/17 — model:hf-liquidai-lfm2-5-8b-a1b-… / greeting-1
  [01:52] 3/17 — model:hf-liquidai-lfm2-5-8b-a1b-… / explanation-1
  …
BOAR Device Evaluation (set v1, 17 queries)
  Queries:    17 ok · 0 failed · 0 cancelled (of 17)
  TTFT:       avg … · p50 …
  Tokens/sec: avg … · p50 …
  Peak RSS:   … GB
Raw results (authoritative): eval-results/2026-09-24/eval-….jsonl
```

### Set up once

1. **On the computer:** Node.js with `npm install` done in [the BOAR repo](https://github.com/rferrari/boar-app), and `adb` on your `PATH`.
2. **On the phone:** Developer options → USB debugging on. Connect the cable and allow it. `adb devices` should list the phone as `device`.
3. **A development build of BOAR** on the phone (`npx expo run:android`, or `npm run eval:device -- --install`). Release builds can't be driven this way, on purpose.
4. **Metro running** in another terminal: `make start`.
5. **The models downloaded** in the app. The tool never downloads models.

### Commands

```bash
npm run eval:device                                   # every installed model + adaptive routing
npm run eval:device -- --models qwen2.5-1.5b,phi-3.5  # some models (id or part of it)
npm run eval:device -- --queries greeting-1,reasoning # some questions, by id or category
npm run eval:device -- --dry-run                      # print every adb command, run nothing
npm run eval:summary -- --answers <file.jsonl>        # answers side by side, for grading
```

Results land in `eval-results/<date>/`: the `.jsonl` (one row per answer, the source of truth), the answers side by side in `.answers.md`, and the final status.

## The 17 questions

The set covers what a research companion has to do, including what a small model usually gets wrong: greetings, facts, explanations, comparisons, syntheses, multi-step reasoning, questions grounded in a specific article, and questions the library has nothing on. A few examples:

| Kind | Question |
|---|---|
| reasoning | A train leaves at 3:40 pm and the trip takes 2 hours and 35 minutes. What time does it arrive? |
| synthesis | How does the immune system's response to a pathogen relate to how a vaccine works? |
| comparison | Compare the French Revolution and the Industrial Revolution. |
| no library content | Who was Napoleon Bonaparte? (the built-in library only has "Randy Napoleon", which must not be cited) |

The full set, with what a good answer contains, is in [`docs/EVAL_QUERIES.md`](https://github.com/rferrari/boar-app/blob/main/docs/EVAL_QUERIES.md). There's no automatic judge: you grade the answers by reading them.

## Tips for fair numbers

- **Keep the screen on and BOAR open.** A locked phone sends BOAR to the background.
- **Mind the heat.** Speed dropped by about a third over a 66-minute run as the phone warmed up. Compare models from runs in similar conditions.
- **Don't start a run during a model download.** The run reloads the app, and the download would stop.
- **Answers vary a little between runs** (temperature 0.7). Timings compare well; for quality, look at more than one run.
- **A model that fails to load is recorded, not skipped.** Every question gets a failure with the reason.

## Share your results

Different phones, different chips, different numbers. Post yours in [the Discord](https://community.boarapp.com) or [open an issue](https://github.com/rferrari/boar-app/issues) with the `.jsonl` attached.
