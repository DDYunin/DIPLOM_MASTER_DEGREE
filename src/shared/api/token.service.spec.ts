import { beforeEach, describe, expect, it } from 'vitest'

import { tokenService } from './token.service'

describe('tokenService', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns null when tokens are not set', () => {
    expect(tokenService.getAccessToken()).toBeNull()
    expect(tokenService.getRefreshToken()).toBeNull()
  })

  it('stores access token', () => {
    tokenService.setTokens('access-token')

    expect(tokenService.getAccessToken()).toBe('access-token')
    expect(localStorage.getItem('app_access_token')).toBe('access-token')
  })

  it('stores access and refresh tokens', () => {
    tokenService.setTokens('access-token', 'refresh-token')

    expect(tokenService.getAccessToken()).toBe('access-token')
    expect(tokenService.getRefreshToken()).toBe('refresh-token')
  })

  it('clears all tokens', () => {
    tokenService.setTokens('access-token', 'refresh-token')

    tokenService.clearTokens()

    expect(tokenService.getAccessToken()).toBeNull()
    expect(tokenService.getRefreshToken()).toBeNull()
    expect(localStorage.getItem('app_access_token')).toBeNull()
    expect(localStorage.getItem('app_refresh_token')).toBeNull()
  })
})
