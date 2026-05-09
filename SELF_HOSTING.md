# Self-Hosting

[简体中文](./SELF_HOSTING.zh.md) | **English**

## Overview

Prism Translate can be run locally or deployed to your own hosting environment. The current architecture is designed around browser-managed provider configuration plus server-side API execution for translation and model discovery.

## Local Development

Typical local workflow:

```bash
npm install
npm run dev
```

Optional runtime override:

```bash
cp .env.example .env.local
```

The only documented environment variable today is:
- `REQUEST_TIMEOUT_MS`

Provider credentials are not loaded from environment variables by default. Users configure them in the app UI.

## Hosted Deployment Expectations

This repository is compatible with standard Next.js hosting, including Vercel.

Important runtime expectations:
- translation and model discovery run through server-side API routes
- browser users send provider configuration to those API routes during operations
- long upstream requests depend on your platform timeout limits

## Vercel Notes

Current code paths are optimized for Vercel-compatible deployment, but there are still practical limits:
- route execution time is finite
- very slow upstream providers can still hit platform duration limits
- request timeouts are clamped to stay below Vercel route duration limits

If you self-host outside Vercel, review your platform timeout, logging, and observability defaults carefully.

## Custom Endpoints And Ollama

Some provider setups need extra care:
- default local `ollama` endpoints are not reachable from a hosted deployment unless you expose them through a reachable network endpoint
- custom or OpenAI-compatible endpoints must be reachable from the deployed server runtime
- provider-specific headers or account settings must be supplied by the user through the app configuration model

## Who This Architecture Fits

Good fit:
- personal use
- trusted internal teams
- self-hosted comparison workspaces
- controlled environments where users understand the credential model

Poor fit:
- public multi-tenant hosting where operators should never handle user credentials
- environments that require strong secret isolation from the deployer
- deployments that log request bodies or forward raw payloads to third-party observability services

## Operational Recommendations

- disable or tightly control request-body logging
- treat exported `.prism` files as sensitive
- rotate any credential that was pasted into an issue or log by mistake
- review your reverse proxy, CDN, and observability pipeline for secret exposure risk

For the precise credential and trust boundary flow, see [TRUST_MODEL.md](TRUST_MODEL.md).
