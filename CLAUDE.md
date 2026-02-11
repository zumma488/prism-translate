# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI-powered translation dashboard built with React 19, TypeScript, and Vercel AI SDK. Integrates 17+ AI providers (Google Gemini, OpenAI, Anthropic, DeepSeek, etc.) for multi-language translation.

## Commands

### Development
```bash
npm run dev          # Start dev server on port 3000
npm run build        # Production build
npm run build:gh     # GitHub Pages build (includes TypeScript check)
npm run preview      # Preview production build
npm run lint         # Type check with TypeScript
```

## Architecture

### Multi-Provider System

The app uses a flexible provider system defined in `src/config/models.ts`:

- **PROVIDER_DEFINITIONS**: Single source of truth for all provider configurations
- **Categories**: `popular`, `native`, `community`, `compatible`
- Each provider has `id`, `name`, `icon`, `defaultModel`, and `defaultModels` list
- Supports 17+ providers including native SDK providers and OpenAI-compatible APIs

### Settings & Encryption

Settings are stored encrypted in localStorage using Web Crypto API:

- **Storage key**: `ai-translator-settings-v3` (encrypted)
- **Format**: `{ providers: ProviderConfig[], activeModelKey: string }`
- **Active model key format**: `${providerId}:${modelId}` (e.g., `google-uuid:gemini-2.0-flash`)
- **Encryption**: `src/services/crypto.ts` handles encrypt/decrypt using AES-GCM
- **Migration**: Automatic v2→v3 migration (plaintext to encrypted) on first load

### LLM Service Architecture

`src/services/llmService.ts` handles all AI provider integrations:

1. **Provider Type Detection**:
   - Native SDK providers (Google, Anthropic, Mistral, etc.) use direct SDK calls
   - OpenAI/Custom providers use auto-detection with fallback

2. **OpenAI-Compatible API Auto-Detection**:
   - First tries `.chat()` format (most compatible with third-party APIs)
   - Falls back to default OpenAI Responses API if needed
   - Caches successful format per provider for faster subsequent calls

3. **Translation Flow**:
   - Takes input text and target languages
   - Uses system prompt requesting JSON response format
   - Returns `TranslationResult[]` with language, code, text, tone, confidence

### Component Structure

- `App.tsx`: Main app component with state management and settings persistence
- `components/Header.tsx`: Top bar with model selector and settings button
- `components/TranslationInput.tsx`: Left panel for input text and language selection
- `components/TranslationCard.tsx`: Right panel output cards for each translation
- `components/SettingsModal.tsx`: Settings dialog with provider management
- `components/settings/ConnectProviderView.tsx`: Add new provider wizard
- `components/settings/EditProviderView.tsx`: Edit provider config and API keys
- `components/settings/ManageModelsView.tsx`: Enable/disable models per provider

### Type System

`src/types.ts` defines core interfaces:

- `ProviderConfig`: Provider instance with id, type, apiKey, baseUrl, models[]
- `ModelDefinition`: Individual model with id, name, enabled flag
- `AppSettings`: Top-level settings with providers[] and activeModelKey
- `TranslationResult`: Translation output with language, code, text, tone, confidence
- `ModelProvider`: Union type of all supported provider types

## Important Implementation Notes

### Adding a New Provider

1. Add provider definition to `PROVIDER_DEFINITIONS` in `src/config/models.ts`
2. Add case to `createModel()` function in `src/services/llmService.ts`
3. Import the provider's SDK package (e.g., `@ai-sdk/newprovider`)
4. For OpenAI-compatible APIs, use `custom` type with `baseUrl`

### Settings Persistence

- Settings load asynchronously on mount via `useEffect`
- Settings save automatically when changed (after initial load)
- Use `settingsLoaded` flag to prevent premature saves
- Always encrypt before saving to localStorage

### Model Selection Logic

- `getEnabledModels()`: Returns all enabled models across all providers
- `activeModelMeta()`: Finds currently active model from activeModelKey
- If active model becomes invalid (disabled/deleted), auto-select first enabled model

### Vite Configuration

- Base path: `/prism-translate/` for GitHub Pages, `/` for regular deployment
- Uses `GITHUB_PAGES=true` env var to switch base paths
- Aliases `@` to `src/` directory for cleaner imports
- Dev server runs on port 3000 with host `0.0.0.0`

## File Organization

```
src/
├── App.tsx                    # Main application component
├── main.tsx                   # Entry point
├── types.ts                   # TypeScript type definitions
├── constants.ts               # Language configs and defaults
├── components/
│   ├── Header.tsx             # Top navigation with model selector
│   ├── TranslationInput.tsx   # Left panel input area
│   ├── TranslationCard.tsx    # Right panel output cards
│   ├── SettingsModal.tsx      # Settings dialog
│   ├── settings/              # Settings sub-views
│   └── ui/                    # shadcn/ui components
├── services/
│   ├── llmService.ts          # AI provider integration
│   ├── crypto.ts              # Encryption utilities
│   └── configIO.ts            # Import/export config
├── config/
│   └── models.ts              # Provider definitions (single source of truth)
└── lib/
    └── utils.ts               # Utility functions
```

## Security Notes

- All API keys stored encrypted using Web Crypto API (AES-GCM)
- Encryption key derived from user's device-specific data
- Never commit `.env.local` or expose API keys in code
- Provider configs with API keys only stored in localStorage (encrypted)
