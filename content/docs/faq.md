---
title: FAQ
description: Answers to common questions about BOAR: does it really work offline, is it private, how accurate and fast is it, which phones run it, and does it work on iPhone or GrapheneOS.
section: Project
order: 10
faq: true
---

## Offline

### Does BOAR really work without internet?

Yes, after one download at setup. The first launch downloads the model and library (about 1 GB). After that, BOAR answers in airplane mode with Wi-Fi and data off: searching, answering and conversations all run on the phone. We test it that way.

### When does it use the internet?

Only when you download a model or pack, and when you search Hugging Face for another model. Both start when you tap them. See [What stays on your phone](privacy.md).

### How is this different from other offline AI setups?

Many "local" setups run the model on a computer at home and reach it over the internet. BOAR runs on the phone itself, with no server, no tunnel and no account. It also comes with a library to answer from, and shows its sources.

## Privacy

### Does anyone see my questions?

No server receives them. Your questions, answers, documents and conversations stay on the phone. BOAR doesn't encrypt what it stores yet, so anyone who controls your unlocked phone could read it; encryption is on the roadmap.

### Does it need a Google account or Play Services?

No. The release build has no Google Play Services or Firebase, and there's no account of any kind.

## Quality

### How accurate is it?

It depends on the question and the model. With the Wikipedia pack, the default model got 6 of 6 knowledge questions right on our test phone, each from retrieved articles. It's weaker on long syntheses and multi-step arithmetic, and small models can invent citations. Every answer shows its sources so you can check. See [Results](results.md).

### Is it as good as ChatGPT?

No, and we don't claim it is. It's a 1.5-billion-parameter model on a phone, with a library. It's for when you can't reach the internet, or don't want to send the question. Comparing it with internet search plus a frontier model is on our list, not done.

### Can I use it for medical or emergency questions?

It can tell you the signs of hypothermia or how to help someone who is choking, from its library, with sources. But it's a companion, not a doctor or a rescue service. Get real help as soon as you can reach it.

### What languages does it speak?

The library and search are in English for now. The menus are in English and Portuguese. Some models can answer in other languages, but they'll be searching an English library.

## Phones

### Which phones does it run on?

Any 64-bit ARM Android phone. It's tested on a Xiaomi with a MediaTek Dimensity 8300 and 11.6 GB of RAM, where the default model peaked at 1.8–3.1 GB of memory. Bigger optional models need more memory; BOAR shows a hint before you download one.

### Is it fast enough?

With the default model, most answers took 10–21 seconds on our test phone: a few seconds before the first word, then about 11–17 tokens a second. Bigger models are slower. See [Models](models.md).

### Will it drain my battery or fill my phone?

It works the processor hard while it answers, and the phone warms up; between questions it's idle. The default setup takes about 1.2 GB of storage, plus 164 MB for the large Wikipedia pack.

### Does it work on iPhone?

Not yet. iOS is in progress; see the [roadmap](/roadmap/).

### Does it work on GrapheneOS?

It has no Google dependency, so it should, but we haven't run it on GrapheneOS hardware yet. Voice input won't work there, because GrapheneOS has no system speech service. Typing works.

## The project

### Is it free?

Yes. BOAR is open source under the MIT license, and has no subscription, ads or account.

### Who makes it?

BOAR is built by [@arferrari](https://x.com/arferrari) with [SOPA](https://sopa.team). It started as claim #124 on [poidh bounty #31](https://poidh.xyz/mainnet/bounty/31), "Build the Best Offline AI Research App for Android". The bounty is still open.

### Why does this matter?

Tools we depend on can be switched off, repriced, or turned into a record of what we asked. Vitalik Buterin counts locally running open-weights AI among the *sanctuary technologies* that can't be. BOAR tries to be one you can carry. Read the [manifesto](manifesto.md).

### How can I help?

Test a model on your phone and share the numbers, ask the questions it gets wrong, build a knowledge pack, or send code. See [Contribute](contribute.md).
