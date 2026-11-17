# User Posts

A React application for discovering users, searching the directory, reading a user's posts, and creating posts locally. It is built as a small, production-shaped frontend exercise with typed API integration, server-state caching, accessible form validation, automated tests, and a container-ready production build.

The repository is public: <https://github.com/Armando284/user-posts-app>

## Features

- Load users and posts from JSONPlaceholder.
- Search users by name without additional API requests.
- Select a user and view their posts with loading, empty, and error states.
- Create posts with required-field validation and immediate local updates.
- Keep locally created posts while switching between users during the session.
- Retry failed user and post requests.
- Responsive layout with keyboard-accessible controls and announcements.
- Success and error notifications with reduced-motion support.
- Production container with Nginx SPA routing and security headers.

## Tech stack

- React 19 and TypeScript 6
- Vite 8 with Rolldown code splitting
- TanStack Query for server state
- React Hook Form and Zod for validation
- Tailwind CSS v4
- Sonner, Motion, and Lucide React for UI feedback
- Vitest, React Testing Library, jsdom, and MSW for tests
- Nginx for the production container

## Requirements

- Node.js 22 or later
- pnpm 12 or later
- Network access to `https://jsonplaceholder.typicode.com`
- Docker or Podman only if you want to run the container

This project was developed with Node.js 22.23 and pnpm 12.8.

## Installation

```bash
corepack enable
pnpm install
```

If Corepack is unavailable, install pnpm directly:

```bash
npm install --global pnpm@12
```

## Running locally

```bash
pnpm dev
```

Open <http://localhost:5173>.

## Available scripts

| Command             | Description                              |
| ------------------- | ---------------------------------------- |
| `pnpm dev`          | Start the Vite development server.       |
| `pnpm build`        | Type-check and build for production.     |
| `pnpm preview`      | Serve the production build locally.      |
| `pnpm lint`         | Run ESLint over the repository.          |
| `pnpm format`       | Format files with Prettier.              |
| `pnpm format:check` | Check formatting without changing files. |
| `pnpm typecheck`    | Run TypeScript project checks.           |
| `pnpm test`         | Start Vitest in watch mode.              |
| `pnpm test:run`     | Run the test suite once.                 |

Recommended verification before delivery:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test:run
pnpm build
pnpm audit
```

## Production container

The production image uses a multi-stage build: Node builds the static assets, then Nginx serves them.

```bash
docker build -t user-posts-app .
docker run --rm -p 8080:80 user-posts-app
```

Open <http://localhost:8080>. Podman works with the same Dockerfile:

```bash
podman build -t user-posts-app .
podman run --rm -p 8080:80 user-posts-app
```

The Nginx configuration:

- Falls back to `index.html` for client-side routes.
- Caches hashed assets for one year while keeping `index.html` uncached.
- Sets CSP, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and
  `Permissions-Policy` headers.
- Exposes `/healthz` for container health checks.

TLS and HSTS should be terminated at the hosting platform or reverse proxy.

The image was verified with Podman because the Docker daemon was unavailable in the build
environment. Container build, Nginx syntax, `/healthz`, SPA fallback, security headers, and a
browser smoke test all passed.

## Architecture

```text
src/
  api/          Typed fetch client and JSONPlaceholder endpoints
  components/   User directory, posts panel, form, feedback, and post list
  hooks/        TanStack Query hooks for users, posts, post creation, and toasts
  lib/          Query client and query-key conventions
  schemas/      Zod post-creation schema
  test/         MSW server, handlers, fixtures, and test render helper
  types/        User and Post types
  App.tsx       Page shell and selected-user state
  index.css     Tailwind import and design tokens
