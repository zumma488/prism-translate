[简体中文](./README.zh.md) | **English**

# `src/features/translation/services/`

## Purpose

This directory contains translation feature business services. It is the main place for task creation, translation workflow coordination, result shaping, and translation-specific persistence helpers.

## Current Responsibilities

Current files include:
- `translationOrchestrator.ts`
  - task generation
  - enabled model resolution
  - expected result count calculation
  - result sorting and grouping
- `translationExecutionService.ts`
  - concurrent task execution
  - browser-direct and server-proxy execution branching
  - progressive task-view/result callbacks
  - retry and task-error classification
- `translationRunnerDecision.ts`
  - target-language change decisions
  - incremental translation eligibility checks
- `translationTaskError.ts`
  - localized task error mapping
- `translationTone.ts`
  - localized tone label mapping
- `targetLanguagesPersistence.ts`
  - local persistence for target languages
  - validation and fallback behavior
- `translationStreamClient.ts`
  - translation stream request coordination with the API boundary for the streaming path

## Out Of Scope

This directory should not directly own:
- low-level provider SDK construction
- generic crypto/config utilities
- translation result rendering

## Current Code Mapping

This directory works with:
- `../hooks/` for feature state orchestration
- `../components/` for display
- `../../../services/llmService/` and API/server boundaries for provider execution
- `../../../../app/api/translate/task/route.ts` for per-task proxy execution

## Adjacent Modules

- `../../../services/llmService/` handles model/provider access details.
- `../../../entities/translation/` documents stable translation models.

## Reading Guide

- translation feature overview: `../README.md` or `../README.zh.md`
- translation hooks: `../hooks/README.md` or `../hooks/README.zh.md`
- LLM service layer: `../../../services/llmService/README.md` or `../../../services/llmService/README.zh.md`
