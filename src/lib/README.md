[简体中文](./README.zh.md) | **English**

# `src/lib/`

## Purpose

`src/lib/` contains general-purpose utilities and helper functions that are only weakly coupled to specific business features.

## Current Responsibilities

This directory is suitable for:
- formatting helpers
- validation helpers
- conversion utilities
- small reusable support logic

## Out Of Scope

This directory should not become the long-term home for:
- provider business rules
- translation orchestration
- settings migration/import-export core logic

## Current Code Mapping

This directory is the general utility layer adjacent to feature-specific hooks and services.

## Adjacent Modules

- `../hooks/` contains reusable React adaptation logic.
- `../services/` contains heavier infrastructure concerns.
- `../features/` contains business-specific logic.

## Reading Guide

- hooks: `../hooks/README.md` or `../hooks/README.zh.md`
- services: `../services/README.md` or `../services/README.zh.md`
