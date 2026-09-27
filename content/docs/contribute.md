---
title: Contribute
description: Ways to help BOAR: benchmark models on your phone, find the questions it gets wrong, build knowledge packs, and send code to the open-source Android app.
section: Project
order: 40
---

BOAR is for anyone curious about what a phone can really do. You don't need to write code to help.

## Test a model before your next trip

Found a promising GGUF model on Hugging Face? Add it from the app's model browser and [benchmark it on your phone](benchmark.md). You get load time, time to the first word, speed, peak memory and every answer side by side.

## Share your results

Different phones, different chips, different numbers. A result from your device is data nobody else has. Post it in [the Discord](https://community.boarapp.com) or in [an issue](https://github.com/rferrari/boar-app/issues) with the `.jsonl` file.

## Break it

Ask the questions a small model gets wrong. Find where search pulls in nonsense. [Open an issue](https://github.com/rferrari/boar-app/issues) with the question, the answer and the sources it showed.

## Build a knowledge pack

Make a pack for a place, a trip or a subject from a list of Wikipedia titles, and share it. See [Knowledge packs](knowledge-packs.md).

## Build the missing pieces

The bigger jobs, each one a step towards the model we're waiting for:

- **Expert-aware caching** for mixture-of-experts models that stream from storage.
- **Bigger offline knowledge packs,** and a shared library of them.
- **Better routing** between small and large models.
- **Offline voice** with a speech model that runs on the phone.
- **iOS.**

Start with [Build from source](build-from-source.md) and the open [issues](https://github.com/rferrari/boar-app/issues). The code is MIT.

## Talk to us

- [Discord](https://community.boarapp.com)
- [@boar_app on X](https://x.com/boar_app)
- [GitHub](https://github.com/rferrari/boar-app)
