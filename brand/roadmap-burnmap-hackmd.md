---
title: "BOAR roadmap: the burn map"
tags: boar, roadmap, burn-map, boar-token, offline-ai
description: Every BOAR milestone that ships burns 1% of the rewards the BOAR multisig has received. What counts as a reward, what counts as shipped, and how each burn is done.
---

# BOAR roadmap: the burn map

*Every milestone that ships burns 1% of the rewards the BOAR multisig has received. The work comes first; the burn is the receipt.*

[TOC]

:::info
**The idea in one line.** BOAR grows one milestone at a time. When a milestone is **publicly shipped and anyone can check it**, the BOAR Treasury burns **1% of all the rewards the multisig has received so far**, in transactions everyone can see.
:::

## What counts as rewards

The rewards are the creator fees the $boar token earns on Clanker. They arrive at the Clanker fee wallet and are sent on to the BOAR Treasury multisig. **Only transfers into the multisig from that wallet count:**

| | |
|---|---|
| Clanker fee wallet (the only counted sender) | `0x32d1C8A4d133241a710d780f1198992A015Ea5Ed` |
| BOAR Treasury (Safe, 3 of 6, Base) | `0xEe2d58226bCe9b3928C5Afc9853f50FC9d63c014` |

The fees come in two tokens, $boar and WETH, and both count.

:::danger
**Look-alike addresses.** Someone has already sent fake tokens to the multisig from an address that starts and ends like the fee wallet (`0x32d1f084…a5Ed`, a fake "WẸTH"). That is address poisoning. It is not a reward and never counts. Always check the **full** sender address.
:::

Airdrops and tokens nobody asked for (spam) don't count either.

## How a burn is done

1. **A milestone ships.** "Shipped" means a public, checkable artifact: a live store listing, a tagged release, a page anyone can open. Not a demo, not "almost".
2. **We post the proof.** The link to the artifact, in the Discord and on X.
3. **We add up the rewards.** All $boar and all WETH the multisig has received from the fee wallet up to that day. The totals and the transactions behind them go on this page.
4. **The treasury burns 1% of them.**
   - **$boar rewards:** 1% of the $boar received goes straight to `0x000000000000000000000000000000000000dEaD`.
   - **WETH rewards:** 1% of the WETH received buys $boar on the market, and that $boar goes to the same dead address.
5. **This page is updated.** Status, date, proof link, the reward totals, and the burn transactions.

Because the base is **everything received so far**, the burns follow the project: the more rewards the treasury has taken in, the bigger each burn. The treasury can always afford it, since it only burns a share of what came in.

No dates: this is a direction, not a schedule. A milestone burns when it ships, whenever that is.

## Where the rewards stand

Read on-chain on 2026-09-28:

| Received by the multisig from the fee wallet | Total | 1% (what a burn would be today) |
|---|---|---|
| $boar | 3,464,331,159 $boar | 34,643,312 $boar, burned directly |
| WETH | 23.7422 WETH | 0.2374 WETH of $boar, bought and burned |

| | |
|---|---|
| Token | $boar (boar), Base, deployed through Clanker on 2026-09-26 |
| Contract | `0x0cbf291Ba052174879d90bf781dF1A5F2BC5Bb07` |
| Burn address | `0x000000000000000000000000000000000000dEaD` |

## The burn map

### Big milestones: 1% of rewards each

| # | Milestone | Shipped when | Burn (of rewards) | Status |
|---|---|---|---|---|
| 1 | **iOS release** | BOAR is downloadable on iPhone from the App Store (public listing, not only a TestFlight invite) | 1% | In progress |
| 2 | **Google Play submission** | BOAR has a live, public Google Play listing | 1% | Next |
| 3 | **Shared knowledge pack library** | A public library where people browse, preview and download packs made by the community, working offline-first | 1% | Later |

### Next milestones: 1% of rewards each

| # | Milestone | Shipped when | Burn (of rewards) |
|---|---|---|---|
| 4 | **Offline voice** | Speak a question and hear the answer, with speech recognition and a voice that both run on the phone, in a public release | 1% |
| 5 | **Packs for places** | Ready-made packs for cities you can download before a trip, in the app | 1% |
| 6 | **Phone-to-phone sharing (P2P)** | Pass a pack from one BOAR phone to another over Bluetooth or local Wi-Fi, no internet, in a public release | 1% |
| 7 | **Private memory** | Imported documents and conversation history encrypted with a key only the user holds, in a public release | 1% |
| 8 | **The right model for each task** | Switch models per question without restarting the conversation, in a public release | 1% |
| 9 | **Essentials library** | Verified offline bundles for first aid, disaster response and growing food, downloadable in the app | 1% |
| 10 | **Desktop workbench** | A public build for Mac/desktop to build and look after large libraries and carry them to the phone | 1% |

### Already shipped (the roots)

These came before the burn map and don't burn: v1.0.0 for Android, the offline engine and library, your own documents and models, portable JSON collections, published benchmarks, [boarapp.com](https://boarapp.com) and [the docs](https://boarapp.com/docs).

## Rules

- **No ship, no burn.** A burn only follows a public, checkable artifact. Announcements, demos and screenshots don't count.
- **The base is rewards, not the supply.** Every burn is a percentage of what the multisig has received from the Clanker fee wallet, with the transactions listed.
- **Every burn is on-chain and linked here.** Treasury Safe → dead address (and the buy transaction for the WETH share), hashes posted.
- **The burn follows the work, never leads it.** We don't burn ahead of a release.
- **This page changes in public.** Adding, removing or re-sizing a milestone is written here with the date and the reason.
- **No promises about price.** Burning reduces the supply; what the market does with that is the market's business. This page doesn't predict it.

## Burn log

| Date | Milestone | Proof | Rewards to date ($boar · WETH) | Burned | Transactions |
|---|---|---|---|---|---|
| | | | | | |

---

BOAR: knowledge you can carry. [boarapp.com](https://boarapp.com) · [Roadmap](https://boarapp.com/roadmap/) · [Discord](https://community.boarapp.com) · [@boar_app](https://x.com/boar_app)
