# Support

[简体中文](./SUPPORT.zh.md) | **English**

## Where To Ask For Help

Use GitHub Issues as the primary support channel for this repository.

- Open a bug report when you can reproduce incorrect behavior.
- Open a feature request when you want to propose a product or workflow improvement.
- Open a general issue for setup, deployment, or provider-compatibility questions if no existing template fits.

## Before Opening An Issue

- Read [README.md](README.md).
- Check [SELF_HOSTING.md](SELF_HOSTING.md) for deployment/runtime questions.
- Check [TRUST_MODEL.md](TRUST_MODEL.md) for credential-flow and trust-boundary questions.
- Search existing issues before opening a new one.

## Bug Reports Vs Feature Requests

Use a bug report when:
- the app crashes
- a provider flow fails unexpectedly
- translations, settings, import/export, or model fetches behave incorrectly
- the documented setup does not work as described

Use a feature request when:
- you want support for a new workflow or provider capability
- you want UX improvements
- you want better deployment, documentation, or contributor tooling

## Security-Sensitive Issues

Security-related problems are still reported through public GitHub Issues for this repository.

Before posting:
- rotate or remove any live credentials
- do not attach exported `.prism` files containing real data
- do not post raw request payloads, provider headers, or logs with secrets
- sanitize screenshots before uploading them

If you cannot describe the problem safely in public, rotate the affected credentials first and then post a sanitized report. See [SECURITY.md](SECURITY.md) for the reporting rules.

## What To Include

When asking for help, include:
- what you were trying to do
- your environment: browser, OS, Node version, deployment target
- provider family involved, if relevant
- exact error message or visible behavior
- minimal reproduction steps

## Out Of Scope

This repository does not currently promise:
- private support channels
- SLA-backed response times
- managed hosting support for third-party deployments

Support is best-effort and happens in the open so other users can benefit from the answers.
