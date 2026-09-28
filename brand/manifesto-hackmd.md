---
title: "Knowledge you can carry: the BOAR manifesto"
tags: boar, offline-ai, sanctuary-technology, local-first, solarpunk, open-source
description: Why BOAR keeps a small AI and a library on your phone, with no owner and no server between you and your questions.
---

# Knowledge you can carry

*A manifesto for AI that lives with you, answers without asking anyone's permission, and belongs to no one.*

[TOC]

:::info
**BOAR in one line.** A small AI and a library that live on your phone. It answers with no signal, shows its sources and measures itself on a real phone. Open source (MIT). No account, no API, no server that hears your questions.
:::

## Why this exists

Most AI lives somewhere else. Your question leaves your phone, lands on a server you'll never see, and an answer comes back if everything along the way agrees.

That works until it doesn't. On a trail. In a mountain hut. When a storm takes the towers down. When the service changes its price, its terms or its mind.

BOAR is a different bet. Keep the model and the library in your pocket, and the answer no longer depends on anyone else being up, reachable or willing.

It started as claim #124 on poidh bounty #31, and the bounty is still open. The bounty was the spark, not the point. BOAR is an idea that grows, not a finished app. The first release runs on Android today. More platforms come next.

## Tools with no owner

Some tools are built so that depending on them can't be turned against you. The family has a name: *sanctuary technology*, open infrastructure without an owner. In a public post in March 2026, Vitalik Buterin put locally running open-weights AI on that list, next to tools like Signal. The list is his. What we build on the idea is on us.

A sanctuary tool can fail in two ways.

- **Control.** Whoever runs it can switch it off, reprice it or rewrite the terms.
- **Exposure.** Just using it leaves a trail that can be used against you.

BOAR is built to pass both tests. The code is MIT. The APK is yours to keep. The models are open weights. There's no subscription to cancel and no account to suspend. And because no server receives your questions, there's nothing on our side to log, sell, train on or hand over.

## Offline means offline

One download at setup, about 1 GB. Then nothing. Put the phone in airplane mode and BOAR still answers, from a library that sits on the device.

The app uses the internet in exactly two places, both started by you: downloading models and packs, and searching Hugging Face for another model. The docs list them. Not "mostly local". Not "offline except when it matters".

A small model makes mistakes. It can misread a source. We've caught one inventing citations. So BOAR answers from its library and shows the articles it used, so you can check. We publish the failures too.

It isn't the frontier, and it doesn't need to be. With the default model, a typical answer took 10 to 21 seconds on our test phone (Dimensity 8300, medians from two runs). That's enough to learn how to treat a blister when nobody's around to ask. Useful now beats perfect later.

## No server hears your questions

Some questions you'd rather not send anywhere: a health worry, a legal problem, a client's document. With BOAR they stay on your phone. Nothing to sign into, nothing logged, nothing to revoke. The app has no analytics, and no telemetry leaves the phone.

That should be the default, not a setting.

:::warning
**The limit, in the same breath.** BOAR doesn't encrypt what it stores yet. Your conversations and documents sit in the app's own storage, protected by the phone like any other app's data. Encrypting them with a key only you hold is on the roadmap as *Private memory*. And no app can protect a phone that's already compromised.
:::

## Knowledge that moves person to person

Knowledge shouldn't need a data center to travel. It can move the way it always has: person to person.

BOAR's library is built from packs: files of articles, a search index and embeddings, which anyone can build with the open-source builder. Today you can import your own notes, manuals and data, then export any collection as a plain JSON pack and hand it over any way your phone can send a file: a cable, a file manager, Bluetooth through the share sheet.

The road ahead: sharing packs between phones nearby from inside the app, over Bluetooth or local Wi-Fi, with no internet in between. And a shared library of packs that people make, check and pass on. A guide's trail notes. A town's list of pharmacies. A commons, not a catalog someone owns.

## A garden, not a tower

We want a future that looks more like a garden than a tower. Tools that work in daylight and in the field, that you can repair and run where you are, owned by the people who use them.

Resilience isn't a bunker. It's a neighbor who knows things, a shelf of books in a mountain hut, seeds saved for next year. BOAR tries to be that kind of tool: one that keeps working off-grid, in the garden, in a storm, when the towers are down. A companion when there's no one to ask, never a rescue service.

Abundance over extraction. A pack copied is not a pack lost. A model downloaded once answers a thousand questions without asking anyone. Things that grow from roots are harder to switch off.

## The right to think without asking permission

When AI lives only on remote servers, whoever runs them holds a switch. The service can be turned off, repriced, filtered, watched, or compelled to hand over what it holds. None of that needs a villain. It's what concentration does: when one place holds the questions of millions, it becomes a lever, and levers get pulled.

We don't think the answer is to fight any company or any government. It's to make sure no single party is the only door. Local, open, ownerless tools are a counterweight. They keep a piece of the world that works without permission: a person, a phone, a library, a question.

Call it de-totalization: not everything has to run through the center. Looking something up shouldn't require an account. Thinking shouldn't require a license. This isn't about hiding. It's about not having to ask.

## What we believe

1. **Offline means offline.** One download at setup, then nothing.
2. **No owner.** Open code, open weights, no account, no switch in someone else's hand.
3. **No server between you and your questions.** Privacy by default, not a setting.
4. **Show the sources.** Every answer says where it came from, so you can check it.
5. **Measure, don't hype.** Real phones, real numbers, failures published.
6. **Useful now beats perfect later.**
7. **Knowledge is a commons.** Packs are files anyone can build, check and pass on.
8. **Say the limit in the same breath.**
9. **It should be fun.** Watching a new model boot on your phone is the good part.

## What we are building

:::success
**Today, in the first release (Android):**
- A small open-weights model and a searchable library on your phone, answering in airplane mode after one download.
- The sources under every answer.
- The receipt: model, time to first word, speed and memory, recorded for every answer.
- Your own documents as collections, exportable as plain JSON packs.
- Any GGUF model you choose, and a benchmark you can run yourself.
- An optional Wikipedia pack: about 50,000 article introductions for 164 MB. English library and search for now.
:::

**Next, as a direction and not a schedule:**
- iOS is in progress, and more platforms after that.
- Offline voice, and packs for places you can download before a trip.
- Packs shared between phones nearby, and a community library of packs.
- *Private memory:* encrypting what BOAR stores with a key only you hold.
- An essentials library: offline bundles for first aid, disaster response and growing your own food.
- A place to land for the model we're still waiting for: a large mixture-of-experts model running from a phone's storage.

Shipped features are roots, not the whole tree.

## Join us

- **Test a model before your next trip.** Pull a GGUF from the model browser and benchmark it with `npm run eval:device -- --models <model>`. Your phone's numbers are data nobody else has.
- **Build a pack.** Your trail, your clinic, your town. Share it and tell us what worked.
- **Break it.** Ask the questions a small model gets wrong. Open an issue with the output.
- **Contribute.** Code, docs, benchmarks. It's all in the open.

Site: <https://boarapp.com> · Docs: <https://boarapp.com/docs> · Code: <https://github.com/rferrari/boar-app>

---

Keep your phone charged, pack BOAR, and go somewhere without signal. Bring a pack for a friend.

🐗
