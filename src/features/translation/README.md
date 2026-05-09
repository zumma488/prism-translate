[简体中文](./README.zh.md) | **English**

# `src/features/translation/`

## Purpose

`src/features/translation/` owns the core translation workflow in Prism Translate. It turns one source input into translation tasks for different target languages and model combinations, then organizes results for comparison.

## Current Responsibilities

This module currently owns:
- source text workflow behavior
- target language selection and persistence coordination
- language-to-model binding resolution
- translation task creation
- translation execution coordination
- result grouping, sorting, and comparison display support

## Out Of Scope

This module should not directly own:
- low-level provider SDK instantiation
- generic config compatibility handling
- settings import/export rules
- App Router route handling

Those belong in `src/services/`, `server/`, or `app/`.

## Current Code Mapping

Translation behavior currently spans:
- `src/features/translation/components/`
- `src/features/translation/hooks/`
- `src/features/translation/services/`
- `src/components/TranslationInput.tsx`
- `src/App.tsx`
- `src/types.ts`
- `src/constants.ts`
- `src/services/llmService/`

## Adjacent Modules

- `../settings/` manages provider and model configuration used by translation.
- `../../services/llmService/` executes provider/model calls.
- `../../entities/translation/` documents stable translation-related models.
- `../../components/` still contains part of the translation UI.

## Reading Guide

- UI parts: `./components/README.md` or `./components/README.zh.md`
- state hooks: `./hooks/README.md` or `./hooks/README.zh.md`
- business services: `./services/README.md` or `./services/README.zh.md`
