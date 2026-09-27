---
title: What stays on your phone
description: BOAR uses the internet in exactly two places, both started by you. Your questions, answers, documents and measurements never leave the phone. Here is what that covers and what it doesn't.
section: Using BOAR
order: 20
nav: What stays on your phone
---

No server receives your questions. There's no account to sign into, no API behind the app and nothing that logs what you ask. That's by design, not a setting.

## The two times BOAR uses the internet

Both start only when you tap something:

1. **Downloading models and packs.** The one-time setup, and any model or knowledge pack you choose to download later from Settings. Files come from Hugging Face and from BOAR's GitHub releases.
2. **Searching Hugging Face for another model.** Settings → Tone & Model → **Find more models** sends your search words to Hugging Face's public API, and only when you search.

That's all the network code in the app. The APK asks for internet access for those two things only.

## What never leaves the phone

- Your questions and BOAR's answers.
- The library, the knowledge packs and the searches over them.
- Documents you import, and the collections made from them.
- Your conversations and their summaries.
- The measurements of every answer (model, speed, memory), unless you export them yourself.

Answering, searching, conversations, measurements and the benchmark run entirely on the phone. Airplane mode doesn't change how BOAR works; it's how we test it.

## No Google Play Services

The release build has no Google Play Services or Firebase in it, and the app never calls Google services. It works on phones without them.

## What this doesn't cover

We'd rather you know the limits:

- **Stored data isn't encrypted by BOAR yet.** Your conversations and documents sit in the app's private storage, protected like any other app's data by Android. Encrypting them with a key only you hold is on the [roadmap](/roadmap/) as *Private memory*.
- **It can't protect a phone that's already compromised.** If someone controls your phone, they can read what's on it, including BOAR's data.
- **Voice input uses your phone's speech service.** BOAR asks it to work offline; whether it does depends on the service your phone ships with. See [Voice](asking.md#voice).
- **Downloads are visible to the network you use.** Anyone watching can see that your phone fetched a model file, like any download.
- **This website isn't the app.** boarapp.com uses Google Analytics to count visits. The app has no analytics.

## Why it's built this way

Tools we depend on can be switched off, repriced, or turned into a record of what we asked. An app with no owner's server, no account and open code can't be: there's nothing to revoke and nothing to hand over. Vitalik Buterin counted locally running open-weights AI among the *sanctuary technologies*, tools built so that depending on them can't be turned against you. BOAR is our attempt at one that fits in a pocket. The [manifesto](manifesto.md) says the rest.

## Delete everything

Settings → App → Danger Zone → **Clear All Data & Reset App** deletes every downloaded model, the whole library (including your imported collections) and all conversations and settings, after asking twice. Uninstalling the app does the same.
