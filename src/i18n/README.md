[简体中文](./README.zh.md) | **English**

# `src/i18n/`

## Purpose

`src/i18n/` contains UI internationalization resources and initialization logic.

## Current Responsibilities

This directory currently owns:
- UI locale resource management
- UI language switching support
- separation between UI language and translation target language concepts

## Out Of Scope

This directory should not directly own:
- translation result content
- provider/model logic
- settings persistence rules

## Current Code Mapping

This directory contains the frontend i18n setup used by the application UI.

## Adjacent Modules

- `../components/` consumes translated UI strings.
- `../features/translation/` depends on the distinction between UI locale and translation target language.

## Reading Guide

- components: `../components/README.md` or `../components/README.zh.md`
- translation feature: `../features/translation/README.md` or `../features/translation/README.zh.md`
