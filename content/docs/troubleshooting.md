---
title: Troubleshooting
description: Fixes for the common BOAR problems: a model that won't load, a stalled setup download, slow answers, a phone running out of memory, voice input that's unavailable, and starting over.
section: Using BOAR
order: 30
---

## A model won't load

If a model fails to load, the chat screen says why instead of showing a raw error, with shortcuts to Settings and to the setup wizard.

- **The file is truncated or corrupted.** Usually a download that was interrupted. Delete the model in Settings → Models and download it again while online.
- **Not enough memory** ("Hardware RAM Exceeded"). Close other apps, or switch to a smaller model in Settings. The default model needs the least.
- **The architecture isn't supported.** Some models from Hugging Face use designs this build of llama.cpp can't run yet (Instella-MoE-16B is one). Pick another model.

## The setup download is stuck

Each download shows a Retry button when it has made no progress for 60 seconds. Check your connection and tap Retry. Keep BOAR open: downloads pause while the app is in the background and continue when you come back.

## Answers are slow

- **The first word takes the longest.** The model reads the retrieved passages before it writes; that's most of the wait.
- **Bigger models are slower.** On our test phone the default model wrote about 11–17 tokens a second; Phi-3.5-mini about 4 and Qwen2.5-7B under 3. See [Models](models.md).
- **Heat slows the phone down.** Over a long session speed dropped by about a third as the phone warmed up. Let it cool, and take it out of a case or the sun.
- **Deep Research is slower on purpose.** It makes several passes. Turn it off for quick questions.

## An answer stopped with "Paused — app was backgrounded"

Android pauses apps you leave. Ask again to continue, and keep BOAR in front while it answers.

## Voice input says it's unavailable

BOAR uses your phone's own speech recognizer. GrapheneOS and other phones without a system speech service don't have one, so voice isn't available there. Typing always works.

## An answer is wrong

It happens, especially on long comparisons and on arithmetic with several steps. Check the sources under the answer, ask a narrower question, or try a larger model. If you think BOAR should have got it right, [open an issue](https://github.com/rferrari/boar-app/issues) with the question and the answer; wrong answers are how the [evaluation set](benchmark.md) grows.

## Start over

- **Change setup or re-download the defaults:** Settings → App → **Re-run Setup Wizard**. Nothing else is lost.
- **Wipe everything:** Settings → App → Danger Zone → **Clear All Data & Reset App**. It deletes every model, the whole library including your own collections, and all conversations and settings, then opens the setup wizard.

> [!WARNING]
> Installing an APK signed with a different key over an existing BOAR isn't possible: Android makes you uninstall first, and that deletes the downloaded models. You'll need to download them again.
