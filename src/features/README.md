[简体中文](./README.zh.md) | **English**

# `src/features/`

## Purpose

`src/features/` contains business-capability modules. It is the main frontend boundary for product behavior, organized by use case instead of by file type.

## Current Responsibilities

This layer currently groups:
- `translation/` for translation workflow and comparison behavior
- `settings/` for provider settings, model management, import/export, and persistence-facing state
- `provider-management/` for provider onboarding and provider-management rules

It is already used as a real documentation and code boundary, even though some implementation is still distributed across older directories.

## Out Of Scope

`src/features/` should not directly own:
- low-level provider SDK wiring
- generic crypto and config IO utilities
- App Router route definitions
- purely presentational base UI primitives

Those belong in `src/services/`, `server/`, `app/`, or `src/components/ui/`.

## Current Code Mapping

Main submodules:
- `./translation/`
- `./settings/`
- `./provider-management/`

Some responsibilities are still shared with:
- `../components/`
- `../services/`
- `../config/`
- `../types.ts`
- `../constants.ts`

## Adjacent Modules

- `../components/` contains reusable UI and partially migrated business UI.
- `../services/` contains shared infrastructure used by feature modules.
- `../entities/` defines stable domain models that features rely on.

## Reading Guide

- Translation workflow: `./translation/README.md` or `./translation/README.zh.md`
- Settings workflow: `./settings/README.md` or `./settings/README.zh.md`
- Provider management: `./provider-management/README.md` or `./provider-management/README.zh.md`
