[简体中文](./README.zh.md) | **English**

# `src/services/`

## Purpose

`src/services/` is the shared infrastructure layer for frontend-adjacent services. It currently contains configuration IO, legacy compatibility helpers, and LLM/provider access helpers used by feature modules.

## Current Responsibilities

This directory currently owns:
- LLM call wrapping
- provider model creation helpers
- `safeFetch`-style request guarding
- configuration import/export support
- legacy compatibility paths for older configuration formats

## Out Of Scope

This directory should not directly own:
- business-specific translation presentation
- settings modal rendering
- App Router route files

## Current Code Mapping

Key files:
- `configIO.ts`
- `crypto.ts`
- `llmService/index.ts`
- `llmService/providers.ts`
- `llmService/safeFetch.ts`

## Adjacent Modules

- `../features/` uses this directory for shared infrastructure.
- `../config/` provides static metadata consumed by services.
- `../../server/` is the server-side runtime boundary adjacent to this layer.

## Reading Guide

- LLM integration details: `./llmService/README.md` or `./llmService/README.zh.md`
- settings business context: `../features/settings/README.md` or `../features/settings/README.zh.md`
- translation business context: `../features/translation/README.md` or `../features/translation/README.zh.md`
