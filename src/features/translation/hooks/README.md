[简体中文](./README.zh.md) | **English**

# `src/features/translation/hooks/`

## Purpose

This directory contains translation-specific React hooks for state orchestration and reusable workflow behavior.

## Current Responsibilities

Current hooks include:
- `usePersistedTargetLanguages.ts`
  - target language loading and persistence coordination
- `useTranslationRunner.ts`
  - translation execution state
  - progressive result collection
  - error dispatch for translation runs

## Out Of Scope

This directory should not directly own:
- final UI rendering
- low-level provider request code
- global settings management

## Current Code Mapping

These hooks work together with:
- `../components/` for UI rendering
- `../services/` for translation business logic
- `../../../services/llmService/` for actual provider/model execution

## Adjacent Modules

- `../components/` renders the states managed here.
- `../services/` contains task creation, grouping, and execution helpers.

## Reading Guide

- translation feature overview: `../README.md` or `../README.zh.md`
- translation components: `../components/README.md` or `../components/README.zh.md`
- translation services: `../services/README.md` or `../services/README.zh.md`
