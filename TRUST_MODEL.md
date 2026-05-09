# Trust Model

[简体中文](./TRUST_MODEL.zh.md) | **English**

## Why This Document Exists

Prism Translate is not a zero-trust hosted secret manager. This document explains where provider credentials live, how they move through the system, and who must be trusted in the current architecture.

## Core Model

Today, the trust model is:
- users store provider configuration in their browser
- the browser sends provider configuration to the app's API routes when needed
- the server runtime uses that configuration to call upstream providers
- exported `.prism` files are plaintext JSON

This means the deployer/operator of a hosted instance is inside the trust boundary.

## Credential Flow

1. A user configures provider credentials in the browser UI.
2. Those settings are stored locally in the browser.
3. When the user fetches models or runs a translation, the browser sends provider configuration to:
   - `app/api/providers/models`
   - `app/api/translate/stream`
4. The server runtime receives that configuration and uses it to call the selected upstream provider.
5. Results are returned to the browser.

## Storage Reality

- Browser-side settings storage is local, user-managed, and not enterprise-grade secret storage.
- Exported `.prism` files are plaintext JSON.
- Legacy encrypted `.prism` imports are no longer supported.

## Trust Boundary

You must trust:
- the local machine running the browser
- the deployment operator of the app
- any infrastructure component that can inspect requests or logs

You should not assume:
- that the deployer is cryptographically isolated from user credentials
- that request payloads are safe if your platform logs bodies by default
- that this architecture is suitable for public multi-tenant hosting with strict secret-isolation requirements

## Observability And Logging Risks

Be careful with:
- request-body logging
- error logs that echo request payloads
- third-party observability or tracing tools
- reverse proxies or gateways that capture raw traffic

Any of these can expose provider credentials if misconfigured.

## Recommended Safe Use

Safer uses:
- local use
- self-hosting for yourself
- trusted internal environments

Riskier uses:
- public/shared hosted deployments
- environments where operators should never be able to inspect user-supplied credentials

For deployment-focused guidance, see [SELF_HOSTING.md](SELF_HOSTING.md). For issue reporting rules, see [SECURITY.md](SECURITY.md).
