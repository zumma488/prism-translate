# Changelog

All notable changes to the Prism Translate project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2026-02-11

### Improved

- **Mobile UX**: Enhanced navigation in Settings Modal. Pressing the back button on mobile now closes the modal or navigates back one level instead of closing the page.
- **Robustness**: Improved error handling for encrypted settings. Corrupted data now triggers an automatic reset instead of crashing the app.
- **UI**: Optimized dropdown positioning algorithm. Menus now automatically adjust to stay within the viewport, fixing overflow issues on small screens.

### Fixed

- Fixed an issue where the Settings Modal would flicker or close unexpectedly when switching views on mobile.
- Fixed a potential crash loop caused by decryption failures in `localStorage`.
- Fixed Model Selector dropdown overflowing off-screen on mobile devices.

## [0.1.0] - 2026-02-05

### Added

- Initial release
- Support for multiple AI providers (Google Gemini, OpenAI-compatible APIs, etc.)
- Modern translation interface
- Model configuration and management features
- Built with React 19, TypeScript, and Vercel AI SDK
- Integrated Tailwind CSS v4 and Shadcn UI components
- Support for various AI SDK providers:
  - Anthropic
  - Cerebras
  - Cohere
  - DeepInfra
  - DeepSeek
  - Fireworks
  - Google
  - Groq
  - Mistral
  - OpenAI
  - Perplexity
  - TogetherAI
  - xAI
  - OpenRouter
  - Ollama
  - Workers AI
  - Zhipu AI

### Tech Stack

- React 19.2.4
- TypeScript 5.8.2
- Vite 6.2.0
- Tailwind CSS 4.1.18
- Vercel AI SDK 6.0.71

---

[Unreleased]: https://github.com/zumma488/prism-translate/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/zumma488/prism-translate/releases/tag/v0.1.0
