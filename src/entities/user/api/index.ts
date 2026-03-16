import { api } from '@/shared/api'
import type { User } from '../model/types'

// Теперь api возвращает готовый тип
export const fetchUsersList = () => api<User[]>('/users')

export const createUser = (userData: User) =>
  api<User>('/users', {
    method: 'POST',
    body: JSON.stringify(userData)
  })

export const updateUserById = (id: string, updates: Partial<User>) =>
  api<User>(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates)
  })
