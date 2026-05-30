import { jwtDecode } from 'jwt-decode'

import { tokenService } from '@/shared/api/token.service'

export interface AccessTokenPayload {
  sub?: string
  userId?: string
  id?: string
  roles?: string[]
  exp?: number
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

export const getAccessTokenExpiresAt = (): number | null => {
  const payload = getAccessTokenPayload()
  return typeof payload?.exp === 'number' ? payload.exp : null
}

export const isAccessTokenExpired = (bufferSeconds = 0): boolean => {
  const token = tokenService.getAccessToken()
  if (!token) {
    return true
  }

  const expiresAt = getAccessTokenExpiresAt()
  if (expiresAt === null) {
    return false
  }

  return Date.now() >= (expiresAt - bufferSeconds) * 1000
}

export const isAccessTokenExpiringSoon = (thresholdSeconds = 60): boolean => {
  return isAccessTokenExpired(thresholdSeconds)
}

export const getCurrentUserId = (): string | null => {
  const payload = getAccessTokenPayload()
  return payload?.sub ?? payload?.userId ?? payload?.id ?? null
}

export const getCurrentUserIdAsNumber = (): number | null => {
  const payload = getAccessTokenPayload()
  if (!payload) {
    return null
  }

  const candidates = [payload.userId, payload.id, payload.sub]

  for (const candidate of candidates) {
    if (candidate === undefined || candidate === null || candidate === '') {
      continue
    }

    return parseInt(candidate)
  }

  return null
}
