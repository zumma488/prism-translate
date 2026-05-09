[简体中文](./README.zh.md) | **English**

# `src/features/provider-management/services/`

## Purpose

This directory is the intended place for provider-management business services and provider onboarding rules.

## Current Responsibilities

It is intended to concentrate:
- provider onboarding rules
- provider capability mapping
- provider model-fetch coordination logic
- checklists for adding new providers

At the moment, most of these rules are still partially distributed outside this directory.

## Out Of Scope

This directory should not directly own:
- static provider metadata
- low-level model/provider instantiation
- translation UI

## Current Code Mapping

Related logic currently also lives in:
- `src/config/`
- `src/services/llmService/`
- settings-related UI and hooks

## Adjacent Modules

- `../../../config/` owns static provider definitions.
- `../../../services/llmService/` owns low-level provider/model wiring.
- `../../../entities/provider/` documents shared provider models.

## Reading Guide

- provider-management overview: `../README.md` or `../README.zh.md`
- provider entities: `../../../entities/provider/README.md` or `../../../entities/provider/README.zh.md`
- LLM service layer: `../../../services/llmService/README.md` or `../../../services/llmService/README.zh.md`
