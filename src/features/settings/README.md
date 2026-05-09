[简体中文](./README.zh.md) | **English**

# `src/features/settings/`

## Purpose

`src/features/settings/` owns provider configuration, model management, default selection behavior, import/export flows, and settings persistence-facing state.

## Current Responsibilities

This module currently owns:
- adding, editing, and removing providers
- model list management
- protocol mode selection for OpenAI and compatible providers
- default model selection and language-model bindings
- settings import/export flows
- persistence and migration coordination

## Out Of Scope

This module should not directly own:
- translation result rendering
- low-level LLM request adaptation
- App Router route definitions

## Current Code Mapping

Settings behavior currently spans:
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
