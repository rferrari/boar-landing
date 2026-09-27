---
title: Install BOAR
description: Download the BOAR APK for Android, verify its SHA-256, and run the one-time setup that downloads the model. After that it works with no internet.
section: Start here
order: 20
---

Installing takes two steps: the app (123 MB), then a one-time download of the model and library inside the app (about 1 GB). That download is the only time BOAR needs the internet. After it, airplane mode is fine.

## What you need

- A **64-bit ARM Android phone**. That's almost every Android phone from the last several years.
- About **1.2 GB free** for the default setup, or about 1.4 GB with the large Wikipedia pack. Bigger optional models need 2–5 GB each.
- **Wi-Fi or data once**, for the setup download.

BOAR is tested on a Xiaomi 2311DRK48G (MediaTek Dimensity 8300, 11.6 GB RAM, Android 16). The default model peaked at 1.8–3.1 GB of memory there, so phones with less RAM should run it too; bigger models need more.

## 1. Download the APK

Get `boar-v1.0.0-arm64.apk` from the [latest release on GitHub](https://github.com/rferrari/boar-app/releases/latest).

## 2. Check it (optional, recommended)

The release publishes a SHA-256 checksum next to the APK. On a computer, with both files in the same folder:

```bash
sha256sum -c boar-v1.0.0-arm64.apk.sha256
# boar-v1.0.0-arm64.apk: OK
```

On macOS, `shasum -a 256 -c boar-v1.0.0-arm64.apk.sha256` does the same.

## 3. Install it

- **On the phone:** open the APK from your downloads. Android asks you to allow installs from that app (your browser or file manager) the first time.
- **From a computer:** with USB debugging on, `adb install boar-v1.0.0-arm64.apk`.
- **Guided:** clone the repo and run `make setup`, then pick "Install BOAR on my phone". It downloads the release, checks the checksum and installs over USB.

> [!NOTE]
> BOAR isn't on the Play Store, and it doesn't need Google Play Services. It runs on phones without them.

## 4. The one-time setup

Open BOAR while you're online. The setup wizard asks for a language (English or Portuguese, for the menus), checks your phone's memory and storage, and offers four setups. They all download the same model; they differ in how much of the library comes with it.

| Setup | Library | Extra download |
|---|---|---|
| Minimum | 300 built-in topics | none |
| Standard | + 1,000 Wikipedia-derived topics | ~600 KB |
| Full | 5,300 topics in total | ~3 MB |
| Encyclopedia | Full + the introductions of Wikipedia's ~50,000 Vital Articles | ~164 MB |

Every setup downloads:

- **Qwen2.5-1.5B-Instruct**, the model that writes the answers (about 0.99 GB, Apache-2.0).
- **bge-small-en-v1.5**, a small model that finds passages by meaning (about 35 MB, MIT).

Each download shows its progress and gets a Retry button if it stalls. When they finish, **Continue** opens the chat.

> [!TIP]
> Keep BOAR open while it downloads. Downloads pause if you switch to another app and pick up where they left off when you come back, but they don't progress in the background.

## 5. Go offline

Turn on airplane mode and ask something. The **OFFLINE** badge in the header is real: from here on, answering uses only the phone.

You can change your setup later from Settings → App → **Re-run Setup Wizard**, without losing your conversations or documents.

## Next

- [Ask and check](asking.md): how answers and sources work.
- [Knowledge packs](knowledge-packs.md): add more to the library.
- Something went wrong? [Troubleshooting](troubleshooting.md).
