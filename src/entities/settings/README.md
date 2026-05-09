[简体中文](./README.zh.md) | **English**

# `src/entities/settings/`

## Purpose

This directory documents the stable settings-related domain models shared across settings flows, import/export, and persistence logic.

## Current Responsibilities

This area is intended to cover concepts such as:
- `AppSettings`
- `ActiveModelKey`
- `LanguageModelBindings`
- import/export payloads
- settings migration state

## Out Of Scope

This directory should not directly own:
- settings UI behavior
- local storage implementation details
- provider API calls

## Current Code Mapping

Current implementations mainly still live in:
- `src/types.ts`
- `src/services/configIO.ts`
- browser storage-related settings utilities

## Adjacent Modules

- `../../features/settings/` uses these concepts.
- `../../services/` contains config IO and persistence helpers.

## Reading Guide

- entities overview: `../README.md` or `../README.zh.md`
- settings feature: `../../features/settings/README.md` or `../../features/settings/README.zh.md`
