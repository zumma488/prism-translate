[简体中文](./README.zh.md) | **English**

# `src/features/settings/hooks/`

## Purpose

This directory contains settings-specific React hooks for state management and workflow coordination.

## Current Responsibilities

Current hooks include:
- `useAppSettings`
  - settings loading
  - persistence triggering
  - active model selection
  - active model normalization
  - language-model binding updates
- `useSettingsImportExport`
  - import/export flow
  - import conflict confirmation state
  - import/export feedback
- `useSettingsModalNavigation`
  - modal-internal navigation
  - mobile back behavior
- `useSettingsProviderEditing`
  - provider add/edit context
  - provider save/delete actions
  - edit-view initial state parsing

## Out Of Scope

This directory should not directly own:
- final settings view rendering
- low-level config IO implementation
- translation execution behavior

## Current Code Mapping

These hooks coordinate with:
- `../components/` for rendering
- `../services/` for settings business logic
- `../../../services/` for shared config infrastructure

## Adjacent Modules

- `../components/` renders the flows managed here.
- `../services/` contains persistence-facing business services.

## Reading Guide

- settings feature overview: `../README.md` or `../README.zh.md`
- settings services: `../services/README.md` or `../services/README.zh.md`
- shared services: `../../../services/README.md` or `../../../services/README.zh.md`
