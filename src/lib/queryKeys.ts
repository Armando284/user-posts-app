export const queryKeys = {
  users: ['users'] as const,
  posts: (userId: number) => ['posts', userId] as const,
}
