---
title: Knowledge packs
description: Add tens of thousands of offline articles to BOAR with a knowledge pack: use the ready-made Wikipedia Vital Articles pack, or build your own from any list of Wikipedia titles.
section: Your knowledge
order: 10
---

BOAR answers from a library on the phone. It always has the built-in one: up to 5,300 short Wikipedia-derived articles, depending on the setup you picked. A **knowledge pack** adds many more in one ready-made file, with the text, a keyword index and the embeddings already built on a computer, so the phone doesn't have to index anything.

## The ready-made pack

**Wikipedia Vital Articles** adds the introductions of Wikipedia's ~50,000 [Vital Articles](https://en.wikipedia.org/wiki/Wikipedia:Vital_articles), level 5: the articles Wikipedia's editors consider most important. It's about 164 MB.

- Pick the **Encyclopedia** setup in the setup wizard, or
- download it later from Settings → Offline Knowledge Base, while online.

With this pack, the default model answered 6 of 6 knowledge questions correctly on our test phone, each from retrieved articles, including ones the built-in library doesn't cover. See [Results](results.md).

## Build your own

You need a computer with Node.js, [the BOAR repository](https://github.com/rferrari/boar-app) with `npm install` done, and an internet connection while it builds. The phone stays offline.

```bash
npm run pack:build                        # Vital Articles level 5 (~50,000 articles, 2-3 hours)
npm run pack:build -- --level 4           # level 4 (~10,000 articles, ~30 minutes)
npm run pack:build -- --titles my.txt     # your own list: one Wikipedia title per line
npm run pack:build -- --limit 200         # a quick test build
npm run pack:build -- --help              # all options
```

Or with make: `make knowledge-pack` (level 5) or `make knowledge-pack-small` (level 4).

A list of titles is the easy way to make a pack for a trip or a subject: the plants of a region, first aid, a country's history, a field of engineering.

What the builder does:

1. Gets the list of titles, from the Vital Articles lists or your file.
2. Downloads each article's introduction through the Wikipedia API.
3. Splits the introductions into passages of about 600 characters (at most 3 per article).
4. Embeds every passage with the same small model the app uses, bge-small-en-v1.5, so the phone's searches match. Computer and phone agree to a cosine similarity of 0.9999.
5. Writes one SQLite file with the passages, a keyword index and the embeddings.

Every step is cached, so if the build stops you can run the same command again and it continues where it left off. The result:

```
build/knowledge-pack/<id>.sqlite        the pack
build/knowledge-pack/<id>.sqlite.json   its size, SHA-256, article and passage counts
```

> [!NOTE]
> Wikipedia text is licensed CC BY-SA 4.0. Keep the attribution if you share a pack. BOAR keeps each passage's source link, and shows it under answers.

## Put a pack on your phone

**To test it, over USB** (with a development build of BOAR and USB debugging on):

```bash
npm run pack:push -- build/knowledge-pack/<id>.sqlite
```

It copies the file into the app and checks it. BOAR uses any valid pack in its library from the next question on.

**For everyone who installs your build,** add it to the catalog so the app can download it:

1. Upload the `.sqlite` file somewhere public, for example as a GitHub Release asset.
2. Add an entry to `CORPUS_CATALOG` in `src/models/manifest.ts` with `kind: "corpus"`, `format: "sqlite-pack"`, `filename: "corpus/<id>.sqlite"`, and the size and SHA-256 from the `.json` summary.
3. To offer it in the setup wizard, add its id to a tier's `corpusPackIds` in the same file.

## How BOAR searches a pack

For each question, the pack's keyword index picks up to 400 candidate passages, and only those are compared with the question's embedding. The results are merged with the built-in library, keeping at most two passages per article so one article can't crowd out another topic. Comparing a question with every embedding in a 100,000-passage pack would take seconds on a phone, so keywords go first.

A pack built with a different embedding model is ignored with a warning, since its embeddings wouldn't match the app's.

## Coming next

Ready-made packs for places, a shared library of packs people make, and sharing packs between phones nearby are on the [roadmap](/roadmap/).
