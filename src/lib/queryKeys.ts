export const queryKeys = {
  users: ['users'] as const,
  posts: (userId: number | null) => ['posts', userId] as const,
}
