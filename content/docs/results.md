---
title: Results
description: BOAR's measured results on a real Android phone: answer times, tokens per second, memory and accuracy for five offline models, with the failures and the raw files.
section: How it works
order: 20
---

Every number here comes from one phone: a **Xiaomi 2311DRK48G** (MediaTek Dimensity 8300, 11.6 GB RAM, Android 16), running BOAR's own evaluation. The raw files are in [`docs/evidence`](https://github.com/rferrari/boar-app/tree/main/docs/evidence), and you can [run the same thing on your phone](benchmark.md).

## With the Wikipedia pack, the default model

Six knowledge questions with Qwen2.5-1.5B and the Wikipedia Vital Articles pack (2026-09-24):

| Measure | Result |
|---|---|
| Answered correctly | 6 of 6, each from retrieved articles |
| Time to the first word | 6.4 s on average |
| Writing speed | 17.5 tokens a second on average |
| Whole answer | 10.6 s on average |
| Peak memory | 1.76 GB |
| Network | none |

That included questions the built-in library can't answer, like Napoleon's dates.

## Five models, 17 questions each

The baseline run, 2026-09-24, same phone, a 512-token answer budget and a 120-second limit per step. Medians:

| Model | Tokens a second | First word | Whole answer | What happened |
|---|---|---|---|---|
| Qwen2.5-1.5B (default) | 11.4 | 13.6 s | 21.0 s | 17 of 17, no timeouts |
| Adaptive routing | 11.4 | 14.1 s | 25 s | picks the model per question |
| LFM2.5-8B-A1B (mixture of experts) | 14.8 | 27.2 s | 57.3 s | the only model to solve the RAM question; 4 of 17 ran out of answer budget |
| Phi-3.5-mini | 4.0 | 44.0 s | 73.1 s | the most complete comparisons; 4 timeouts |
| Qwen2.5-7B | 2.7 | 70.5 s | 107.1 s | 5 timeouts |
| Instella-MoE-16B-A3B | – | – | – | didn't load: architecture not supported yet |

LFM2.5 ran separately with the same 17 questions. The highest peak memory of any run was 5.21 GB, under the 12 GB limit.

## What went wrong

We publish the failures because they're where the work is:

- **Arithmetic with several steps.** Every model except LFM2.5 missed the RAM-budget question.
- **Invented citations,** especially from Phi-3.5-mini.
- **Timeouts.** Nine answers were cut off by the 120-second limit in the baseline.
- **Reasoning that runs out of room.** LFM2.5 thinks before it answers, and with a 512-token budget four answers ended before the final line.
- **Heat.** Speed fell by about a third over a 66-minute run.

## Not measured yet

- **BOAR against internet search plus a frontier model.** The bar people care about ("more than half as good") hasn't been tested. We won't claim it until it is.
- **GrapheneOS on real hardware.**

## Where these numbers come from

The same code runs every evaluation, on the phone or from a computer, and writes one JSON line per answer. The JSONL files are the source of truth; reports and tables are made from them. If our numbers look wrong on your phone, [send us yours](benchmark.md#share-your-results).
