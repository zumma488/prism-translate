[简体中文](./README.zh.md) | **English**

# `src/components/`

## Purpose

`src/components/` contains reusable UI components and page-level interface pieces that have not all been fully moved into feature-specific directories yet.

## Current Responsibilities

This directory currently includes:
- translation input UI
- settings modal UI
- shared interaction components
- base UI primitives under `ui/`
- settings-related view components under `settings/`

## Out Of Scope

This directory should not become the permanent home for:
- low-level provider logic
- settings persistence rules
- translation orchestration services

Those belong in features or services.

## Current Code Mapping

Representative files:
- `TranslationInput.tsx`
- `SettingsModal.tsx`
- `ModelSelectorPopover.tsx`
- `Header.tsx`
- `LanguageSwitcher.tsx`

## Adjacent Modules

- `../features/translation/` owns translation business behavior.
- `../features/settings/` owns settings state and business rules.
- `./settings/` contains settings-oriented UI.
- `./ui/` contains base UI primitives.

## Reading Guide

- base UI: `./ui/README.md` or `./ui/README.zh.md`
- settings UI: `./settings/README.md` or `./settings/README.zh.md`
- translation feature: `../features/translation/README.md` or `../features/translation/README.zh.md`
