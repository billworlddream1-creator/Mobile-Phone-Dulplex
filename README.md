<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Mobile Phone Duplex

An interactive React application powered by Gemini AI and Vite, demonstrating real-time duplex communication and multimodal interaction for mobile devices.

View your app in AI Studio: https://ai.studio/apps/2d298dcf-bffc-46fa-9047-bd61746802d1

## Features

- **Real-time AI Duplex Communication:** Interactive interface using Google's `@google/genai` SDK.
- **Cross-Platform Compatibility:** Responsive layout built with React, Tailwind CSS, and Lucide Icons.
- **Analytics & Visualizations:** Charts powered by Recharts.
- **Automated CI/CD Pipeline:** GitHub Actions workflow matrix validating builds across Windows, macOS, and Linux, with downloadable build artifacts for each OS.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` (comes bundled with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd mobile-phone-duplex
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the project root and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

### Development

Run the local development server with Vite:

```bash
npm run dev
```

Open your browser and navigate to the local server URL (typically `http://localhost:5173`).

### Building for Production

To create a production bundle:

```bash
npm run build
```

The compiled assets will be output to the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

## Continuous Integration & Artifacts

The repository includes a GitHub Actions workflow (`.github/workflows/build.yml`) that triggers on pushes and pull requests to `main` / `master`.

- **Matrix Builds:** Compiles the application on **Windows (`windows-latest`)**, **macOS (`macos-latest`)**, and **Linux (`ubuntu-latest`)**.
- **Build Artifacts:** Automatically uploads the `dist/` folder as a downloadable artifact for each OS build run (`build-artifact-windows-latest`, `build-artifact-macos-latest`, `build-artifact-ubuntu-latest`).
