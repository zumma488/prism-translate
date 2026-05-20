[简体中文](./README.zh.md) | **English**

# `src/features/settings/components/`

## Purpose

This directory represents settings-specific UI components and the intended boundary for user-facing settings views.

## Current Responsibilities

The current implementation is currently split between routed settings page clients here and legacy reusable views in `src/components/settings/`.

Key routed settings page clients include:
- `SettingsShell.tsx`
- `SettingsPageHeader.tsx`
- `GeneralSettingsPageClient.tsx`
- `LanguageSettingsPageClient.tsx`
- `ProviderSettingsPageClient.tsx`
- `ProviderModelsPageClient.tsx`
- `ConnectProviderPageClient.tsx`
- `ProviderEditorPageClient.tsx`
- `AboutSettingsPageClient.tsx`
- `ExecutionModeSettingsCard.tsx`
- `FetchedModelsSelectionDialog.tsx`
- `ImportConflictDialog.tsx`
- `SettingsToast.tsx`

Reusable compatibility views and dialogs still include:
- `src/components/SettingsModal.tsx`
- `src/components/settings/ConnectProviderView.tsx`
- `src/components/settings/EditProviderView.tsx`
- `src/components/settings/ManageModelsView.tsx`

This area is responsible for:
- settings UI composition
- the routed settings shell for `/settings/general`, `/settings/languages`, `/settings/providers`, and `/settings/about`
- provider list and navigation flows
- provider selection and provider create/edit page flows
- model management views
- execution-mode selection UI
- fetched-model selection dialogs and import/export feedback affordances
- mobile settings-shell navigation and sheet accessibility wiring

## Out Of Scope

This directory should not directly own:
- config migration rules
- import/export core logic
- generic compatibility utilities

## Current Code Mapping

Settings UI still spans both this feature boundary and `src/components/settings/`. The current routed flow is settings shell -> general/languages/providers/about, and the provider sub-flow is list -> select -> create/edit -> model management.

## Adjacent Modules

- `../hooks/` owns settings state orchestration.
- `../services/` owns settings business services.
- `../../../components/settings/` contains the current reusable settings view implementation.

## Reading Guide

- settings feature overview: `../README.md` or `../README.zh.md`
- settings hooks: `../hooks/README.md` or `../hooks/README.zh.md`
- shared settings UI: `../../../components/settings/README.md` or `../../../components/settings/README.zh.md`
