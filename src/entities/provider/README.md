[简体中文](./README.zh.md) | **English**

# `src/entities/provider/`

## Purpose

This directory documents the stable provider-related domain models shared across provider management, settings, config, and service layers.

## Current Responsibilities

This area is intended to cover concepts such as:
- `ProviderDefinition`
- `ProviderConfig`
- `ProviderType`
- provider capability metadata

## Out Of Scope

This directory should not directly own:
- provider UI rendering
- runtime provider instantiation
- translation execution orchestration

## Current Code Mapping

Current implementations mainly still live in:
- `src/types.ts`
- `src/config/models.ts`
- `src/services/llmService/providers.ts`

## Adjacent Modules

- `../../features/provider-management/` depends on these concepts.
- `../../config/` contains static provider metadata.
- `../../services/` contains runtime provider access logic.

## Reading Guide

- entities overview: `../README.md` or `../README.zh.md`
- provider management: `../../features/provider-management/README.md` or `../../features/provider-management/README.zh.md`
