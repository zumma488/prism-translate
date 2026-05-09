[简体中文](./README.zh.md) | **English**

# `src/features/settings/components/`

## Purpose

This directory represents settings-specific UI components and the intended boundary for user-facing settings views.

## Current Responsibilities

The current implementation is still mostly located in:
- `src/components/SettingsModal.tsx`
- `src/components/settings/ConnectProviderView.tsx`
- `src/components/settings/EditProviderView.tsx`
- `src/components/settings/ManageModelsView.tsx`

This area is responsible for:
- settings UI composition
- provider edit flows
- provider connection flows
- model management views

## Out Of Scope

This directory should not directly own:
- config migration rules
- import/export core logic
- generic crypto handling

## Current Code Mapping

Settings UI still spans both this feature boundary and `src/components/settings/`.

## Adjacent Modules

- `../hooks/` owns settings state orchestration.
- `../services/` owns settings business services.
- `../../../components/settings/` contains the current reusable settings view implementation.

## Reading Guide

- settings feature overview: `../README.md` or `../README.zh.md`
- settings hooks: `../hooks/README.md` or `../hooks/README.zh.md`
- shared settings UI: `../../../components/settings/README.md` or `../../../components/settings/README.zh.md`
