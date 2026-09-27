---
title: See it working
description: Videos and screenshots of BOAR on a real Android phone in airplane mode, with the default 1.5B model and answers that cite offline sources.
section: Start here
order: 30
nav: See it working
---

Everything here was recorded on a Xiaomi phone (MediaTek Dimensity, 12 GB RAM) in airplane mode, with the default model, Qwen2.5-1.5B-Instruct. Nothing left the phone.

## The walkthrough

<div class="feature-video">
  <video controls preload="none" playsinline poster="/docs/media/boar_demo_small.jpg" src="/docs/media/boar_demo_small.mp4" aria-label="BOAR demo walkthrough, 4 minutes"></video>
</div>

Four minutes, start to finish: airplane mode on, a first question with sources, a research prompt, a follow-up and a few facts. It was also [posted on X](https://x.com/arferrari/status/2103677576380387484).

## Four clips

<div class="clips">
  <figure><video controls preload="none" playsinline poster="/docs/media/1-offline-first-question.jpg" src="/docs/media/1-offline-first-question.mp4" aria-label="Offline, first question"></video><figcaption><b>Offline, first question</b> (0:35). Airplane mode on; a question answered with sources from the offline library.</figcaption></figure>
  <figure><video controls preload="none" playsinline poster="/docs/media/2-prompt-idea.jpg" src="/docs/media/2-prompt-idea.mp4" aria-label="A research prompt"></video><figcaption><b>A research prompt</b> (1:17). A ready-made synthesis question from Prompt Ideas.</figcaption></figure>
  <figure><video controls preload="none" playsinline poster="/docs/media/3-follow-up-context.jpg" src="/docs/media/3-follow-up-context.mp4" aria-label="Follow-up"></video><figcaption><b>Follow-up</b> (1:21). "Interesting, continue": the answer picks up from the conversation so far.</figcaption></figure>
  <figure><video controls preload="none" playsinline poster="/docs/media/4-facts-and-math.jpg" src="/docs/media/4-facts-and-math.mp4" aria-label="Facts and math"></video><figcaption><b>Facts and math</b> (0:38). The capital of Australia from the Wikipedia pack, then 7×8.</figcaption></figure>
</div>

## Screens

<div class="shots">
  <figure><img src="/docs/media/01-offline-answer-sources.webp" alt="An answer with its offline sources listed under it" width="540" height="1200" loading="lazy"><figcaption><b>Answers with sources.</b> Every answer lists the offline articles it used and how well each matched. The OFFLINE badge and the airplane icon are real.</figcaption></figure>
  <figure><img src="/docs/media/03-prompt-ideas.webp" alt="Prompt Ideas: ready-made research questions" width="540" height="1200" loading="lazy"><figcaption><b>Prompt Ideas.</b> Ready-made research questions to try the app with.</figcaption></figure>
  <figure><img src="/docs/media/02-menu.webp" alt="The menu with past sessions, documents, settings and telemetry" width="540" height="1200" loading="lazy"><figcaption><b>Menu.</b> Past sessions, your own documents, settings and telemetry. RAM and disk use are always visible at the bottom.</figcaption></figure>
  <figure><img src="/docs/media/04-models.webp" alt="Installed models" width="540" height="1200" loading="lazy"><figcaption><b>Models.</b> The default model and the embedding model, plus optional ones you can switch to with one tap.</figcaption></figure>
  <figure><img src="/docs/media/05-more-models.webp" alt="More models and a Hugging Face search" width="540" height="1200" loading="lazy"><figcaption><b>Bring your own model.</b> Mixture-of-experts and Gemma models tested on this phone, and a search for any GGUF model on Hugging Face.</figcaption></figure>
  <figure><img src="/docs/media/06-telemetry.webp" alt="Execution telemetry for each answer" width="540" height="1200" loading="lazy"><figcaption><b>Execution telemetry.</b> Every answer is measured: tokens per second, time to first token, peak memory. Export as JSON or CSV.</figcaption></figure>
  <figure><img src="/docs/media/07-memory-storage.webp" alt="Memory and storage use" width="540" height="1200" loading="lazy"><figcaption><b>Memory and storage.</b> The app's RAM use against a 12 GB limit, and its storage against a 50 GB budget.</figcaption></figure>
  <figure><img src="/docs/media/08-benchmark-engine.webp" alt="The last benchmark and the engine in use" width="540" height="1200" loading="lazy"><figcaption><b>Engine.</b> The last answer's numbers, and the model, context size, threads and license in use (llama.cpp through llama.rn).</figcaption></figure>
</div>

## Measured on the phone

Six knowledge questions with the default model and the Wikipedia Vital Articles pack (2026-09-24): 6 of 6 answered correctly, all from retrieved articles, about 10.6 seconds per answer (6.4 s to the first word, 17.5 tokens a second), 1.76 GB peak memory. The full numbers are in [Results](results.md), and you can [run the same benchmark](benchmark.md) on your phone.
