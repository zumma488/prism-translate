[简体中文](./README.zh.md) | **English**

# `src/hooks/`

## Purpose

`src/hooks/` contains shared React hooks that are not clearly owned by a single feature module and can be reused across multiple areas.

## Current Responsibilities

This directory is suitable for:
- reusable cross-feature hooks
- hooks for generic UI state
- browser-capability hooks that still belong to the React adaptation layer

## Out Of Scope

This directory should not become the long-term home for:
- translation-specific business hooks
- settings-specific business hooks

Those should live under the corresponding feature directories.

## Current Code Mapping

This directory is the shared hook layer adjacent to `src/lib/` and feature-specific hooks.

## Adjacent Modules

- `../features/` owns feature-specific hooks.
- `../lib/` owns non-React general utilities.
- `../components/` consumes shared UI hooks.

## Reading Guide

- features overview: `../features/README.md` or `../features/README.zh.md`
- lib utilities: `../lib/README.md` or `../lib/README.zh.md`
