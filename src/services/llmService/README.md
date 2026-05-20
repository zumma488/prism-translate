[简体中文](./README.zh.md) | **English**

# `src/services/llmService/`

## Purpose

`src/services/llmService/` is the main shared LLM/provider access layer on the `src/` side. It centralizes model creation, request execution helpers, response parsing, and provider-specific integration glue.

## Current Responsibilities

This directory currently owns:
- `createModel()` model instantiation behavior
- translation request execution helpers
- browser-direct provider execution helpers consumed by the translation feature
- `safeFetch` handling for pseudo-success upstream responses
- response cleanup such as `<think>` removal, JSON extraction, and result parsing

## Out Of Scope

This directory should not directly own:
- translation card rendering
- settings modal workflows
- page-level state management

## Current Code Mapping

Key files:
- `index.ts`
- `providers.ts`
- `safeFetch.ts`

## Adjacent Modules

- `../../features/translation/` consumes translation execution behavior exposed through this layer.
- `../../features/provider-management/` depends on provider metadata and provider wiring behavior here.
- `../../../server/` is the neighboring server-side execution boundary for API-backed calls.

## Reading Guide

- services overview: `../README.md` or `../README.zh.md`
- translation feature: `../../features/translation/README.md` or `../../features/translation/README.zh.md`
- provider management: `../../features/provider-management/README.md` or `../../features/provider-management/README.zh.md`
