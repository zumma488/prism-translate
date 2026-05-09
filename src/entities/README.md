[简体中文](./README.zh.md) | **English**

# `src/entities/`

## Purpose

`src/entities/` documents the stable, reusable, cross-module domain models of the project.

## Current Responsibilities

This layer is meant to define and normalize concepts such as:
- provider-related models
- settings-related models
- translation-related models

It is already the documentation boundary for those concepts, even though some actual type definitions still live elsewhere.

## Out Of Scope

This directory should not directly own:
- UI rendering
- provider SDK wiring
- feature workflow orchestration

## Current Code Mapping

Some current implementations are still located in:
- `src/types.ts`
- `src/constants.ts`
- `src/config/models.ts`

## Adjacent Modules

- `../features/` uses entity concepts as shared business language.
- `../services/` uses them for config and execution logic.
- `../config/` provides related static metadata.

## Reading Guide

- provider entities: `./provider/README.md` or `./provider/README.zh.md`
- settings entities: `./settings/README.md` or `./settings/README.zh.md`
- translation entities: `./translation/README.md` or `./translation/README.zh.md`
