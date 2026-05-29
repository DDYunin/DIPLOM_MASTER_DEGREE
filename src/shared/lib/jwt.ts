import { jwtDecode } from 'jwt-decode'

import { tokenService } from '@/shared/api'

export interface AccessTokenPayload {
  sub?: string
  userId?: string
  id?: string
  roles?: string[]
}

export const getAccessTokenPayload = (): AccessTokenPayload | null => {
  const token = tokenService.getAccessToken()
  if (!token) {
    return null
  }

  try {
    return jwtDecode<AccessTokenPayload>(token)
  } catch {
    return null
  }
}

export const getCurrentUserId = (): string | null => {
  const payload = getAccessTokenPayload()
  return payload?.sub ?? payload?.userId ?? payload?.id ?? null
}
