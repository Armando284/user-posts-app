# Task Tracker — User Posts App

- **Branch:** `develop`
- **Last review:** 2026-11-16
- **Last commit:** `045856f` (Merge PR #1 — scaffold)

**Legend:** `[x]` done · `[ ]` pending · _(partial)_ base exists, not implemented

## Progress

| Phase | Priority | Done |
| ----- | -------- | ---- |
| 1 — Foundation | Highest | 6/6 |
| 2 — Core functionality | Highest | 0/7 (1 partial) |
| 3 — Post creation | Highest | 0/5 |
| 4 — UX and polish | Medium | 0/5 |
| 5 — Quality assurance | Medium | 0/5 |
| 6 — Security and delivery | Optional | 0/4 |

## Phase 1 — Foundation (Highest) — complete

- [x] Vite + React + TypeScript — `b5bc61e`
- [x] Tailwind CSS v4 — `e76db72`
- [x] ESLint + Prettier — `061a897`
- [x] Vitest + Testing Library — `8bc313c`, `b7ce4d5`
- [x] Scripts and initial structure — `46cf400`, `b550c7f`
- [x] First commit / scaffold PR — `045856f`

## Phase 2 — Core functionality (Highest)

- [ ] **API service** — typed client for users and posts, configurable base URL, error handling.
- [ ] **TanStack Query setup** — `QueryClientProvider` and query defaults. _(Partial: dependency installed in `903e380`.)_
- [ ] **Users list and search** — fetch users, filter by name/email with debounce.
- [ ] **User selection** — selected state, visual highlight, optional URL sync.
- [ ] **User posts** — query by `userId`, refetch on user change.
- [ ] **Loading, error and empty states** — reusable UI for each case.
- [ ] **TDD per feature** — tests for services, hooks and components. _(MSW installed in `903e380`; handlers not configured yet.)_

## Phase 3 — Post creation (Highest)

- [ ] **React Hook Form** — install and configure.
- [ ] **Zod schema** — validation rules for title and body.
- [ ] **Validation** — field errors, accessible messages, block invalid submit.
- [ ] **Local cache update** — invalidate or optimistically update the posts query.
- [ ] **Tests** — validation, submit, loading/error and cache update.

## Phase 4 — UX and polish (Medium)

- [ ] **Lucide** — icons.
- [ ] **Sonner** — success/error notifications.
- [ ] **Motion** — transitions, respecting `prefers-reduced-motion`.
- [ ] **Responsive and accessibility** — keyboard, focus, labels, landmarks, contrast.
- [ ] **Visual states** — hover, focus, disabled, loading, spacing and hierarchy.

## Phase 5 — Quality assurance (Medium)

- [ ] **Full test suite** — unit and integration tests for critical flows.
- [ ] **Typecheck** — `pnpm typecheck`.
- [ ] **Lint** — `pnpm lint`.
- [ ] **Build** — `pnpm build`.
- [ ] **Error review** — console, runtime and edge cases.

> Scripts exist and pass on the scaffold, but these tasks stay pending until real functionality and tests are in place.

## Phase 6 — Security and delivery (Optional)

- [ ] **Dependency audit** — `pnpm audit`.
- [ ] **Security review** — XSS, sanitization, secrets, CSP if applicable.
- [ ] **README** — setup, scripts, architecture and decisions.
- [ ] **Docker** — only if time permits.

## Current checks

`typecheck`, `lint`, `test:run` (1 scaffold test) and `build` all pass on `develop`.
