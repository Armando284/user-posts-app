# **User Posts — Engineering Task Plan**

> The application has one primary workflow:
>
> 1. Discover and search users.
> 2. Select a user.
> 3. Read that user's posts.
> 4. Create a post.
> 5. See the new post immediately.

## **Project roadmap**

- [x] Phase 1 — Foundation `Completed`
- [x] Phase 2 — Core functionality `Completed`
- [x] Phase 3 — Post creation `Completed`
- [x] Phase 4 — UX and polish `Completed`
- [x] Phase 5 — Quality assurance `Completed`
- [x] Phase 6 — Security and delivery `Completed`

## **Phase 1 — Foundation**

Completed

`feat/scaffold`

**Goal:** Establish a reproducible development environment with quality tooling and testing infrastructure.

- [x] Initialize React + TypeScript using Vite.
- [x] Configure Tailwind CSS.
- [x] Configure ESLint.
- [x] Configure Prettier.
- [x] Configure Vitest and jsdom.
- [x] Configure React Testing Library.
- [x] Add test scripts and quality-check scripts.
- [x] Configure TypeScript strict mode.
- [x] Add initial application smoke test.
- [x] Verify lint, typecheck, tests and production build.
- [x] Create initial scaffold commit.

**Branch:** `feat/scaffold`

## **Phase 2 — Core functionality**

Completed

`feat/core-functionality`

**Target: 75 minutes**

**Goal:** Implement user discovery, selection and post retrieval, with reliable API integration and server-state management.

### **2.1 — API infrastructure**

- [x] Define `User` and `Post` TypeScript types based on JSONPlaceholder responses.
- [x] Create reusable API client with typed responses.
- [x] Implement HTTP error handling and normalized error messages.
- [x] Configure MSW handlers and test fixtures.
- [x] Configure MSW lifecycle and fail on unhandled requests.
- [x] Add API client tests for successful responses and HTTP errors.

**Commit:**

```
feat: implement typed API client and MSW testing infrastructure
```

### **2.2 — Server-state management**

- [x] Install and configure TanStack Query.
- [x] Create a centralized `QueryClient`.
- [x] Configure sensible query defaults.
- [x] Add application-level `QueryClientProvider`.
- [x] Establish consistent query key conventions.

Suggested query keys:

```
const queryKeys = {
  users: ['users'] as const,
  posts: (userId: number) => ['posts', userId] as const,
}
```

**Commit:**

```
feat: configure TanStack Query for server-state management
```

### **2.3 — User discovery**

- [x] Write tests for user list rendering.
- [x] Write tests for loading and error states.
- [x] Implement `useUsers` query hook.
- [x] Implement user list component.
- [x] Implement user search input.
- [x] Add case-insensitive filtering by user name.
- [x] Add empty search results state.
- [x] Verify search does not trigger unnecessary API requests.

**Commit:**

```
feat: implement searchable user directory
```

### **2.4 — User selection and post retrieval**

- [x] Write tests for user selection.
- [x] Write tests for post loading and error states.
- [x] Implement user selection state.
- [x] Implement `usePosts(userId)` query hook.
- [x] Implement post list component.
- [x] Fetch posts when a user is selected.
- [x] Handle empty post collections.
- [x] Verify cached posts are reused when switching between previously selected users.

**Commit:**

```
feat: display posts for selected users
```

**Phase 2 acceptance criteria:**

- [x] Users load from JSONPlaceholder.
- [x] Search filters users correctly.
- [x] Selecting a user displays their posts.
- [x] Loading, error and empty states are visible.
- [x] Repeated selections benefit from query caching.
- [x] All related tests pass.

## **Phase 3 — Post creation**

Completed

`feat/post-creation`

**Target: 30 minutes**

**Goal:** Allow users to create posts with reliable validation and immediate local updates.

### **3.1 — Form infrastructure**

- [x] Install React Hook Form.
- [x] Install Zod and `@hookform/resolvers`.
- [x] Define the post creation schema.
- [x] Define the form input types using Zod inference.
- [x] Write tests for required title validation.
- [x] Write tests for required body validation.
- [x] Implement the validated post form.

Schema:

```
const createPostSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  body: z.string().trim().min(1, 'Post content is required'),
})
```

### **3.2 — Local post creation**

- [x] Implement post creation submission.
- [x] Associate the new post with the selected user.
- [x] Generate a temporary unique ID for the locally created post.
- [x] Update the corresponding TanStack Query cache.
- [x] Ensure the new post remains visible when switching users.
- [x] Reset the form after successful submission.
- [x] Add tests for successful creation and cache updates.

Important architectural decision:

**Do not depend on JSONPlaceholder persistence.**

We should not pretend that a successful POST request means the resource has been permanently saved. Since persistence is explicitly outside the requirements, we can maintain newly created posts in the client-side query cache.

**Commit groups:**

