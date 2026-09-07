<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Mobile Phone Duplex AI Studio App

This project contains everything you need to run and build your AI Studio app across multiple platforms.

View your app in AI Studio: https://ai.studio/apps/2d298dcf-bffc-46fa-9047-bd61746802d1

## Prerequisites

- **Node.js**: v18 or later
- **npm**: v9 or later

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

## Build Instructions

To build the project for production:

```bash
npm run build
```

This compiles the project assets into the `dist/` directory.

To preview the built app locally:

```bash
npm run preview
```

## Cross-Platform GitHub Actions CI/CD Workflow

This repository includes a GitHub Actions CI workflow configured in `.github/workflows/build.yml`.

### Features:
- **Multi-OS Matrix Builds:** Builds automatically run and test on Linux (`ubuntu-latest`), Windows (`windows-latest`), and macOS (`macos-latest`).
- **Artifact Uploads:** After each successful build, the production output (`dist/` directory) is uploaded as a downloadable artifact for Windows, macOS, and Linux runners (`dist-ubuntu-latest`, `dist-windows-latest`, `dist-macos-latest`).
