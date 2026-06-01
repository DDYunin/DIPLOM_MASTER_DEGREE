import { usersApiPath } from '@/shared/config/api-routes'
import { isAccessTokenExpiringSoon } from '@/shared/lib/jwt'

import { notifySessionExpired } from './auth-session'
import { baseFetch } from './base'
import { tokenService } from './token.service'

interface FailedRequest {
  resolve: (token: string) => void
  reject: (error: unknown) => void
}

interface RefreshResponse {
  accessToken: string
  refreshToken?: string
}

const REFRESH_ENDPOINT = usersApiPath('/auth/refresh')
const REFRESH_THRESHOLD_SECONDS = 60

let isRefreshing = false
let refreshPromise: Promise<string> | null = null
let failedQueue: FailedRequest[] = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((request) => {
    if (error || !token) {
      request.reject(error ?? new Error('Unable to refresh access token'))
      return
    }

    request.resolve(token)
  })

  failedQueue = []
}

const requestRefreshToken = async (): Promise<string> => {
  const response = await baseFetch<RefreshResponse>(REFRESH_ENDPOINT, {
    method: 'GET'
  })

  if (!response.accessToken) {
    throw new Error('Refresh response does not contain access token')
  }

  tokenService.setTokens(response.accessToken, response.refreshToken)
  return response.accessToken
}

export const refreshAccessToken = async (): Promise<string> => {
  if (refreshPromise) {
    return refreshPromise
  }

  isRefreshing = true
  refreshPromise = (async () => {
    try {
      const accessToken = await requestRefreshToken()
      processQueue(null, accessToken)
      return accessToken
    } catch (error) {
      processQueue(error, null)
      tokenService.clearTokens()
      notifySessionExpired()
      throw error
    } finally {
      isRefreshing = false
      refreshPromise = null
    }
  })()

  return refreshPromise
}

export const ensureValidAccessToken = async (): Promise<void> => {
  const accessToken = tokenService.getAccessToken()
  if (!accessToken) {
    return
  }

  if (!isAccessTokenExpiringSoon(REFRESH_THRESHOLD_SECONDS)) {
    return
  }

  if (isRefreshing && refreshPromise) {
    await refreshPromise
    return
  }

  await refreshAccessToken()
}

export const refreshTokenAndRetry = async <T>(
  endpoint: string,
  options: RequestInit
): Promise<T> => {
  const accessToken = await refreshAccessToken()

  const headers = new Headers(options.headers)
  headers.set('Authorization', `Bearer ${accessToken}`)

  return baseFetch<T>(endpoint, { ...options, headers })
}

export const waitForAccessTokenRefresh = (): Promise<string> => {
  if (refreshPromise) {
    return refreshPromise
  }

  return new Promise<string>((resolve, reject) => {
    failedQueue.push({ resolve, reject })
  })
}
