import { apiRequest } from './client'
import type { User } from '../types/user'

export function getUsers(): Promise<User[]> {
  return apiRequest<User[]>('/users')
}
