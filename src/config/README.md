[简体中文](./README.zh.md) | **English**

# `src/config/`

## Purpose

`src/config/` contains static provider configuration and metadata that is safe to expose to the browser.

## Current Responsibilities

This directory currently owns:
- provider static definitions
- default model collections
- provider display metadata

## Out Of Scope

This directory should not directly own:
- runtime provider instantiation
- private secrets
- translation execution logic

## Current Code Mapping

Key file:
- `models.ts`

## Adjacent Modules

- `../features/provider-management/` uses this metadata to drive provider management flows.
- `../services/llmService/` uses it when resolving provider/model behavior.
- `../entities/provider/` documents the related stable model concepts.

## Reading Guide

- provider management: `../features/provider-management/README.md` or `../features/provider-management/README.zh.md`
- LLM services: `../services/llmService/README.md` or `../services/llmService/README.zh.md`