```

Data flow:

1. `useUsers` loads the user directory through the typed API client.
2. Search filtering is local and memoized in `UserDirectory`.
3. Selecting a user stores the ID in `App` and triggers `usePosts`.
4. Post results are cached by `['posts', userId]`.
5. `CreatePostForm` validates with Zod, then `useCreatePost` prepends the new post to the cached
   posts for the selected user.
6. Switching users reuses cached posts when available.

### Important technical decisions

- **Server state vs UI state.** TanStack Query owns users, posts, caching, retries, and query
  loading/error state. Selection and search are local UI state, so they stay in React rather than
  being forced into the query cache. They are session-only because the URL is not used as state yet.
- **Local post creation.** JSONPlaceholder accepts writes but does not persist them. New posts are
  prepended to the selected user's query cache with temporary negative IDs, so they appear
  immediately and survive server refetches during the session. They are deliberately lost on reload
  because no backend owns the write.
- **Validation.** Zod defines the post schema, React Hook Form applies it through the resolver, and
  `CreatePostInput` is inferred from the schema. This keeps runtime validation and TypeScript types
  aligned. Client-side validation is treated as UX, not as a security boundary.
- **Testing at request boundaries.** MSW intercepts `fetch` and returns realistic responses, so tests
  exercise the API client, query hooks, and UI without mocking React internals or hook
  implementation details. Unexpected external requests fail the suite.
- **Normalized errors.** The API client maps network failures, non-success HTTP statuses, and
  invalid JSON to safe `ApiError` messages. The UI does not render raw browser errors. TanStack
  Query retries once by default, and error states expose a user-triggered retry.
- **Accessibility by default.** Semantic sections and lists, labelled controls, keyboard focus,
  `aria-pressed`, `role="alert"`/`role="status"`, and reduced-motion classes keep the main workflow
  usable without relying only on pointer or visual feedback.
- **Security for a client-only app.** React escapes text, no raw HTML is injected, and the Nginx
  container sets CSP and related headers. These controls reduce risk, but authorization,
  server-side validation, rate limiting, and persistence require a backend.
- **Build and CSP hardening.** Explicit React, Motion, and vendor chunks improve caching; Zod JIT is
  disabled to avoid `eval`; and ESLint blocks unsafe HTML sinks and dynamic code. The CSP still
  allows `style-src 'unsafe-inline'` because Sonner passes inline CSS variables and Motion applies
  inline animation styles. Removing it requires nonces or hashes plus UI verification.

## Testing and verification

The suite contains 57 tests across 12 files. It covers:

- API success, HTTP error, and invalid-response handling.
- User search, selection, loading, empty, and error states.
- Post retrieval, cache reuse, retry, and empty states.
- Form validation, successful creation, form reset, and cache updates.
- Switching users before and after creating a post.
- MSW rejecting unexpected external requests.

Manual verification was performed against the production preview in headless Firefox, including
network-failure simulation and retries, responsive widths from 500 px to 1440 px, keyboard focus,
toast positioning, and browser-console checks.

Security review and OWASP Top 10 notes are in [`DOCS/SECURITY.md`](DOCS/SECURITY.md). The phase
checklist is in [`DOCS/TASKS.md`](DOCS/TASKS.md).

## Security scan

An OWASP ZAP baseline scan was run on 2026-11-17 against the production container and the
JSONPlaceholder API. It reported six alerts: no high-risk findings, one medium, two low, and three
informational.

Application target:

- **Medium — CSP `style-src 'unsafe-inline'`.** The production policy permits inline styles. Sonner
  passes inline CSS variables and Motion applies inline animation styles, so the directive was not
  removed blindly. Stricter CSP with nonces or hashes is future hardening work.
- **Informational — suspicious comments.** ZAP matched a pattern in the minified JavaScript bundle.
  Inspection found string literals for the API URL and user-facing error messages, not source
  comments, credentials, or a meaningful information disclosure.
- **Informational — modern web application.** This is a detection about the client-rendered
  application, not a vulnerability requiring remediation.

JSONPlaceholder target:

- **Low — `X-Powered-By: Express`.** The external API discloses its framework. This header is not
  set by this project's Nginx configuration.
- **Low — HSTS not set.** The external API response lacks HSTS. HSTS for this app belongs at its
  HTTPS terminator, not in the HTTP-only container.
- **Informational — cache-control directives.** The external API allows caching of its responses.
  This is outside the application's control and should be reviewed if that API changes.

This was a passive baseline scan, not a penetration test. It does not cover every application flow,
HTTP method, or OWASP Top 10 category, and the absence of high-risk findings does not mean the app
has no security risk. See [`DOCS/SECURITY.md`](DOCS/SECURITY.md) for the full assessment.

## Known limitations

- Created posts are session-only and disappear on page reload.
- There is no backend, authentication, authorization, server-side validation, or rate limiting.
- The app depends on the availability and integrity of the public JSONPlaceholder API.
- Requests do not have a timeout or cancellation path.
- No live demo is deployed; run the app locally or with the container.
- Security headers are enforced by the Nginx container, not by the Vite dev or preview server.
- CSP still permits `style-src 'unsafe-inline'` for the current toast and animation styles.
- External JSONPlaceholder headers such as `X-Powered-By`, missing HSTS, and cache-control are
  outside this application's control.
- The OWASP ZAP baseline scan is a limited automated check, not a full penetration test.
- No CI pipeline currently runs the checks automatically.

## What would be improved with more time

- Add a small backend or mock persistence layer with server-side validation and proper write
  semantics.
- Persist selected users and search terms in the URL for shareable state.
- Add pagination or infinite scrolling for larger user and post collections.
- Add Playwright end-to-end tests, visual regression checks, and an accessibility audit in CI.
- Add a GitHub Actions workflow for audit, lint, typecheck, tests, build, and container scanning.
- Add structured error reporting and client-side observability.
- Harden CSP with nonces or hashes and remove the inline-style allowance after verifying Sonner and
  Motion.
- Add deployment automation and a hosted demo.
- Add request timeouts, retry policies tuned per endpoint, and offline support.
- Run ZAP or another passive scanner in CI and archive reports for comparison.

## AI usage

OpenCode was used as a development assistant, not as an autonomous author. The developer defined the
requirements, reviewed every change, ran the verification steps, and decided what to accept. OpenCode
helped with:

- Breaking the assessment into phases and branch-sized commits.
- Establishing the React + TypeScript/Vite foundation and quality scripts.
- Implementing API integration, user search, post retrieval, and local post creation.
- Designing and expanding Vitest, Testing Library, and MSW tests.
- Investigating test failures, build warnings, and dependency audit findings.
- Reviewing accessibility, security headers, and delivery documentation.

Representative prompt themes, paraphrased rather than exact quotations, included:

- Break the assessment into phases with incremental commits.
- Implement and test the user directory, posts, and validated post-creation flows.
- Review the application for accessibility, security, and delivery readiness.
- Update the documentation to match the actual implementation and security scan results.

Accepted suggestions were checked against the requirements and observed behavior rather than accepted
automatically. Concrete examples include:

- TanStack Query for server state, caching, retry, and loading/error states.
- React Hook Form with Zod for validated forms and inferred input types.
- MSW for testing at the `fetch` boundary instead of mocking hooks.
- Keeping locally created posts in the query cache with temporary negative IDs rather than pretending
  JSONPlaceholder persists them.
- Explicit React, Motion, and vendor chunk groups, plus Nginx security headers.

Corrections made during review included:

- Adding the missing Prettier configuration after repository-wide formatting checks failed.
- Reorganizing production chunks to remove the large-chunk build warning.
- Updating `typescript-eslint` after the audit found a development-only `minimatch` vulnerability.
- Disabling Zod JIT after a container smoke test exposed a CSP-blocked `eval` probe, instead of
  weakening `script-src` with `'unsafe-eval'`.
- Adding keyboard-selection coverage and fixing responsive, focus, and toast behavior found during
  browser verification.
- Correcting security documentation after the actual ZAP report replaced the earlier failed scan
  attempt, and separating JSONPlaceholder findings from application findings.
- Correcting the implementation-time claim to distinguish active work from elapsed commit time.

The developer remained responsible for reviewing, testing, correcting, and accepting the final
implementation and documentation.

## Actual implementation time

Approximately 3–4 hours of active work. The elapsed time between the first and final commits was
approximately 5.5 hours and includes breaks and time away from the project; it does not represent
continuous implementation time. Part of the active work went into diagnosing a Docker-related
networking and redirect issue between the main machine and a Kali virtual machine.
