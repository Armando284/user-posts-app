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

- **Do not rely on JSONPlaceholder persistence.** The API does not persist writes. Created posts
  are stored in the TanStack Query cache so the UI remains truthful about session-only data.
- **Separate server state from UI state.** TanStack Query owns users and posts; `useState` owns the
  selected user and search text; React Hook Form owns form state.
- **Normalize API errors.** Network failures, invalid JSON, and HTTP statuses are mapped to safe,
  user-readable messages in one API client.
- **Use one validation schema.** Zod is the source of truth for form types and validation rules.
- **Prefer accessible native controls.** Semantic sections, lists, labels, focus outlines, live
  regions, and `aria-pressed` selection state are used instead of custom widgets.
- **Test behavior with real request boundaries.** MSW handlers exercise the same client code used in
  the browser, and unhandled requests fail the suite.
- **Split production chunks.** React, Motion, and remaining vendor code are emitted as separate
  chunks to improve caching and avoid the large-chunk build warning.
- **Disable Zod JIT compilation for strict CSP.** `z.config({ jitless: true })` avoids runtime
  `eval`, so the production policy does not need `'unsafe-eval'`.
- **Guard unsafe rendering.** ESLint blocks dangerous HTML sinks, `eval`, and `new Function`.

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

## Known limitations

- Created posts are session-only and disappear on page reload.
- There is no backend, authentication, authorization, server-side validation, or rate limiting.
- The app depends on the availability and integrity of the public JSONPlaceholder API.
- Requests do not have a timeout or cancellation path.
- No live demo is deployed; run the app locally or with the container.
- Security headers are configured in Nginx, not in the Vite preview server.
- No CI pipeline currently runs the checks automatically.
- The optional OWASP ZAP baseline scan was attempted but blocked by container registry access.

## What would be improved with more time

- Add a small backend or mock persistence layer with server-side validation and proper write
  semantics.
- Persist selected users and search terms in the URL for shareable state.
- Add pagination or infinite scrolling for larger user and post collections.
- Add Playwright end-to-end tests, visual regression checks, and an accessibility audit in CI.
- Add a GitHub Actions workflow for audit, lint, typecheck, tests, build, and container scanning.
- Add structured error reporting and client-side observability.
- Harden CSP with nonces and remove the inline-style allowance.
- Add deployment automation and a hosted demo.
- Add request timeouts, retry policies tuned per endpoint, and offline support.

## AI usage

An AI coding assistant (opencode) was used as a development pair throughout the project. It helped
scaffold and implement features, write tests, review the UI, debug failures, and draft
documentation. All generated changes were reviewed and verified with linting, type checking, tests,
production builds, and browser checks before being committed.

Representative prompts included:

- Implement the foundation, API client, user directory, post retrieval, and post creation phases.
- Add tests for search, selection, cache behavior, validation, retries, and network failures.
- Run static analysis and manual verification, then fix warnings and accessibility issues.
- Review security, document findings, and implement the remaining delivery tasks with atomic
  commits.

Accepted suggestions included TanStack Query for server state, Zod plus React Hook Form for
validation, MSW for request-level tests, client-side post caching, code splitting, accessible
feedback states, and Nginx security headers.

Corrections made during review included:

- Formatting configuration files that failed the repository-wide Prettier check.
- Replacing the large build chunk with explicit React, Motion, and vendor groups.
- Updating `typescript-eslint` to remove the only audit finding.
- Adding ESLint guards after finding no unsafe HTML sinks.
- Fixing the mobile toast verification to wait for its entrance animation.
- Keeping the optional ZAP scan unchecked because the scan could not complete.

## Actual implementation time

Approximately 5.5 hours, measured from the first scaffold commit to final delivery. This includes
planning, implementation, testing, security review, documentation, and container verification.
