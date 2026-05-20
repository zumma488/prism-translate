[简体中文](./README.zh.md) | **English**

# `src/features/settings/`

## Purpose

`src/features/settings/` owns provider configuration, model management, default selection behavior, import/export flows, and settings persistence-facing state.

## Current Responsibilities

This module currently owns:
- adding, editing, and removing providers
- model list management
- protocol mode selection for OpenAI and compatible providers
- global translation execution mode
- default model selection and language-model bindings
- provider model discovery and fetched-model merge flows
- settings import/export flows
- persistence and migration coordination
- routed settings center page composition used by `app/settings/*`
- stable provider/model identity normalization for persisted settings
- provider selection, provider create/edit routing flows, and the provider model-management entry flow

## Out Of Scope

This module should not directly own:
- translation result rendering
- low-level LLM request adaptation
- App Router route definitions

## Current Code Mapping

Settings behavior currently spans:
- `app/settings/`
- `app/settings/layout.tsx`
- `app/settings/general/page.tsx`
- `app/settings/languages/page.tsx`
- `app/settings/providers/page.tsx`
- `app/settings/providers/select/page.tsx`
- `app/settings/providers/new/page.tsx`
- `app/settings/providers/[providerId]/page.tsx`
- `app/settings/providers/models/page.tsx`
- `app/settings/about/page.tsx`
- `src/features/settings/components/`
- `src/features/settings/hooks/`
- `src/features/settings/services/`
- `src/components/SettingsModal.tsx`
- `src/components/settings/`
- `src/services/configIO.ts`
- `src/App.tsx`

## Adjacent Modules

- `../provider-management/` covers provider onboarding and management rules.
- `../../services/` covers config IO, legacy compatibility helpers, and shared infrastructure.
- `../../entities/settings/` documents stable settings-related models.

## Reading Guide

- settings UI: `./components/README.md` or `./components/README.zh.md`
- settings hooks: `./hooks/README.md` or `./hooks/README.zh.md`
- settings services: `./services/README.md` or `./services/README.zh.md`
