import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { setSessionExpiredHandler } from './auth-session'
import { refreshAccessToken } from './auth-interceptor'
import { tokenService } from './token.service'

describe('refreshAccessToken', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => ({ accessToken: 'new-access-token' })
      }))
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    setSessionExpiredHandler(null)
  })

  it('stores new access token from refresh endpoint', async () => {
    const token = await refreshAccessToken()

    expect(token).toBe('new-access-token')
    expect(tokenService.getAccessToken()).toBe('new-access-token')
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/refresh'),
      expect.objectContaining({
        method: 'GET',
        credentials: 'include'
      })
    )
  })

  it('deduplicates concurrent refresh requests', async () => {
    const [first, second] = await Promise.all([refreshAccessToken(), refreshAccessToken()])

    expect(first).toBe('new-access-token')
    expect(second).toBe('new-access-token')
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('notifies session expired handler when refresh fails', async () => {
    const handler = vi.fn()
    setSessionExpiredHandler(handler)

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: false,
        status: 401,
        json: async () => ({ errorCode: 'UNAUTHORIZED' })
      }))
    )

    tokenService.setTokens('expired-token')

    await expect(refreshAccessToken()).rejects.toThrow()
    expect(tokenService.getAccessToken()).toBeNull()
    expect(handler).toHaveBeenCalledTimes(1)
  })
})
