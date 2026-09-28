---
title: "BOAR roadmap: Ship to Burn"
tags: boar, roadmap, burn-map, boar-token, offline-ai
description: 20% of every reward the BOAR multisig receives goes into the Burn Pot. Every milestone that ships burns the whole pot. What counts as a reward, what counts as shipped, and how each burn is done.
---

# BOAR roadmap: Ship to Burn

*20% of every reward goes into the Burn Pot. Every time we ship, the whole pot burns. The work comes first; the burn is the receipt.*

[TOC]

:::info
**The idea in one line.** The $boar token earns creator fees. **20% of every reward the BOAR multisig receives goes into the Burn Pot.** When a milestone on this map is **publicly shipped and anyone can check it**, the **entire pot burns**, in transactions everyone can see. Then the pot starts filling again for the next one.
:::

## How it works

1. **Rewards come in.** The creator fees $boar earns on Clanker are sent to the BOAR Treasury multisig, in $boar and in WETH.
2. **20% goes into the Burn Pot.** From every reward transfer, 20% is set aside for burning. It stays in the multisig, counted on this page, and is never spent on anything else. The other 80% funds the project.
3. **A milestone ships.** "Shipped" means a public, checkable artifact: a live store listing, a tagged release, a page anyone can open. Not a demo, not "almost".
4. **The whole pot burns.**
   - **$boar in the pot** goes straight to `0x000000000000000000000000000000000000dEaD`.
   - **WETH in the pot** buys $boar on the market, and that $boar goes to the same dead address.
5. **We post it.** "Shipped X, burned Y $boar", with the proof link and the burn transactions, in the Discord, on X and in the burn log below. The pot is back at zero and starts filling for the next milestone.

The pot fills with every reward, whether we're between releases or not. The longer the work takes, the bigger the burn when it lands.

No dates: this is a direction, not a schedule. A milestone burns when it ships, whenever that is.

## The Burn Pot today

Read on-chain on 2026-09-28:

| | Rewards received by the multisig | Burn Pot (20%) |
|---|---|---|
| $boar | 3,464,331,159 $boar | **692,866,232 $boar** |
| WETH | 23.7422 WETH | **4.7484 WETH** (to buy and burn $boar) |

If the iOS release shipped today, that's what would burn.

## What counts as a reward

Only transfers into the multisig **from the Clanker fee wallet** count:

| | |
|---|---|
| Clanker fee wallet (the only counted sender) | `0x32d1C8A4d133241a710d780f1198992A015Ea5Ed` |
| BOAR Treasury (Safe, 3 of 6, Base) | `0xEe2d58226bCe9b3928C5Afc9853f50FC9d63c014` |
| $boar contract | `0x0cbf291Ba052174879d90bf781dF1A5F2BC5Bb07` |
| Burn address | `0x000000000000000000000000000000000000dEaD` |

:::danger
**Look-alike addresses.** Someone has already sent fake tokens to the multisig from an address that starts and ends like the fee wallet (`0x32d1f084…a5Ed`, a fake "WẸTH"). That is address poisoning. It is not a reward and never counts. Always check the **full** sender address.
:::

Airdrops and tokens nobody asked for (spam) don't count either.

## The map

| # | Milestone | Shipped when | Status |
|---|---|---|---|
| 1 | **iOS release** | BOAR is downloadable on iPhone from the App Store (public listing, not only a TestFlight invite) | In progress |
| 2 | **Google Play** | BOAR has a live, public Google Play listing | Next |
| 3 | **Shared knowledge pack library** | A public library where people browse, preview and download packs made by the community, working offline-first | Later |
| 4 | **Offline voice** | Speak a question and hear the answer, with speech recognition and a voice that both run on the phone, in a public release | Later |
| 5 | **Packs for places** | Ready-made packs for cities you can download before a trip, in the app | Later |
| 6 | **Phone-to-phone sharing (P2P)** | Pass a pack from one BOAR phone to another over Bluetooth or local Wi-Fi, no internet, in a public release | Later |
| 7 | **Private memory** | Imported documents and conversation history encrypted with a key only the user holds, in a public release | Later |
| 8 | **The right model for each task** | Switch models per question without restarting the conversation, in a public release | Later |
| 9 | **Essentials library** | Verified offline bundles for first aid, disaster response and growing food, downloadable in the app | Further out |
| 10 | **Desktop workbench** | A public build for Mac/desktop to build and look after large libraries and carry them to the phone | Further out |

Every milestone burns the whole pot, whatever it holds when it ships.

### Already shipped (the roots)

These came before Ship to Burn and don't burn: v1.0.0 for Android, the offline engine and library, your own documents and models, portable JSON collections, published benchmarks, [boarapp.com](https://boarapp.com) and [the docs](https://boarapp.com/docs).

## Rules

- **No ship, no burn.** A burn only follows a public, checkable artifact. Announcements, demos and screenshots don't count.
- **The pot is only for burning.** The 20% set aside is never spent, lent or moved anywhere except the dead address (or the market, for the WETH share, to buy $boar to burn).
- **Every burn is on-chain and linked here.** Treasury Safe → dead address, plus the buy transaction for the WETH share, with hashes posted.
- **The burn follows the work, never leads it.** We don't burn ahead of a release.
- **This page changes in public.** Adding, removing or reordering a milestone, or changing the 20%, is written here with the date and the reason.
- **No promises about price.** Burning reduces the supply; what the market does with that is the market's business. This page doesn't predict it.

## Burn log

| Date | Milestone | Proof | Pot burned ($boar · WETH) | Transactions |
|---|---|---|---|---|
| | | | | |

---

BOAR: knowledge you can carry. [boarapp.com](https://boarapp.com) · [Roadmap](https://boarapp.com/roadmap/) · [Discord](https://community.boarapp.com) · [@boar_app](https://x.com/boar_app)