```
feat: implement validated post creation form
feat: persist created posts in client-side query cache
test: cover post creation and validation behavior
```

**Phase 3 acceptance criteria:**

- [x] Empty titles cannot be submitted.
- [x] Empty bodies cannot be submitted.
- [x] Valid posts appear immediately.
- [x] Created posts remain visible during the session.
- [x] Existing server-provided posts remain intact.

## **Phase 4 — UX and polish**

Completed

`feat/ux-polish`

**Target: 25 minutes**

**Goal:** Deliver a coherent, accessible and responsive user experience.

### **4.1 — Visual foundation**

- [x] Establish typography, spacing and color conventions.
- [x] Define reusable layout primitives where useful.
- [x] Create a responsive application layout.
- [x] Establish visual hierarchy between users and posts.
- [x] Implement selected-user visual state.

### **4.2 — Interaction and feedback**

- [x] Install Lucide React.
- [x] Add meaningful icons to actions and navigation.
- [x] Install Sonner for notifications.
- [x] Implement success feedback after post creation.
- [x] Implement appropriate error notifications.
- [x] Install Motion for subtle transitions.
- [x] Add loading indicators and visual feedback.
- [x] Avoid excessive animation and unnecessary layout shifts.

### **4.3 — Accessibility**

- [x] Use semantic HTML.
- [x] Ensure form fields have accessible labels.
- [x] Ensure keyboard navigation works.
- [x] Provide visible focus indicators.
- [x] Ensure errors are accessible to screen readers.
- [x] Check color contrast.

**Commit groups:**

```
feat: establish responsive application interface
feat: add interaction feedback and subtle animations
fix: improve accessibility and responsive behavior
```

## **Phase 5 — Quality assurance**

Completed

`chore/quality-assurance`

**Target: 20 minutes**

**Goal:** Validate the entire application rather than individual features in isolation.

### **5.1 — Automated testing**

- [x] Verify all tests pass.
- [x] Add any missing integration tests.
- [x] Test switching between users.
- [x] Test search and selection together.
- [x] Test post creation after changing selected users.
- [x] Test error recovery and retry behavior.
- [x] Verify MSW does not allow unintended external requests.

### **5.2 — Static analysis**

- [x] Run ESLint.
- [x] Run Prettier checks.
- [x] Run TypeScript type checking.
- [x] Run production build.
- [x] Review warnings and eliminate unnecessary suppressions.

### **5.3 — Manual verification**

- [x] Test the complete user journey.
- [x] Test empty and invalid form submissions.
- [x] Test network failures.
- [x] Check responsive behavior.
- [x] Check browser console for errors.
- [x] Review dependencies for unnecessary additions.

**Commit:**

```
chore: complete application quality checks
```

## **Phase 6 — Security and delivery**

`chore/security-delivery`

**Target: 10 minutes, with Docker optional**

**Goal:** Deliver a reproducible, documented and publicly accessible project.

### **6.1 — Security**

- [x] Run `pnpm audit`.
- [x] Review dependency vulnerabilities.
- [x] Check for unsafe HTML rendering.
- [x] Review external API interaction and error handling.
- [x] Review applicable OWASP Top 10 risks.
- [x] Optionally run OWASP ZAP baseline scan against the production build served locally.
- [x] Document findings and limitations.

Security review: `DOCS/SECURITY.md`. An OWASP ZAP baseline scan was completed on 2026-11-17
against the production container and JSONPlaceholder: 0 high, 1 medium, 2 low, 3 informational.
The medium finding is CSP `style-src unsafe-inline`; the low findings affect only the external
JSONPlaceholder API. The scan is not a penetration test; see `DOCS/SECURITY.md` for scope and
limitations.

### **6.2 — Documentation**

- [x] Replace the default Vite README.
- [x] Document project requirements.
- [x] Document installation and execution.
- [x] Document test and build commands.
- [x] Explain architecture and important technical decisions.
- [x] Document known limitations.
- [x] Explain what would be improved with more time.
- [x] Document AI usage, including prompts, accepted suggestions and corrections.

### **6.3 — Optional infrastructure**

- [x] Add a multi-stage Dockerfile.
- [x] Configure Nginx for SPA routing.
- [x] Verify container build and execution.

Docker is optional and must not delay delivery. The image was built and run with Podman because the
Docker daemon was unavailable. Nginx syntax, `/healthz`, SPA fallback, security headers, and a
browser smoke test passed. Zod JIT is disabled to keep the CSP free of `'unsafe-eval'`.

### **6.4 — GitHub delivery**

- [x] Review commit history.
- [x] Remove temporary files and debugging code.
- [x] Verify the repository is public.
- [x] Ensure no secrets or personal credentials are committed.
- [x] Push all phase branches and final changes.
- [x] Record actual implementation time.

Commit history reviewed; no secrets, credentials, debug code, or temporary repository files were
found. The repository is public and all phase branches plus the final security/delivery branch were
pushed to `origin`.
