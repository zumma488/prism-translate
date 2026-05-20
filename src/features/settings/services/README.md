[简体中文](./README.zh.md) | **English**

# `src/features/settings/services/`

## Purpose

This directory contains settings feature business services and settings-specific persistence rules.

## Current Responsibilities

Current files include:
- `settingsPersistence.ts`
  - settings migration
  - persistence strategy
  - `activeModelKey` validation and fallback
  - execution-mode and stable model identity normalization
- `fetchProviderModels.ts`
  - execution-mode-aware provider model discovery
  - browser-direct and proxy model-fetch coordination
- `providerFetchedModels.ts`
  - fetched-model deduplication
  - selectable model-state shaping
  - merging selected fetched models into persisted provider models

This directory is also the intended home for:
- settings merge rules
- import/export rules
- settings validation policies

## Out Of Scope

This directory should not directly own:
- settings modal rendering
- low-level provider SDK access
- route handling

## Current Code Mapping

This directory works with:
- `../hooks/` for state orchestration
- `../../../services/` for shared config utilities
- `../../../entities/settings/` for stable settings model boundaries

## Adjacent Modules

- `../hooks/` manages settings state.
- `../../../services/` provides shared config IO and legacy compatibility utilities.

## Reading Guide

- settings feature overview: `../README.md` or `../README.zh.md`
- settings hooks: `../hooks/README.md` or `../hooks/README.zh.md`
- settings entities: `../../../entities/settings/README.md` or `../../../entities/settings/README.zh.md`
