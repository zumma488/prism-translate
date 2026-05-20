# Changelog

All notable changes to this project should be documented in this file.

The format is based on Keep a Changelog, and this project generally follows Semantic Versioning for tagged releases. GitHub Releases are maintained manually.

## [Unreleased]

## [0.3.0] - 2026-05-20

### Added

- Routed settings center pages under `/settings`, including dedicated general, language binding, provider management, and about views.
- Translation execution mode controls with `browser-direct` and `server-proxy`.
- `/api/translate/task` for single-task server-side translation execution used by the new proxy flow.
- Task-level translation status views for pending, running, retrying, success, and per-task failure presentation.
- Community health files in English and Simplified Chinese.
- GitHub issue templates, pull request template, CI workflow, and Dependabot configuration.
- ESLint, Vitest, and baseline quality-gate scripts for linting, type checking, testing, and full verification.
- `CODEOWNERS` for repository review ownership.
- Targeted tests covering settings persistence, fetched provider models, translation execution, runner decisions, and orchestrator behavior.
- Provider model discovery helpers, fetched-model selection/merge flows, and stable model UIDs for duplicate model IDs.

### Changed

- Translation execution now runs through frontend-owned concurrent task orchestration with retries and progressive task-state updates.
- When users add target languages after a completed run, the app now translates only the newly added languages instead of clearing and rerunning every existing result.
- In `browser-direct` mode, providers that cannot run directly now surface an explicit task-level warning/error state instead of silently falling back to server proxy execution.
- The settings experience now spans a routed settings shell in `app/settings/*` while preserving legacy modal-backed compatibility views under `src/components/settings/`.
- Default model selection now uses stable provider/model identity keys, and persisted settings now normalize execution mode and legacy model IDs in storage version `v6`.
- Root and module READMEs now describe the routed settings center, execution-mode boundaries, browser-direct trust behavior, and incremental task-based translation flow more explicitly.
- Refreshed core UI surfaces, status badges, and workspace navigation to support the new settings center and richer translation result states.
- Root READMEs now link to governance documents and describe the checked-in CI workflow accurately.
- Removed the root README banner blocks to keep repository entry docs focused on project and community guidance.
- Package metadata now aligns with the public project identity of Prism Translate.
- Security wording now reflects the current browser-managed, plaintext-export trust model more explicitly.
