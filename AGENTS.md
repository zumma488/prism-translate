# AGENTS.md

This is the single project-level guide for AI agents working in `prism-translate`.

## Project

`prism-translate` is a multi-language, multi-model, multi-provider AI translation comparison workspace.

Core idea:
- One input can be translated by multiple models.
- Target languages can bind to different model sets.
- Users compare translation quality across providers and models.

## Read First

Do not scan the whole repository by default. Read only what the task needs.

Start here:
1. `README.md` or `README.zh.md`
2. `src/README.md` or `src/README.zh.md`
3. The relevant module README pair

Then choose the relevant module:
- Translation flow: `src/features/translation/README.md` or `src/features/translation/README.zh.md`
- Settings and configuration: `src/features/settings/README.md` or `src/features/settings/README.zh.md`
- Provider management: `src/features/provider-management/README.md` or `src/features/provider-management/README.zh.md`
- LLM/provider service layer: `src/services/README.md` and `src/services/llmService/README.md`
- UI components: `src/components/README.md`
- Core entities: `src/entities/README.md`
- Provider metadata: `src/config/README.md`
- i18n: `src/i18n/README.md`

## Current State

The repository is in a documentation-driven architecture alignment phase.

Important realities:
- `app/` owns App Router routes, layout, and API route handlers.
- `server/` owns server-side translation, model, and provider logic behind API boundaries.
- `src/` still contains most reusable UI, feature state, shared config, i18n, hooks, and utilities.
- `App.tsx` is still a meaningful orchestration point for the client UI.
- Some business code still lives in `components/`, `services/`, `config/`, `types.ts`, and `constants.ts`.
- `features/` and `entities/` are real navigation boundaries, but not every responsibility has been fully migrated yet.

## Architecture Direction

Prefer evolving toward:
- `features/` for business capabilities
- `entities/` for stable domain models
- `services/` and `server/` for infrastructure and integration boundaries
- `components/` for reusable UI, with business-specific UI gradually moving into features
- README pairs as the source of navigation and module boundary documentation

Keep these principles:
- Multi-model comparison is core, not an add-on.
- Provider abstraction must stay unified.
- Settings/configuration are first-class capabilities.
- Translation orchestration and result presentation should be separated over time.
- Documentation should support both root-to-module and module-to-neighbor navigation.

## Working Rules

For analysis tasks:
- Start from the root README and `src/README`.
- Then enter only the relevant module README.
- Do not begin by blindly reading many source files.

For code changes:
- Identify the feature area first: `translation`, `settings`, `provider-management`, `services`, `config`, `components`, or `server`.
- Read that module's README before making structural changes.
- If adding a directory or changing module boundaries, update the related README navigation.

For architecture/docs work:
- Keep current-state descriptions in the relevant existing README files.
- Keep future direction clearly marked as future direction, not current implementation fact.
- Do not reintroduce references to missing `docs/architecture/*` files unless those docs are actually created.

For git work:
- Check `git status` before committing.
- Do not commit `.env`, exported `.prism` files, provider secrets, or debug credentials.
- Commit messages should use Conventional Commits in English.

## Module Boundaries

`translation` owns:
- input text
- target language management
- translation task creation and orchestration
- result grouping, sorting, and comparison

`settings` owns:
- provider configuration
- model management
- default model selection
- import/export
- persistence and migration

`provider-management` owns:
- provider onboarding and management rules
- provider metadata coordination with settings

`services` / `server` own:
- model creation
- provider calls
- `safeFetch`
- response parsing
- config IO and crypto utilities
- server-side request execution boundaries

`entities` owns:
- stable core data models

## Security Notes

This project still stores provider credentials on the browser side for user-managed configuration flows.

Do not describe the current local encryption or localStorage storage as enterprise-grade secret security. API keys and exported `.prism` files must be treated as sensitive.

## Verification

Minimum checks for code changes:
- `npm run lint`
- `npm run build`

Use `npm run dev` for local validation when UI, translation flow, or API behavior changes.

## Do Not

1. Do not assume `features/` and `entities/` are fully implemented just because README files exist.
2. Do not bypass module README files before broad refactors.
3. Do not scatter provider business rules across unrelated components.
4. Do not mix reusable UI in `components/ui` with business-specific components.
5. Do not commit secrets, `.env`, exported configs, or temporary debug files.
