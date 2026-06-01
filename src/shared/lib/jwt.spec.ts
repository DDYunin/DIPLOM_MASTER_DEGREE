import { beforeEach, describe, expect, it } from 'vitest'

import { tokenService } from '@/shared/api/token.service'
import {
  getAccessTokenExpiresAt,
  isAccessTokenExpired,
  isAccessTokenExpiringSoon
} from '@/shared/lib/jwt'

const createTokenWithExp = (exp: number) => {
  const payload = btoa(JSON.stringify({ exp, roles: ['ROLE_ADMIN'] }))
  return `header.${payload}.signature`
}

describe('jwt expiry helpers', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('detects expired token', () => {
    tokenService.setTokens(createTokenWithExp(Math.floor(Date.now() / 1000) - 60))

    expect(isAccessTokenExpired()).toBe(true)
    expect(isAccessTokenExpiringSoon(60)).toBe(true)
  })

  it('detects token that will expire soon', () => {
    tokenService.setTokens(createTokenWithExp(Math.floor(Date.now() / 1000) + 30))

    expect(isAccessTokenExpired()).toBe(false)
    expect(isAccessTokenExpiringSoon(60)).toBe(true)
  })

  it('treats valid token as not expiring soon', () => {
    tokenService.setTokens(createTokenWithExp(Math.floor(Date.now() / 1000) + 3600))

    expect(isAccessTokenExpired()).toBe(false)
    expect(isAccessTokenExpiringSoon(60)).toBe(false)
    expect(getAccessTokenExpiresAt()).not.toBeNull()
  })
})
