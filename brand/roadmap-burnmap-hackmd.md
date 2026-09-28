---
title: "BOAR roadmap: the burn map"
tags: boar, roadmap, burn-map, boar-token, offline-ai
description: Every BOAR milestone that ships burns 1% of the $boar supply from the treasury. What counts as shipped, how the burn is done, and how many burns the treasury can back today.
---

# BOAR roadmap: the burn map

*Every milestone that ships burns 1% of the $boar supply. The work comes first; the burn is the receipt.*

[TOC]

:::info
**The idea in one line.** BOAR grows one milestone at a time. When a milestone is **publicly shipped and anyone can check it**, the BOAR Treasury burns **1% of the $boar supply (1,000,000,000 $boar)** to the dead address, in a transaction everyone can see.
:::

## How it works

1. **A milestone ships.** "Shipped" means a public, checkable artifact: a live store listing, a tagged release, a page anyone can open. Not a demo, not "almost".
2. **We post the proof.** The link to the artifact, in the Discord and on X.
3. **The treasury burns 1%.** The BOAR Treasury Safe (3-of-6 multisig on Base) sends 1,000,000,000 $boar to `0x000000000000000000000000000000000000dEaD`. The transaction hash goes next to the milestone on this page.
4. **This page is updated.** Status, date, proof link, burn transaction.

No dates: this is a direction, not a schedule. A milestone burns when it ships, whenever that is.

## The token and the treasury

| | |
|---|---|
| Token | $boar (boar), Base, deployed through Clanker on 2026-09-26 |
| Contract | `0x0cbf291Ba052174879d90bf781dF1A5F2BC5Bb07` |
| Total supply | 100,000,000,000 $boar |
| 1% | 1,000,000,000 $boar |
| Burn address | `0x000000000000000000000000000000000000dEaD` |
| BOAR Treasury (Safe, 3 of 6, Base) | `0xEe2d58226bCe9b3928C5Afc9853f50FC9d63c014` |
| Treasury balance (read on-chain 2026-09-28) | **3,464,331,159 $boar (3.46% of supply)** |

:::warning
**The math, honestly.** At 1% per milestone, the treasury as it stands today can back **three burns**. The map below has more than three milestones, so one of these has to happen before the fourth burn:

- **Refill the burn reserve** with part of the Clanker creator fees: buy $boar and send it to the treasury (or burn it directly).
- **Scale the burn** for smaller milestones (for example 0.5%) and keep 1% for the big ones.
- **Stop at three** 1% burns and announce what comes after.

Which one we choose goes on this page before the fourth milestone ships.
:::

## The burn map

### Big milestones: 1% each

| # | Milestone | Shipped when | Burn | Status |
|---|---|---|---|---|
| 1 | **iOS release** | BOAR is downloadable on iPhone from the App Store (public listing, not only a TestFlight invite) | 1% | In progress |
| 2 | **Google Play submission** | BOAR has a live, public Google Play listing | 1% | Next |
| 3 | **Shared knowledge pack library** | A public library where people browse, preview and download packs made by the community, working offline-first | 1% | Later |

### Next milestones: proposed burns (see the warning above)

| # | Milestone | Shipped when | Proposed burn |
|---|---|---|---|
| 4 | **Offline voice** | Speak a question and hear the answer, with speech recognition and a voice that both run on the phone, in a public release | 1% or 0.5% |
| 5 | **Packs for places** | Ready-made packs for cities you can download before a trip, in the app | 1% or 0.5% |
| 6 | **Phone-to-phone sharing (P2P)** | Pass a pack from one BOAR phone to another over Bluetooth or local Wi-Fi, no internet, in a public release | 1% or 0.5% |
| 7 | **Private memory** | Imported documents and conversation history encrypted with a key only the user holds, in a public release | 1% or 0.5% |
| 8 | **The right model for each task** | Switch models per question without restarting the conversation, in a public release | 0.5% |
| 9 | **Essentials library** | Verified offline bundles for first aid, disaster response and growing food, downloadable in the app | 1% or 0.5% |
| 10 | **Desktop workbench** | A public build for Mac/desktop to build and look after large libraries and carry them to the phone | 0.5% |

### Already shipped (the roots)

These came before the burn map and don't burn: v1.0.0 for Android, the offline engine and library, your own documents and models, portable JSON collections, published benchmarks, [boarapp.com](https://boarapp.com) and [the docs](https://boarapp.com/docs).

## Rules

- **No ship, no burn.** A burn only follows a public, checkable artifact. Announcements, demos and screenshots don't count.
- **Every burn is on-chain and linked here.** Treasury Safe → dead address, transaction hash posted.
- **The burn follows the work, never leads it.** We don't burn ahead of a release.
- **This page changes in public.** Adding, removing or re-sizing a milestone is written here with the date and the reason.
- **No promises about price.** Burning reduces the supply; what the market does with that is the market's business. This page doesn't predict it.

## Burn log

| Date | Milestone | Proof | Amount | Transaction |
|---|---|---|---|---|
| | | | | |

---

BOAR: knowledge you can carry. [boarapp.com](https://boarapp.com) · [Roadmap](https://boarapp.com/roadmap/) · [Discord](https://community.boarapp.com) · [@boar_app](https://x.com/boar_app)
