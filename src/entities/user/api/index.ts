import { api } from '@/shared/api'
import type { User } from '../model/types'

// Теперь api возвращает готовый тип
// TODO: Тут можно сокращённый вариант типа использовать, а полностью user только когда общую инфу
export const fetchUsersList = () => api<User[]>('/admin/users')

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
