[简体中文](./README.zh.md) | **English**

# `src/components/settings/`

## Purpose

This directory contains the current reusable settings-facing view components used by the settings workflow.

## Current Responsibilities

Current files include:
- `ConnectProviderView.tsx`
- `EditProviderView.tsx`
- `ManageModelsView.tsx`

These components handle:
- provider connection UI
- provider edit UI
- model fetch and selection UI
- protocol selection UI for OpenAI and compatible providers

## Out Of Scope

This directory should not directly own:
- settings migration logic
- import/export core rules
- provider SDK wiring

## Current Code Mapping

This directory is still one of the active implementation centers for the settings flow, alongside `src/features/settings/`.

## Adjacent Modules

- `../../features/settings/` owns settings workflow boundaries.
- `../../features/provider-management/` owns provider-management rules.
- `../../services/` owns shared config infrastructure.

## Reading Guide

- components overview: `../README.md` or `../README.zh.md`
- settings feature: `../../features/settings/README.md` or `../../features/settings/README.zh.md`
- provider management: `../../features/provider-management/README.md` or `../../features/provider-management/README.zh.md`
