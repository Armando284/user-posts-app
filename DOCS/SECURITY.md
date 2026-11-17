# Security Review

Last reviewed: 2026-11-17

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
- An OWASP ZAP baseline scan was completed on 2026-11-17 against the local production container and
  JSONPlaceholder: 0 high, 1 medium, 2 low, and 3 informational findings. The scan is not a
  penetration test; see the scan section for scope and limitations.
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
- Response headers observed on the external API (`X-Powered-By`, missing HSTS, cache-control) are
  not controlled by this application and are discussed in the OWASP ZAP section.

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
| A05 Security Misconfiguration          | No secrets or production source maps are committed. The Nginx production container sets security                                              |
|                                        | headers (CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy);                                                  |
|                                        | Vite preview does not. CSP still permits `style-src 'unsafe-inline'`; see the ZAP scan section.                                               |
| A06 Vulnerable and Outdated Components | Audit is clean after the `typescript-eslint` update. Dependencies are locked with `pnpm-lock.yaml`.                                           |
| A07 Identification and Authentication  | Not applicable; the app has no login or user accounts.                                                                                        |
| A08 Software and Data Integrity        | Dependencies are lockfile-controlled and there are no external scripts or CDNs. CI should enforce `pnpm audit` and review dependency updates. |
| A09 Security Logging and Monitoring    | No client-side security logging or monitoring exists. This is acceptable for a demo but insufficient for a production service.                |
| A10 Server-Side Request Forgery        | Not applicable; all requests are made by the browser to a fixed public origin.                                                                |

Additional checks:

- No `target="_blank"` links, so reverse tabnabbing is not applicable.
- No state-changing API requests or cookies, so CSRF is not applicable in the current scope.
- Clickjacking protection is configured in the Nginx container via `X-Frame-Options: DENY` and
  `frame-ancestors 'none'`; Vite preview does not set these headers.

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
app is hardened further. Zod JIT compilation is disabled with `z.config({ jitless: true })` so the
policy does not require `'unsafe-eval'`.

HSTS is not set by `nginx.conf` because the container serves HTTP; configure it at the TLS
terminator on the hosting platform or reverse proxy.

## OWASP ZAP baseline scan

A ZAP baseline scan (ZAP by Checkmarx 2.17.0) was completed on 2026-11-17 against:

- Local production container: `http://192.168.122.1:8080`
- External API: `https://jsonplaceholder.typicode.com`

Report summary: **6 alerts — High 0, Medium 1, Low 2, Informational 3.**

This was a passive baseline scan, not a penetration test. It did not cover every application flow,
HTTP method, or OWASP Top 10 category. It also did not exercise authenticated or state-changing
requests (none exist in this client-only app). The absence of high-risk findings does not mean the
application has no security risk.

Findings affecting this application:

| Risk          | Finding                                      | Target                      | Assessment                                                                                                                                                          |
| :------------ | :------------------------------------------- | :-------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Medium        | CSP: `style-src` unsafe-inline               | `http://192.168.122.1:8080` | Nginx permits inline styles. Sonner passes inline CSS variables and Motion applies inline animation styles, so the directive was retained pending nonce/hash work.  |
| Informational | Information Disclosure - Suspicious Comments | `http://192.168.122.1:8080` | Pattern matched minified bundle string literals (API URL and user-facing error messages); not source comments, credentials, or a meaningful information disclosure. |
| Informational | Modern Web Application                       | `http://192.168.122.1:8080` | Informational detection about the client-rendered app; no remediation required.                                                                                     |

Findings affecting the external JSONPlaceholder API:

| Risk          | Finding                             | Target                                 | Assessment                                                                                               |
| :------------ | :---------------------------------- | :------------------------------------- | :------------------------------------------------------------------------------------------------------- |
| Low           | `X-Powered-By` header               | `https://jsonplaceholder.typicode.com` | External API discloses Express. This header is not set by this project's Nginx configuration.            |
| Low           | HSTS header not set                 | `https://jsonplaceholder.typicode.com` | External API response lacks HSTS. HSTS for this app belongs at its HTTPS terminator.                     |
| Informational | Re-examine Cache-control Directives | `https://jsonplaceholder.typicode.com` | External API allows caching (observed `max-age=43200`). Outside app control; review if that API changes. |

Report note: the alert-type table lists Suspicious Comments with a count of 3 while the risk
summary totals three informational alerts and includes one request instance. This review records
the inspected instance and does not claim three separate disclosures.

Recommended follow-up: re-run the ZAP baseline scan in CI or another environment with working
container registry access, archive the report as a build artifact, and treat findings on
jsonplaceholder.typicode.com as outside this project's control.

## Known limitations and follow-up work

- No backend, authentication, authorization, or server-side validation.
- Local posts are not persisted and are not protected from other users on the same device.
- No rate limiting, monitoring, or security event logging.
- No automated CSP/header verification or security regression suite.
- No dependency update automation yet.
- Security headers are enforced by the Nginx container, not by the current static preview.
- CSP still permits `style-src 'unsafe-inline'` for the current toast and animation styles.
- External headers such as `X-Powered-By`, missing HSTS, and cache-control are outside this application's control.
- The OWASP ZAP baseline scan is a limited automated check, not a full penetration test.
