[简体中文](./README.zh.md) | **English**

# `src/features/translation/components/`

## Purpose

This directory contains translation-specific UI components that are closely tied to how translation input, grouping, comparison, and result presentation work.

## Current Responsibilities

This directory currently contains or documents:
- `TargetLanguageSelector.tsx`
- `TranslationOutputPanel.tsx`
- `TranslationGroup.tsx`
- `TranslationCard.tsx`

These components handle:
- target language selection UI
- translation result grouping UI
- output panel states such as loading and empty states
- per-result actions such as copy, collapse, hide, and speech-related interactions

## Out Of Scope

This directory should not directly own:
- low-level provider requests
- translation task orchestration
- generic settings UI

Those belong in feature hooks/services or other modules.

## Current Code Mapping

Still related outside this directory:
- `src/components/TranslationInput.tsx` remains part of the translation input surface.
- translation execution and result shaping live in `../hooks/` and `../services/`.

## Adjacent Modules

- `../hooks/` owns translation state orchestration.
- `../services/` owns translation business services.
- `../../../components/` still contains shared and partially migrated UI.

## Reading Guide

- translation feature overview: `../README.md` or `../README.zh.md`
- translation hooks: `../hooks/README.md` or `../hooks/README.zh.md`
- translation services: `../services/README.md` or `../services/README.zh.md`
