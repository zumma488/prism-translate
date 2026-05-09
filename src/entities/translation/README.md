[简体中文](./README.zh.md) | **English**

# `src/entities/translation/`

## Purpose

This directory documents the stable translation-related domain models shared across translation UI, orchestration, and result handling.

## Current Responsibilities

This area is intended to cover concepts such as:
- `TranslationTask`
- `TranslationResult`
- translation grouping structures
- translation execution state
- language bindings

## Out Of Scope

This directory should not directly own:
- result card rendering
- low-level provider execution
- settings persistence logic

## Current Code Mapping

Current implementations mainly still live in:
- `src/types.ts`
- `src/constants.ts`
- `src/App.tsx`

## Adjacent Modules

- `../../features/translation/` uses these concepts.
- `../../services/` and API/server boundaries execute the workflows built on them.

## Reading Guide

- entities overview: `../README.md` or `../README.zh.md`
- translation feature: `../../features/translation/README.md` or `../../features/translation/README.zh.md`
