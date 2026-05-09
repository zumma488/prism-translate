[简体中文](./README.zh.md) | **English**

# `src/components/ui/`

## Purpose

This directory contains base UI primitives and visual infrastructure. These components are generic building blocks rather than business-specific views.

## Current Responsibilities

This directory is suitable for:
- buttons
- dialogs
- popovers
- inputs
- tabs
- sheets
- other shadcn/ui-style primitives

## Out Of Scope

This directory should not contain:
- business-specific translation components
- business-specific settings views
- feature orchestration logic

## Current Code Mapping

This is the base UI layer used by reusable and feature-specific components elsewhere in `src/components/` and `src/features/`.

## Adjacent Modules

- `../settings/` contains settings-specific UI.
- `../../features/` contains business modules that compose these primitives.

## Reading Guide

- components overview: `../README.md` or `../README.zh.md`
- settings UI: `../settings/README.md` or `../settings/README.zh.md`
