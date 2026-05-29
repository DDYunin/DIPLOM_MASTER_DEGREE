import { api } from '@/shared/api'
import { usersApiPath } from '@/shared/config/api-routes'

import type { LoginCredentials, AuthResponse } from '../model/types'

export const loginWithEmail = (credentials: LoginCredentials) =>
  api<AuthResponse>(usersApiPath('/auth/login'), {
    method: 'POST',
    body: JSON.stringify(credentials)
  })
