# Contributing to Prism Translate

Thanks for helping improve Prism Translate. This project is still aligning its architecture while staying usable, so small, well-scoped contributions are especially helpful.

## Before You Start

- Read [README.md](README.md) and [src/README.md](src/README.md).
- Follow the module README guidance in `src/features/*`, `src/services/*`, or other relevant areas before making structural changes.
- Check for existing issues or pull requests before starting overlapping work.

## Development Setup

```bash
git clone https://github.com/zumma488/prism-translate.git
cd prism-translate
npm install
npm run dev
```

Optional local override:

```bash
cp .env.example .env.local
```

## Contribution Guidelines

- Keep changes focused and avoid unrelated refactors.
- Respect the current architecture direction described in `AGENTS.md` and the module READMEs.
- Do not commit secrets, `.env` files, exported `.prism` files, or provider credentials.
- Keep user-facing and governance docs bilingual when a Chinese counterpart already exists.
- If you add or move module boundaries, update the related README navigation.

## Code Style And Verification

- Use TypeScript-friendly, incremental changes that fit the existing codebase.
- Run the minimum verification before opening a pull request:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run check
```

- Include manual validation notes when your change affects UI, translation flow, or API behavior.
- Never include live API keys, exported `.prism` files, raw provider payloads, or screenshots/logs that expose credentials.

## Pull Requests

- Use a clear title and describe the problem your change solves.
- Link related issues when applicable.
- Summarize user-visible behavior changes and any follow-up work.
- Add screenshots or recordings for UI changes when they improve review clarity.

## Commit Messages

Use Conventional Commits in English, for example:

- `docs: add bilingual community health files`
- `fix: handle provider model fetch timeout`
- `feat: improve translation result grouping`

## Reporting Issues

- Use GitHub Issues for bug reports, feature requests, and security-related problems.
- If a report is security-sensitive, redact secrets before posting and avoid attaching raw payloads or exported `.prism` files.
- Include reproduction steps, expected behavior, and environment details when possible.
