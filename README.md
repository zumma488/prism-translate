# AI Translator Dashboard

<div align="center">
  <img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

<p align="center">
  <em>A collaborative creation, fully developed by <b>AI Agents</b>.</em><br/>
  <em>Co-developed by <b>Google Stitch</b>, <b>Google AI Studio</b>, and <b>Antigravity</b>.</em>
</p>

<p align="center">
  <a href="./README.zh.md">简体中文</a> | <b>English</b>
</p>

A modern AI-powered translation dashboard built with Next.js, React 19, TypeScript, and the Vercel AI SDK. This project integrates multiple AI providers (Google Gemini, OpenAI, etc.) to deliver high-quality translations in a sleek, responsive interface.

<p align="center">
  <a href="https://zumma488.github.io/prism-translate/"><b>Live Demo</b></a>
</p>

## ✨ Features

- **Multi-Model Translation Comparison**: Select multiple AI models per language and compare translations side-by-side in a clean vertical layout.
- **Per-Language Model Selection**: Customize AI models for each target language independently, optimizing translation quality for different language pairs.
- **Custom Base URL Support**: Configure custom Base URLs for any AI API provider, offering ultimate flexibility for proxy routing and custom enterprise endpoints.
- **Multi-Model Support**: Seamlessly switch between Google Gemini, OpenAI, and other providers via Vercel AI SDK.
- **Modern UI/UX**: Built with `shadcn/ui` and Tailwind CSS v4 for a premium, responsive design.
- **Micro-Animations**: Enhanced user experience with `tw-animate-css`.
- **Type-Safe**: Full TypeScript support for robust development.
- **Global i18n Support**: UI available in 12 languages — Arabic, English, Spanish, Japanese, Korean, Burmese, Portuguese, Russian, Turkish, Vietnamese, Simplified Chinese, and Traditional Chinese.

## 📸 Screenshots

### Dashboard

![Dashboard Desktop](docs/images/dashboard-desktop.png)

### Mobile & Responsive

<p align="center">
  <img src="docs/images/dashboard-mobile.png" width="300" alt="Mobile View" />
</p>

### Model Management

|                  Connection                  |              Custom Provider               |             Model Selection              |
| :------------------------------------------: | :----------------------------------------: | :--------------------------------------: |
| ![Connect](docs/images/connect-provider.png) | ![Custom](docs/images/custom-provider.png) | ![Manage](docs/images/manage-models.png) |

## 🌍 Supported Languages

| Language | Code | Native Name |
|----------|------|-------------|
| Arabic | `ar` | العربية |
| English | `en` | English |
| Spanish | `es` | Español |
| Japanese | `ja` | 日本語 |
| Korean | `ko` | 한국어 |
| Burmese | `my` | မြန်မာ |
| Portuguese | `pt` | Português |
| Russian | `ru` | Русский |
| Turkish | `tr` | Türkçe |
| Vietnamese | `vi` | Tiếng Việt |
| Chinese (Simplified) | `zh` | 简体中文 |
| Chinese (Traditional) | `zh-TW` | 繁體中文 |

## 🛠 Tech Stack

- **Framework**: Next.js + React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **AI Integration**: Vercel AI SDK + Google Gemini + OpenAI
- **Deployment**: Vercel-compatible hosting

### AI Skills Reference

The following AI Skills were used during development (general configuration, no need to sync with project):

| Skill                | Purpose                                    |
| -------------------- | ------------------------------------------ |
| `shadcn-ui`          | shadcn/ui component library installation and usage guide |
| `tailwind-v4-shadcn` | Tailwind v4 and shadcn/ui integration configuration |
| `ai-sdk`             | Vercel AI SDK usage guide                  |
| `ui-ux-pro-max`      | UI/UX design specifications and best practices |

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/zumma488/prism-translate.git
   cd prism-translate
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables (Optional):
   Copy `.env.example` to `.env.local` if you want to override the default request timeout.

   ```bash
   cp .env.example .env.local
   ```

   Example:

   ```env
   REQUEST_TIMEOUT_MS=1800000
   ```

   Provider API keys are configured in the app settings UI and stored in your current browser.

## Configuration Storage

- Provider configuration is stored in the current browser's local storage.
- API keys and other provider secrets are stored in plain text in that local storage.
- Exported `.prism` files also contain those secrets in plain JSON.
- If you clear browser storage, switch browsers, or move to a new machine, keep your exported configuration file safe if you need to restore settings.

4. Run the development server:

   ```bash
   npm run dev
   ```

## Deploying To Vercel

This app is compatible with Vercel and passes `npm run build` as a standard Next.js deployment.

Recommended project settings:

- Framework Preset: `Next.js`
- Build Command: `npm run build`
- Install Command: `npm install`
- Output Directory: leave empty

Environment variables:

- `REQUEST_TIMEOUT_MS`
  - Optional.
  - Controls upstream provider timeout in milliseconds.
  - On Vercel, the app automatically caps this below the function duration to reduce hard timeouts.

Operational notes:

- Provider credentials are stored in each user's browser `localStorage`, not in Vercel environment variables.
- The translation API runs as a Node.js function and is configured for long-running streaming requests.
- `ollama` cannot use its default `http://localhost:11434/api` endpoint on Vercel.
  Use an externally reachable Ollama-compatible endpoint or another hosted provider instead.
- Very long translations can still hit Vercel plan limits if the upstream model responds too slowly.

## GitHub Automation

This repository includes one GitHub Actions workflow:

- `CI` (`.github/workflows/ci.yml`)
  - Runs on every push and pull request
  - Installs dependencies, runs `npm run lint`, then `npm run build`

For production deployment, use Vercel's Git integration with this repository.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Author

**zumma488**

- GitHub: [@zumma488](https://github.com/zumma488)
