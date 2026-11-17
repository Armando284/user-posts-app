# Security Review

Last reviewed: 2026-11-16

## Scope

This is a client-only React single-page application. It has no backend, authentication, user
accounts, server-side validation, or persistent write API. The production build is served as
static files and reads from the public JSONPlaceholder API.

The review covers dependencies, unsafe HTML rendering, external API interaction, error handling,
secrets, and applicable OWASP Top 10 risks.

## Summary

- No high, critical, or runtime dependency vulnerabilities remain.
- One moderate development-only vulnerability was found and fixed by updating
  `typescript-eslint` from `8.72.2` to `8.73.0`.
- No unsafe HTML sinks or dynamic code execution were found. ESLint rules now reject common
  unsafe HTML sinks, `eval`, and the `Function` constructor.
- No secrets, credentials, environment files, or private keys are committed.
- The optional OWASP ZAP baseline scan was not completed in this environment.
- The main residual risks are deployment configuration (HTTPS and security headers) and the
  absence of a trusted backend for authorization, validation, rate limiting, and persistence.

## Dependency audit

The initial full audit reported:

```text
1 vulnerabilities found
Severity: 1 moderate
Package: minimatch >=7.0.0 <11.0.1
Path: typescript-eslint -> @typescript-eslint/typescript-estree -> minimatch
Advisory: GHSA-g3hv-75wg-m249
```

The vulnerable package was only reachable through lint tooling and was not shipped in the
production bundle. It was resolved by upgrading `typescript-eslint` to `8.73.0`, which uses
`minimatch@11.0.8`.

Final audit results:

```text
pnpm audit        -> No known vulnerabilities found
pnpm audit --prod -> No known vulnerabilities found
pnpm audit --dev  -> No known vulnerabilities found
```

The lockfile contains one `minimatch` version (`11.0.8`). `pnpm-workspace.yaml` records the
`minimumReleaseAgeExclude` entries required for the explicitly requested security update.

## Unsafe HTML rendering

No occurrences of the following were found in application code:

- `dangerouslySetInnerHTML`
- `innerHTML`, `outerHTML`, or `insertAdjacentHTML`
- `document.write`, `eval`, or `new Function`
- User-controlled `href`, `src`, `srcdoc`, or `javascript:` URLs
- Dynamically injected scripts or external script tags

Post titles and bodies are rendered as React text nodes, which escape HTML by default. The app
does not render user-provided links, media, or raw markup.

`eslint.config.js` now enforces guards against future unsafe HTML rendering and dynamic code
execution.

## External API and error handling

- The API origin is a constant HTTPS URL: `https://jsonplaceholder.typicode.com`.
- The app only performs `GET /users` and `GET /posts?userId=<id>` requests.
- User IDs are encoded with `URLSearchParams`; no request URL is built from free-form input.
- Requests do not include cookies, authorization headers, tokens, or secrets.
- Network failures, invalid JSON, and non-success HTTP statuses are caught and converted to
  safe user-facing messages. Raw browser errors and stack traces are not rendered.
- Created posts are local UI state only. They are not sent to the API and are lost on reload.

Limitations:

- The public demo API has no availability or integrity guarantee.
- There is no request timeout or `AbortController`; a stalled request can remain pending.
- There is no server-side validation of post title or body.
- There is no client-side rate limiting.

## OWASP Top 10 review

| Risk                                   | Assessment                                                                                                                                    |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| A01 Broken Access Control              | Not applicable in the current client-only app; there are no privileged operations. A future backend must enforce authorization server-side.   |
| A02 Cryptographic Failures             | No secrets, authentication tokens, cookies, or sensitive data are handled. Deploy the static build over HTTPS.                                |
| A03 Injection                          | Low risk. React escapes rendered text, no raw HTML is injected, no SQL or shell commands are used, and request parameters are URL-encoded.    |
| A04 Insecure Design                    | The app is a demo with no authentication or server-side business rules. Do not treat client-side validation as a security boundary.           |
| A05 Security Misconfiguration          | No secrets or production source maps are committed. Security headers are not configured by Vite preview; set them at the hosting layer.       |
| A06 Vulnerable and Outdated Components | Audit is clean after the `typescript-eslint` update. Dependencies are locked with `pnpm-lock.yaml`.                                           |
| A07 Identification and Authentication  | Not applicable; the app has no login or user accounts.                                                                                        |
| A08 Software and Data Integrity        | Dependencies are lockfile-controlled and there are no external scripts or CDNs. CI should enforce `pnpm audit` and review dependency updates. |
| A09 Security Logging and Monitoring    | No client-side security logging or monitoring exists. This is acceptable for a demo but insufficient for a production service.                |
| A10 Server-Side Request Forgery        | Not applicable; all requests are made by the browser to a fixed public origin.                                                                |

Additional checks:

- No `target="_blank"` links, so reverse tabnabbing is not applicable.
- No state-changing API requests or cookies, so CSRF is not applicable in the current scope.
- Clickjacking protection is not configured locally; use `frame-ancestors` or
  `X-Frame-Options` at the hosting layer.

## Recommended deployment headers

Configure these at the static host or reverse proxy:

```text
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://jsonplaceholder.typicode.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

The inline-style allowance is required by the current UI/toast implementation. Revisit it if the
app is hardened further.

## OWASP ZAP baseline scan

The optional scan was attempted against the local production preview:

- Docker was unavailable to the current user (socket permission denied).
- Podman was available, but the GHCR image request returned HTTP 403.
- Pulling the Docker Hub ZAP image did not finish within the 15-minute limit, so no scan report
  was produced.

Recommended follow-up: run the ZAP baseline scan in CI or another environment with working
container registry access and archive the report as a build artifact.

## Known limitations and follow-up work

- No backend, authentication, authorization, or server-side validation.
- Local posts are not persisted and are not protected from other users on the same device.
- No rate limiting, monitoring, or security event logging.
- No automated CSP/header verification or security regression suite.
- No dependency update automation yet.
- Security headers are documented but not enforced by the current static preview.
