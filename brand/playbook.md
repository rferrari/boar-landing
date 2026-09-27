# BOAR playbook

How BOAR talks about itself: what it stands on, who it's for, what we can claim, and how it sounds. It governs the landing page, the docs, the blog, social posts, token posts and the portal's campaign drafts. When a sentence here and a sentence elsewhere disagree, this file wins, and the other one gets fixed.

**This file is alive.** Whenever we learn something about the idea, its people, its voice or what we can claim, it goes in here the same day, with a line in the changelog at the end. Sources are listed in section 11; the claims ledger (section 5) is the part to check before anything ships.

---

## 0. BOAR is an idea that grows

BOAR isn't a finished app. It's an idea, **knowledge you can carry**: an AI and a library that live with you, answer when the network doesn't, belong to no one, and are measured honestly. The app is the first shape that idea has taken, and it will keep changing.

So in everything we write:

- **Lead with the idea and its values, then the proof.** "AI that works when the network doesn't" first; "v1.0.0 answered 6 of 6 with the Wikipedia pack" as evidence that it's real.
- **Never describe the current app as the final form.** Say "today", "so far", "the first release", "next". Shipped features are roots, not the whole tree (the roadmap's own image).
- **Don't define BOAR by a platform.** It runs on Android today and it will run on more. Say "on your phone" in brand, token and pitch copy; name the platform only where people need the fact (install steps, download buttons, test-device specs).
- **Numbers are snapshots.** Always give their date and conditions, and expect them to change.

The values that stay while everything else changes: offline means offline; no owner, no server between you and your questions; show the sources; measure, don't hype; open and reproducible; it should be fun.

---

## 1. One line

**BOAR keeps a small AI and a library of knowledge on your phone, so it still answers when the signal is gone, shows where each answer came from, and measures itself on a real phone. Open source, and growing in public.**

Short forms, in order of preference:

- Knowledge you can carry.
- Offline AI on your phone. No signal needed.
- A small AI and a library that live on your phone.
- For a 200-character field (the Morpheus subnet, a bio): "Offline AI: a small model and a knowledge library on your phone. Answers with no signal, shows its sources, no account, no server. Open source, growing in public."

## 2. What we stand on: sanctuary technology

In March 2026 Vitalik Buterin named four technologies that let people do more without asking permission: Starlink, **locally running open-weights LLMs**, Signal and Community Notes. He called this family *sanctuary technology*: free, open-source tools that let people live, work, talk, manage risk and cooperate, "optimized for robustness to outside pressures". Its purpose is to keep any one party from gaining total control, so people can depend on each other in ways that can't be turned against them.

A later paper put the idea as a test: a sanctuary technology is open infrastructure *without an owner*, designed so that *dependence on it cannot be weaponised*. It names two ways to fail:

1. **Control.** Whoever runs the mechanism can switch it off, reprice it or change its terms.
2. **Exposure.** Just using it leaves a trail that can be used against you.

ethereum.org adds the privacy half: privacy should be the default, not a setting, and systems should be built so there's no central point where data gets extracted.

**How BOAR passes the test, in plain words:**

| The test | What BOAR does | Proof we can point to |
|---|---|---|
| No owner can switch it off | MIT-licensed code, an APK you keep, open-weights models, no account | the repo, the release, `LICENSE` |
| Nothing to reprice | no API, no subscription, no server | no network code in chat, retrieval or inference (`ARCHITECTURE.md`, "Non-negotiables") |
| No exposure from using it | no server receives your questions, so there's nothing to log or train on | same; tested in airplane mode (`docs/demo`) |
| Robust when things break | one download at setup, then it works with no network at all | the airplane-mode demo and the on-device benchmarks |
| People can rely on each other | knowledge packs are plain files anyone can build, share and rebuild on their own phone | `docs/KNOWLEDGE_PACKS.md`, portable collections |

**How to use this idea:** as the *why*, in the manifesto band, the docs, the blog and long posts about the app. Not as a headline. Say what BOAR does ("no server receives your questions"), then let the reader connect it to the bigger idea. Credit Vitalik with the list, never with an endorsement. And never in anything about $BOAR (section 9).

## 3. Who it's for

We look for the people for whom BOAR is exactly the right tool and a cloud service can't be:

1. **People going where the signal doesn't:** travel, trails, huts, boats, flights, tunnels, fieldwork, rural areas. *The moment you can't look things up.*
2. **The underconnected.** Billions of people don't have reliable or affordable internet. A phone they already own should still be useful.
3. **People with questions they'd rather not send to a server:** health worries, legal and money questions, personal problems, client or work documents. They want an answer without creating a record.
4. **Local-AI builders and tinkerers.** They want real numbers from a real phone, their own GGUF models and their own packs, and they'll run the benchmark and report back.
5. **People preparing for outages.** Storms, floods, power cuts, network shutdowns. BOAR is a companion here, never a rescue service (see 5).

## 4. What we say: five pillars

Every piece of copy should land at least one of these, with its proof.

1. **It works without signal.** One download at setup, then airplane mode is fine. *Proof:* the demo, filmed in airplane mode; the benchmark's `network: none`.
2. **No server hears your questions.** Nothing to sign into, nothing logged, nothing to revoke. *Proof:* the network map in the docs (exactly two places the app ever uses the internet, both started by you).
3. **It shows its sources.** Every answer lists the offline articles it used, so you can check it. *Proof:* screenshots; source chips.
4. **It's measured, not hyped.** Every answer records model, time to first word, speed and memory, and we publish the failures too. *Proof:* `docs/evidence`, the receipt section.
5. **It's yours.** Open source, your own documents, your own model, packs you can pass on. *Proof:* MIT, import, the model browser, portable collections.

## 5. The claims ledger

Read this before anything ships. Left column: what you can say. Right column: what you can't, and why.

| Say | Don't say | Why |
|---|---|---|
| "works offline after a one-time download" | "works 100% offline, no internet ever" | setup downloads about 1 GB; the model browser searches Hugging Face when you ask it to |
| "no server receives your questions" / "your questions stay on your phone" | "private", "secure", "encrypted", "anonymous" on their own | the app doesn't encrypt what it stores yet (on the roadmap as *Private memory*); it can't protect a phone that's already compromised |
| "shows the sources it used, so you can check" | "accurate", "verified answers", "no hallucinations" | small models still make mistakes and can misread a source; we've seen invented citations |
| "a companion when there's no one to ask" | "emergency guidance", "medical advice", "survival tool" | the site's own line: "a companion, not a doctor or a rescue service" |
| real numbers with their conditions ("17.5 tok/s on a Dimensity 8300, Qwen2.5-1.5B") | "fast", "instant", "blazing", uncited speeds | speed depends on the phone, the model and heat; tokens/s fell about a third over a long run |
| "the questions a small model gets wrong, and what we measured" | "as good as ChatGPT", "frontier quality" | comparing against internet search plus frontier models is still *not measured* |
| about the app and the idea: "Vitalik named local open-weights AI as sanctuary tech"; "Vitalik asked for a research tool that works with no signal" | "backed by", "endorsed by", "Vitalik's app"; details of his support we haven't made public | cite what he said in public, nothing more |
| about $BOAR: nothing about Vitalik at all | any Vitalik mention, quote or allusion next to the token | Vitalik supports the app, not the token. Putting his name near $BOAR borrows his reputation to sell it |
| "claim #124 on poidh bounty #31; the bounty is still open" | "won", "winner", "official" | it hasn't been decided |
| "English library and search for now; menus in English and Portuguese" | "multilingual" | retrieval uses an English-only embedding model |
| "voice input where the phone has an offline speech service" | "offline voice" as a shipped feature | it depends on the phone's speech service and doesn't work on GrapheneOS; true offline voice is roadmap |
| "any 64-bit ARM Android phone"; "tested on a Xiaomi with 11.6 GB RAM" | "runs on any phone", "GrapheneOS-ready" | GrapheneOS on real hardware is not run yet |
| "on your phone"; "on Android today, more platforms coming" | "an Android app" as what BOAR *is* | BOAR is an idea that will run on more than one platform (section 0) |
| "the first release", "so far", "next" | "the complete", "finished", "the final version" | the app is the first shape of the idea, not the last |
| "born from poidh bounty #31; claim #124" | "made for the bounty" as the whole story | the bounty is the origin, not the purpose |

The website isn't the app: boarapp.com uses Google Analytics; the app has no analytics and no telemetry leaves the phone. If someone asks, say both.

## 6. Objections, answered honestly

These are what people who actually run local AI complain about. Answer them before they're asked: in the FAQ, the docs and replies.

- **"Small models get facts wrong."** True. That's why BOAR answers from a library and shows the articles it used, and why we publish where it fails. Check the source when it matters.
- **"Local AI is techie territory."** Install the APK, let it download once, done. No server, no tunnel, no settings to tune. Tinkering is there if you want it (models, packs, the benchmark), never required.
- **"You need an expensive GPU."** You need the phone in your pocket. The default model is about 1 GB and ran at 11–17 tok/s on a mid-range phone.
- **"It's slow."** With the default model, a typical answer took 10–21 seconds on our test phone (medians from two runs); bigger models are slower and we say how much. Enough to find out how to treat a blister when nobody's around to ask.
- **"It'll eat my storage and battery."** About 1 GB for the default setup, 164 MB more for the 50,000-article pack. It works hard while it answers and the phone warms up; between questions it's idle.
- **"Offline apps still phone home."** BOAR uses the internet in exactly two places, both started by you: the model and pack downloads, and searching Hugging Face for another model. The docs list them.
- **"The knowledge gets stale."** The library is a snapshot of Wikipedia introductions. Download a newer pack when you're online, or build your own.

## 7. How it sounds

**Plain, specific, builder to builder.** We talk like someone who has used the app on a mountain and measured it at a desk.

Principles:

1. **Name the moment.** "In flight", "a tunnel", "a mountain hut" beats "anywhere, anytime".
2. **Numbers with their conditions.** "6.4 s to the first word on a Dimensity 8300", never "fast".
3. **One idea per sentence.** Short sentences. Verbs over adjectives.
4. **Say the limit in the same breath.** "Works offline after one download." "Shows its sources, so you can check it."
5. **Warm, not cute.** A little humor is fine (🐗 at the end of a manifesto); jokes in instructions aren't.
6. **Second person for the reader, "we" for the team.** "You ask, BOAR answers from its library." "We measured it on a real phone."

Words we use: offline, on your phone, no signal, library, sources, pack, measured, the receipt, one download, yours, open source.

Words we don't: revolutionary, game-changing, cutting-edge, seamless, AI-powered, supercharge, unleash, magic, private/secure (on their own; see 5), "Jarvis", "your personal genius".

Rewrites:

| Instead of | Write |
|---|---|
| "Private AI that works anywhere." | "No signal needed, and no server hears your questions." |
| "Blazing-fast on-device inference." | "About 10 seconds an answer with the default model, measured on a mid-range phone." |
| "Accurate answers you can trust." | "Every answer shows the articles it came from, so you can check it." |
| "Your personal offline genius." | "A small AI and a library that live on your phone." |

**Formatting:** sentence case for headings. American spelling. Numbers as digits with units ("1 GB", "17.5 tok/s"). No exclamation marks in product copy. Em dashes sparingly; a colon or a new sentence usually reads better.

## 8. Vocabulary

- **Offline:** works with no network at all, after the one-time setup download. Airplane mode is the test.
- **On-device / local:** runs on the phone's own chip. Not a home server reached through a tunnel.
- **Library / knowledge base:** the articles on the phone that answers are built from.
- **Knowledge pack:** one file that adds articles, a keyword index and embeddings. Anyone can build and share one.
- **Sources:** the articles an answer used, shown under it.
- **The receipt:** the measurements every answer records (model, time to first token, tokens/s, memory).
- **Sanctuary technology:** open tools without an owner, built so depending on them can't be turned against you (section 2).

## 9. Token posts ($BOAR)

A post from BOAR's own account about $BOAR (a thesis on fomo, a cast, a reply) makes the case from the project, never from the price:

- **Say:** what BOAR is for, what shipped, what's measured, where it came from, what's next, and why the idea matters (sanctuary technology, the model we're waiting for).
- **Don't say:** price targets, "moon", "100x", promised returns, or any use for the token we haven't built and announced. Bullish comes from momentum and conviction, not predictions.
- **Never Vitalik.** He supports the app, not the token. No mention, quote or allusion in anything about $BOAR, including "sanctuary technology" framed as his. The idea can stand on its own words: "AI with no owner and no server".
- **Keep the idea bigger than the app:** "we're early", "the first release", "what's next". Never a platform.
- **The token:** boar (`$boar`, lowercase), deployed on Base through Clanker on 2026-09-26 by @vaipraonde, contract `0x0cbf291Ba052174879d90bf781dF1A5F2BC5Bb07`. Say "the community token of the BOAR project" and nothing more until a use is built and announced.
- **Reference text for token pages** (clanker.world, fomo), 2026-09-27:

  > BOAR is knowledge you can carry: an AI and a library that live on your phone, answer with no signal, belong to no one, and show where every answer came from. No account, no server, nothing between you and your questions.
  >
  > It's open source and built in public. The first release already answers in airplane mode, and we publish its benchmarks from a real phone, failures included. Born from poidh bounty #31. Next: more platforms, offline voice, and knowledge packs people make and share.
  >
  > $boar is the community token of the BOAR project. We're early. 🐗

  Short (under 280): "BOAR is knowledge you can carry: an AI and a library on your phone that answer with no signal. No account, no server, open source, built in public. $boar is the community token of the BOAR project. We're early. 🐗"

## 10. Search: what the docs and blog go after

The docs answer "how do I…" and "does it…" questions; the blog answers "why" and "what happened". Both link to each other and to the download.

Topic clusters, and what already covers them:

| Cluster | People search for | Covered by |
|---|---|---|
| Offline AI on a phone | offline AI app Android, AI without internet, AI that works in airplane mode | home, `/docs/`, `/docs/install/` |
| Local LLMs on Android | run LLM on Android, llama.cpp Android, GGUF on phone, best small model for phone | `/docs/models/`, `/docs/benchmark/` |
| Offline knowledge | offline Wikipedia app, offline encyclopedia with AI, RAG on phone | `/docs/knowledge-packs/`, `/docs/how-it-works/` |
| Privacy | AI assistant no cloud, ChatGPT alternative that doesn't send data, private AI app | `/docs/privacy/` |
| Situations | AI for hiking / travel / flights / boats, offline first aid questions | home "When it matters"; blog |
| The idea | sanctuary technology, local AI and digital sovereignty | manifesto; blog |

Blog backlog, in order: (1) What happens when you ask a 1.5B model on a phone: the receipt, explained. (2) Sanctuary technology and the AI in your pocket. (3) Mixture of experts on a phone, measured. (4) Building a knowledge pack for a trip. (5) Which small model for which job: 17 questions, 5 models, one phone. (6) What "offline" should mean: the two times BOAR touches the network.

On-page rules: one page, one question. Title under 60 characters with the searched phrase near the front. A meta description that answers the question in one sentence. Real headings people would search. Link every page to at least two others. Numbers with dates. Every docs page carries TechArticle and breadcrumb data; the FAQ carries FAQPage.

## 11. Sources

1. Vitalik Buterin, "Sanctuary technologies", r/ethereum, 2026-03-03. <https://www.reddit.com/r/ethereum/comments/1rjyqnx/sanctuary_technologies/>
2. Silke Noa Kumpf, "Blockchain-based Dispute Resolution as Sanctuary Justice? Exit, Voice and the State", SSRN, 2026-09-15 (abstract). <https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7461858>
3. "Privacy on Ethereum", ethereum.org. <https://ethereum.org/privacy/ethereum/>
4. "Anyone here actually using AI fully offline?", r/LocalLLM, 2026-02-05, and its comments. <https://www.reddit.com/r/LocalLLM/comments/1qwjgj4/anyone_here_actually_using_ai_fully_offline/>
5. Wakoma, "OfflineAI Research" (CC BY-SA 4.0), and the newer Wakoma repos (Lokal, nimble, Disaster-Workshop). <https://github.com/Wakoma/OfflineAI>
6. "Building Offline AI" (Gamma): couldn't be read; not used.
7. BOAR's own docs: `MANIFESTO.md`, `ARCHITECTURE.md`, `docs/COMPLIANCE.md`, `docs/MODELS.md`, `docs/evidence` in <https://github.com/rferrari/boar-app>.

## 12. Changelog

- **2026-09-27** · First version: sanctuary technology as the why, audiences, five pillars, claims ledger, objections, voice, vocabulary, search plan. From five sources (section 11) and the app repo.
- **2026-09-27** · Origin made explicit: BOAR was born from poidh bounty #31 (claim #124, still open). Now on the home page ("Where it started") and in every footer.
- **2026-09-27** · Short description for 200-character fields (the Morpheus subnet BOAR is creating), in section 1.
- **2026-09-27** · Token posts rules (section 9), from the first $BOAR thesis written for fomo, the social trading app where a "thesis" is a post about a project.
- **2026-09-27** · Token facts and the reference token-page description (clanker.world) in section 9.
- **2026-09-27** · Vitalik supports the app, not the token. Token posts never mention him (section 9); the ledger splits what's fine about the app from what's never fine next to $BOAR.
- **2026-09-27** · Section 0: BOAR is an idea that grows, not a finished app, and it isn't defined by a platform ("we will expand"). Brand copy on the site and in the portal's voice now says "on your phone", not "Android app".
