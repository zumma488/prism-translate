[简体中文](./README.zh.md) | **English**

# `src/` Directory

## Purpose

`src/` is the main application code directory for the client-facing part of Prism Translate. It contains UI orchestration, feature modules, reusable components, shared configuration, i18n resources, hooks, and general utilities.

The current repository uses a mixed structure:
- `app/` owns App Router routes and API handlers.
- `server/` owns server-side execution boundaries.
- `src/` remains the main home for client logic and shared frontend code.

## Current Responsibilities

`src/` currently owns:
- client UI composition
- page-level orchestration in `App.tsx`
- feature modules under `src/features/`
- reusable UI components under `src/components/`
- provider metadata and static configuration under `src/config/`
- shared domain definitions that still partially live in `types.ts` and `constants.ts`
- i18n resources under `src/i18n/`
- frontend-facing hooks and utilities

Configuration boundary:
- `src/config/` and `src/constants.ts` only contain static data that is safe for the browser.
- server-only runtime settings belong outside this directory.
- real secrets must not be stored inside `src/`.

## Out Of Scope

`src/` should not be treated as the owner of:
- App Router route definitions
- API route handlers
- server-side provider proxy execution
- private runtime secret files

Those belong in `app/`, `server/`, or external secret storage.

## Current Code Mapping

Important entry points around this directory:
- `src/App.tsx`
- `src/main.tsx`
- `src/types.ts`
- `src/constants.ts`
- `src/features/`
- `src/components/`
- `src/services/`
- `src/config/`
- `src/i18n/`

## Adjacent Modules

- `../app/` provides routes, layout, and API handlers.
- `../server/` provides translation and provider execution logic behind the API layer.
- `./features/` defines business-oriented frontend capabilities.
- `./services/` provides shared config and LLM access infrastructure.

## Reading Guide

- UI structure: `./components/README.md` or `./components/README.zh.md`
- Business features: `./features/README.md` or `./features/README.zh.md`
- Service layer: `./services/README.md` or `./services/README.zh.md`
- Provider metadata: `./config/README.md` or `./config/README.zh.md`
- i18n: `./i18n/README.md` or `./i18n/README.zh.md`
