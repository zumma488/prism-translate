[简体中文](./README.zh.md) | **English**

# `src/features/provider-management/`

## Purpose

`src/features/provider-management/` owns provider lifecycle rules, onboarding guidance, and the coordination boundary between provider metadata, settings flows, and provider-specific management behavior.

## Current Responsibilities

This module currently covers:
- the connection between provider types and provider instances
- provider onboarding rules
- provider-related entry points when adding a new provider
- coordination between provider settings UI and model-fetching flows

## Out Of Scope

This module should not directly own:
- translation result rendering
- page-level orchestration
- low-level fetch or provider SDK implementation

## Current Code Mapping

Current behavior is still distributed across:
- `src/config/models.ts`
- `src/components/settings/EditProviderView.tsx`
- `src/services/llmService/providers.ts`
- `src/features/provider-management/services/`

## Adjacent Modules

- `../settings/` owns settings state and configuration flows.
- `../../config/` owns static provider metadata.
- `../../services/llmService/` owns low-level provider/model wiring.
- `../../entities/provider/` documents provider-related stable models.

## Reading Guide

- provider-management services: `./services/README.md` or `./services/README.zh.md`
- settings feature: `../settings/README.md` or `../settings/README.zh.md`
- config metadata: `../../config/README.md` or `../../config/README.zh.md`
