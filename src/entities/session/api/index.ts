import { api } from '@/shared/api' // Наш будущий клиент
import type { LoginCredentials, AuthResponse } from '../model/types'

export const loginWithEmail = (credentials: LoginCredentials) =>
  api<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  })
