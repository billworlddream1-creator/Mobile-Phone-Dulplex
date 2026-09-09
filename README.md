<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Mobile Phone Duplex AI Studio App

This project contains everything you need to run and build your AI Studio app across multiple platforms including **macOS, iOS, Android, Windows, and Linux**.

View your app in AI Studio: https://ai.studio/apps/2d298dcf-bffc-46fa-9047-bd61746802d1

---

## Supported Platforms

- **Android**: Automated APK generation (`app-debug.apk`) via Gradle & Capacitor.
- **iOS**: Automated iOS App project compilation via Xcode (`xcodebuild`) & Capacitor.
- **Windows**: Production web bundle packaged for Windows runners (`windows-latest`).
- **macOS**: Production web bundle packaged for macOS runners (`macos-latest`).
- **Linux**: Production web bundle packaged for Linux runners (`ubuntu-latest`).

---

## Prerequisites

- **Node.js**: v18 or later (v20 recommended)
- **npm**: v9 or later
- **Java JDK**: 17 or higher (for local Android builds)
- **Xcode**: 15+ and macOS (for local iOS builds)

---

## Local Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure API Key:**
   Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

---

## Building Locally

### Web Application
To compile the web assets into the `dist/` directory:
```bash
npm run build
```

To preview the built app locally:
```bash
npm run preview
```

### Android APK Build
To generate an Android APK locally using Capacitor:
```bash
npm install @capacitor/cli @capacitor/core @capacitor/android
npx cap init "Mobile Phone Duplex" "com.example.mobilephoneduplex" --web-dir dist
npx cap add android
cd android
./gradlew assembleDebug
```
The resulting `.apk` file will be located at:
`android/app/build/outputs/apk/debug/app-debug.apk`

### iOS Project Build
To set up and build the iOS project locally (on macOS with Xcode):
```bash
npm install @capacitor/cli @capacitor/core @capacitor/ios
npx cap init "Mobile Phone Duplex" "com.example.mobilephoneduplex" --web-dir dist
npx cap add ios
xcodebuild -workspace ios/App/App.xcworkspace -scheme App -sdk iphonesimulator CODE_SIGNING_ALLOWED=NO build
```

---

## Continuous Integration & Artifact Downloads (GitHub Actions)

This repository includes a multi-platform GitHub Actions CI/CD workflow configured in `.github/workflows/build.yml`.

### Workflow Triggers
The workflow automatically runs on:
- Pushes to `main` or `master` branches.
- Pull Requests targeting `main` or `master` branches.

### Downloadable Build Artifacts
After a workflow run completes, you can download pre-built artifacts directly from the **Actions** tab on GitHub under the specific workflow run summary:

1. **`android-apk`**: Contains `app-debug.apk`, ready for installation on Android devices or emulators.
2. **`ios-build`**: Contains the generated iOS project bundle built on `macos-latest`.
3. **`dist-ubuntu-latest`**: Production Web build bundle for Linux environments.
4. **`dist-windows-latest`**: Production Web build bundle for Windows environments.
5. **`dist-macos-latest`**: Production Web build bundle for macOS environments.

To download an artifact:
1. Navigate to the **Actions** tab of the GitHub repository.
2. Select the latest workflow run ("Multi-Platform Build and Artifact Uploads").
3. Scroll down to the **Artifacts** section at the bottom of the summary page.
4. Click on **`android-apk`** or any other desired platform artifact to download the zip file.
