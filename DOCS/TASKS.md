# **User Posts — Engineering Task Plan**

> The application has one primary workflow:
>
>   1. Discover and search users.
>   2. Select a user.
>   3. Read that user's posts.
>   4. Create a post.
>   5. See the new post immediately.


## **Project roadmap**

- [x] Phase 1 — Foundation `Completed`
- [ ] Phase 2 — Core functionality `Current`
- [ ] Phase 3 — Post creation `Pending`
- [ ] Phase 4 — UX and polish `Pending`
- [ ] Phase 5 — Quality assurance `Pending`
- [ ] Phase 6 — Security and delivery `Pending`

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

Current phase

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

- [ ] Users load from JSONPlaceholder.
- [ ] Search filters users correctly.
- [ ] Selecting a user displays their posts.
- [ ] Loading, error and empty states are visible.
- [ ] Repeated selections benefit from query caching.
- [ ] All related tests pass.

## **Phase 3 — Post creation**

`feat/post-creation`

**Target: 30 minutes**

**Goal:** Allow users to create posts with reliable validation and immediate local updates.

### **3.1 — Form infrastructure**

- [ ] Install React Hook Form.
- [ ] Install Zod and `@hookform/resolvers`.
- [ ] Define the post creation schema.
- [ ] Define the form input types using Zod inference.
- [ ] Write tests for required title validation.
- [ ] Write tests for required body validation.
- [ ] Implement the validated post form.

Schema:

```
const createPostSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  body: z.string().trim().min(1, 'Post content is required'),
})
```

### **3.2 — Local post creation**

- [ ] Implement post creation submission.
- [ ] Associate the new post with the selected user.
- [ ] Generate a temporary unique ID for the locally created post.
- [ ] Update the corresponding TanStack Query cache.
- [ ] Ensure the new post remains visible when switching users.
- [ ] Reset the form after successful submission.
- [ ] Add tests for successful creation and cache updates.

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

- [ ] Empty titles cannot be submitted.
- [ ] Empty bodies cannot be submitted.
- [ ] Valid posts appear immediately.
- [ ] Created posts remain visible during the session.
- [ ] Existing server-provided posts remain intact.

## **Phase 4 — UX and polish**

`feat/ux-polish`

**Target: 25 minutes**

**Goal:** Deliver a coherent, accessible and responsive user experience.

### **4.1 — Visual foundation**

- [ ] Establish typography, spacing and color conventions.
- [ ] Define reusable layout primitives where useful.
- [ ] Create a responsive application layout.
- [ ] Establish visual hierarchy between users and posts.
- [ ] Implement selected-user visual state.

### **4.2 — Interaction and feedback**

- [ ] Install Lucide React.
- [ ] Add meaningful icons to actions and navigation.
- [ ] Install Sonner for notifications.
- [ ] Implement success feedback after post creation.
- [ ] Implement appropriate error notifications.
- [ ] Install Motion for subtle transitions.
- [ ] Add loading indicators and visual feedback.
- [ ] Avoid excessive animation and unnecessary layout shifts.

### **4.3 — Accessibility**

- [ ] Use semantic HTML.
- [ ] Ensure form fields have accessible labels.
- [ ] Ensure keyboard navigation works.
- [ ] Provide visible focus indicators.
- [ ] Ensure errors are accessible to screen readers.
- [ ] Check color contrast.

**Commit groups:**

```
feat: establish responsive application interface
feat: add interaction feedback and subtle animations
fix: improve accessibility and responsive behavior
```

## **Phase 5 — Quality assurance**

`chore/quality-assurance`

**Target: 20 minutes**

**Goal:** Validate the entire application rather than individual features in isolation.

### **5.1 — Automated testing**

- [ ] Verify all tests pass.
- [ ] Add any missing integration tests.
- [ ] Test switching between users.
- [ ] Test search and selection together.
- [ ] Test post creation after changing selected users.
- [ ] Test error recovery and retry behavior.
- [ ] Verify MSW does not allow unintended external requests.

### **5.2 — Static analysis**

- [ ] Run ESLint.
- [ ] Run Prettier checks.
- [ ] Run TypeScript type checking.
- [ ] Run production build.
- [ ] Review warnings and eliminate unnecessary suppressions.

### **5.3 — Manual verification**

- [ ] Test the complete user journey.
- [ ] Test empty and invalid form submissions.
- [ ] Test network failures.
- [ ] Check responsive behavior.
- [ ] Check browser console for errors.
- [ ] Review dependencies for unnecessary additions.

**Commit:**

```
chore: complete application quality checks
```

## **Phase 6 — Security and delivery**

`chore/security-delivery`

**Target: 10 minutes, with Docker optional**

**Goal:** Deliver a reproducible, documented and publicly accessible project.

### **6.1 — Security**

- [ ] Run `pnpm audit`.
- [ ] Review dependency vulnerabilities.
- [ ] Check for unsafe HTML rendering.
- [ ] Review external API interaction and error handling.
- [ ] Review applicable OWASP Top 10 risks.
- [ ] Optionally run OWASP ZAP baseline scan against the production build served locally.
- [ ] Document findings and limitations.

### **6.2 — Documentation**

- [ ] Replace the default Vite README.
- [ ] Document project requirements.
- [ ] Document installation and execution.
- [ ] Document test and build commands.
- [ ] Explain architecture and important technical decisions.
- [ ] Document known limitations.
- [ ] Explain what would be improved with more time.
- [ ] Document AI usage, including prompts, accepted suggestions and corrections.

### **6.3 — Optional infrastructure**

- [ ] Add a multi-stage Dockerfile.
- [ ] Configure Nginx for SPA routing.
- [ ] Verify container build and execution.

Docker is optional and must not delay delivery.

### **6.4 — GitHub delivery**

- [ ] Review commit history.
- [ ] Remove temporary files and debugging code.
- [ ] Verify the repository is public.
- [ ] Ensure no secrets or personal credentials are committed.
- [ ] Push all phase branches and final changes.
- [ ] Record actual implementation time.
