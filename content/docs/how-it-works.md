---
title: How it works
description: How BOAR runs AI offline on Android: llama.cpp on the phone, hybrid keyword and embedding search over a SQLite library, a one-time model download, and no network code in chat.
section: How it works
order: 10
---

BOAR is a React Native app with three parts that all run on the phone: a language model, a search over a local library, and the glue that turns what the search finds into a prompt. There's no server.

## The pieces

| Part | What it is |
|---|---|
| App | Expo (React Native), built as a custom development client, because it needs native modules |
| Model runtime | [llama.cpp](https://github.com/ggml-org/llama.cpp) through [llama.rn](https://github.com/mybigday/llama.rn): GGUF models, weights memory-mapped from storage, no Google services |
| Answer model | Qwen2.5-1.5B-Instruct by default, or any GGUF you add |
| Search | SQLite with FTS5 for keywords, plus bge-small-en-v1.5 embeddings for meaning |
| Storage | models, the library and conversations in the app's private storage |

## From question to answer

1. **Decide whether to search.** Greetings, arithmetic, translation and code go straight to the model.
2. **Search two ways at once.** A keyword search (BM25 over FTS5) and a meaning search (the question's embedding compared with the passages') run over the built-in library, any knowledge packs and your collections. In a large pack, keywords pick up to 400 candidates first, so the phone doesn't compare the question with every passage.
3. **Pick the best passages**, at most two per article so one topic can't crowd out another, and send the top four to the model.
4. **Build the prompt** with the passages, a short summary of the conversation so far and the most recent turns, in the model's chat format where BOAR uses it (the default model's, and every model's in the benchmark).
5. **Stream the answer** word by word, then list the sources and record the measurements.

Most of the wait before the first word is the model reading those passages, which is why BOAR sends four rather than six.

## The one-time setup

The APK stays small (123 MB) and carries no model. On first launch, BOAR checks whether the answer model and the embedding model are on the phone; if not, it shows the setup wizard instead of the chat. The wizard downloads both, checks each file's size against the catalog, and only then opens the chat. From that point on, answering never touches the network.

For a build that never needs the network at all, there's an alternative that bakes the models into the APK, at the cost of a much larger file. It isn't the default.

## Rules the code keeps

1. **No Google Play Services or Firebase** in the release build.
2. **Network code in two places only:** the model and pack downloader, and the Hugging Face model search. Both run only when you tap them. Chat, search and the model have no network calls. See [What stays on your phone](privacy.md).
3. **Memory and storage on screen.** A bar shows the app's real memory use and storage, so the limits can be checked on the phone, not just claimed.

## Limits it's built within

BOAR started as an entry for a bounty with hard limits: at most 12 GB of memory while answering, at most 50 GB on disk for the app, models and library, no Google Play Services, and a real phone rather than an emulator. The default model peaked at 1.8–3.1 GB of memory across our runs and the default setup takes about 1.2 GB of storage; the largest optional model peaked at 5.2 GB.

## Read the code

- [`ARCHITECTURE.md`](https://github.com/rferrari/boar-app/blob/main/ARCHITECTURE.md): the design and directory layout.
- [`docs/MODELS.md`](https://github.com/rferrari/boar-app/blob/main/docs/MODELS.md): every model, dataset and index, with sources and licenses.
- [`src/rag/`](https://github.com/rferrari/boar-app/tree/main/src/rag): search and prompt assembly.
