---
title: Models
description: The default model BOAR runs offline on your phone, the optional models measured on a real device, how to pick one, and how to download any GGUF model from Hugging Face.
section: Models
order: 10
---

BOAR runs GGUF models with llama.cpp, on the phone's own processor. It downloads one at setup, and you can add others.

## The default: Qwen2.5-1.5B

[Qwen2.5-1.5B-Instruct](https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct) (Alibaba, Apache-2.0), quantized to Q4_K_M, about 0.99 GB. It's the quickest of the models BOAR offers and the one that answers every question in our evaluation within the time limit. It's good at plain questions and explanations, and slips on long syntheses.

Alongside it, setup downloads [bge-small-en-v1.5](https://huggingface.co/BAAI/bge-small-en-v1.5) (BAAI, MIT, about 35 MB). It doesn't write answers: it finds passages in the library by meaning.

## Optional models, measured

Each of these is in Settings → Models, and was run on our test phone (Xiaomi 2311DRK48G, MediaTek Dimensity 8300, 11.6 GB RAM) over the same 17 questions:

| Model | Size on disk | License | Speed | Median answer | What we saw |
|---|---|---|---|---|---|
| Qwen2.5-1.5B (default) | 0.99 GB | Apache-2.0 | 11.4 tok/s | 21 s | fast; fine on simple questions, slips on synthesis |
| LFM2.5-8B-A1B | 5.16 GB | LFM Open License v1.0 | 14.8 tok/s | 57 s | 8B in total, ~1.5B active per word; the only one to solve the RAM question, but thinks so long that 4 of 17 answers ran out of room |
| Phi-3.5-mini | 2.39 GB | MIT | 4.0 tok/s | 73 s | the most complete comparisons; slow; invents citations |
| Qwen2.5-7B | 4.68 GB | Apache-2.0 | 2.7 tok/s | 107 s | accurate, often too slow to finish |
| Gemma 4 E4B | 5.15 GB | Apache-2.0 | not measured yet | – | loads and answers |

Speed is tokens a second (a token is roughly three quarters of a word). The full runs are in [Results](results.md).

## Which one to use

- **Everyday questions, on any phone:** the default.
- **Harder reasoning, if you can wait:** LFM2.5-8B-A1B. It's a *mixture of experts*: a large model whose parameters mostly sit unused, with a small part waking for each word, so it writes as fast as the 1.5B model while carrying 8B parameters of knowledge.
- **Careful comparisons, with time to spare:** Phi-3.5-mini, and check its citations.

The model list shows a green, yellow or red hint for whether a model is likely to fit your phone's memory. It's an estimate from the file size, not a guarantee.

## Let BOAR choose

With **Adaptive Routing** on (Settings), BOAR classifies each message and picks which of your downloaded models answers it: a light one for small talk, a stronger one for research. It only routes between models you've downloaded.

## Find more models on Hugging Face

Settings → Tone & Model → **Find more models** searches Hugging Face for GGUF files. Tap a file to add it to your model list, then download it like any other.

> [!WARNING]
> Nobody has checked these models on a phone. Before downloading, read the model's Hugging Face page: its size (it has to fit in memory), its license and its quantization. BOAR checks a downloaded file's size, not its full checksum.

This search is one of the two times BOAR uses the internet, and it only runs when you search. See [What stays on your phone](privacy.md).

## Switching models

Pick a model in Settings to make it active. BOAR unloads the previous one before loading the next, so memory doesn't pile up. The first answer after a switch takes longer while the model loads.

## Test a model yourself

Found a promising model? [Benchmark it on your phone](benchmark.md) and share the numbers: a result from your device is data nobody else has.
