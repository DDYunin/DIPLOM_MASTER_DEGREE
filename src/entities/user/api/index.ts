import { api } from '@/shared/api'
import type { User } from '../model/types'
import type { AdminUsersListQueryParams, AdminUsersPageDto } from './types'

export const fetchUsersList = (queryParams: AdminUsersListQueryParams = {}) =>
  api<AdminUsersPageDto>('/admin/users', { queryParams })

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

// НОВЫЙ МЕТОД: Получение профиля текущего пользователя
export const fetchCurrentUser = () => api<User>('/users/me')
