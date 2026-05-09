# Security Policy

## Supported Versions

Prism Translate is developed on the `main` branch. Security fixes are best-effort and are typically prepared against the latest code on `main`.

## Reporting a Vulnerability

Security issues are reported through public GitHub issues for this repository.

Before posting:

- remove or rotate any live API keys
- do not attach exported `.prism` files with real credentials
- do not paste raw request payloads or logs that include secrets
- redact provider headers, tokens, account identifiers, or request bodies

If you cannot describe the issue safely without exposing secrets, rotate the affected credentials first and then post a sanitized report.

When reporting, include:

- a clear description of the issue
- reproduction steps or a proof of concept
- impact assessment
- any proposed mitigations if you already have them

## Scope Notes

Please pay special attention to:

- provider credential handling
- exported `.prism` files that may contain secrets
- browser-side storage of provider configuration
- server/API proxy behavior and request handling
- request-body logging or third-party observability that could capture secrets in transit

## Disclosure

Because reporting is public for this repository, please keep disclosures focused on sanitized reproduction details and impact. Do not publish secrets while discussing a vulnerability.
