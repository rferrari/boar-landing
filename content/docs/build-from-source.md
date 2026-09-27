---
title: Build from source
description: Build the BOAR Android app from source: in the cloud with EAS or locally with the Android SDK, make a release APK, and fix the common development-build problems.
section: Project
order: 30
---

BOAR is an Expo (React Native) app with native modules and llama.cpp, so it isn't an Expo Go app: every build goes through `expo prebuild` and a real native build. You can build in the cloud without an Android SDK, or locally with one.

## The guided way

```bash
git clone https://github.com/rferrari/boar-app.git
cd boar-app
make setup
```

The wizard asks what you want: install the release on your phone, build from source (it checks Node, JDK and the Android SDK and tells you what's missing), a live-reloading development build, or a bigger knowledge pack. `make help` lists the individual steps.

## In the cloud, no Android SDK

```bash
npm install
npx eas-cli login                                       # once, needs an Expo account
npx eas-cli build --platform android --profile preview  # builds an installable APK
```

Download the APK from Expo and install it with `adb install <file>.apk`, or copy it to the phone.

## Locally, with the Android SDK

You need Node.js (an LTS release), npm, and Android Studio's SDK, NDK and JDK, plus a phone with USB debugging on.

```bash
npm install
npx expo prebuild -p android --clean   # generates ./android from app.json
npx expo run:android --device          # builds and installs on the connected phone
```

> [!TIP]
> Always pass `--clean` to `prebuild` after changing `app.json` or its plugins. Without it, an old `android/` folder can keep stale values, and `npm install` never touches it.

## A release APK

```bash
npx expo prebuild -p android --clean
cd android && ./gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a
# android/app/build/outputs/apk/release/app-release.apk
```

It's signed with the key named in `~/.gradle/gradle.properties` (`BOAR_UPLOAD_STORE_FILE` and friends), never in the repo; without one it's debug-signed, which is fine for your own phone. A first release build takes about 40 minutes.

## After installing

The first launch shows the one-time setup download, as in [Install BOAR](install.md). If you already have the model files, you can skip the download: see "Pre-seeding models" in [`docs/MODELS.md`](https://github.com/rferrari/boar-app/blob/main/docs/MODELS.md).

## Check your changes

```bash
npm run typecheck   # tsc --noEmit
npm test            # the unit tests
```

These check the TypeScript, not the native build. Only a real phone proves that.

## Common problems

- **A blank screen, or "Failed to connect to <LAN IP>", in a development build.** Your Wi-Fi isolates devices from each other (common on hotspots). Use the USB tunnel instead: `npx expo start --localhost` (`make start` already does), and if needed enter `http://127.0.0.1:8081` in the app.
- **`ClassNotFoundException: expo.modules.splashscreen.SplashScreenManager` in the logs.** Harmless; ignore it.
- **Odd build errors after editing `app.json`.** Run `prebuild` with `--clean`.

For agents and scripted builds, [`AGENTS.md`](https://github.com/rferrari/boar-app/blob/main/AGENTS.md) has every command and constraint.
