import { useNotifications } from '@/shared/model'

import { ensureValidAccessToken, refreshTokenAndRetry } from './auth-interceptor'
import { baseFetch } from './base'
import { tokenService } from './token.service'

export interface ApiRequestOptions extends RequestInit {
  queryParams?: Record<string, string | number | boolean | undefined | null>
  skipAuthRefresh?: boolean
}

const appendQueryParams = (
  url: string,
  queryParams?: ApiRequestOptions['queryParams']
): string => {
  if (!queryParams) {
    return url
  }

  const query = new URLSearchParams()

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, String(value))
    }
  })

  const queryString = query.toString()
  if (!queryString) {
    return url
  }

  return `${url}${url.includes('?') ? '&' : '?'}${queryString}`
}

const isAuthEndpoint = (url: string): boolean => {
  return url.includes('/auth/login') || url.includes('/auth/refresh')
}

export const apiClient = async <T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> => {
  const fullUrl = appendQueryParams(endpoint, options.queryParams)

  if (!options.skipAuthRefresh && !isAuthEndpoint(fullUrl)) {
    try {
      await ensureValidAccessToken()
    } catch {
      throw new Error('Session expired')
    }
  }

  const token = tokenService.getAccessToken()
  const headers = new Headers(options.headers)

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  try {
    return await baseFetch<T>(fullUrl, { ...options, headers })
  } catch (error: unknown) {
    const apiError = error as Error & { status?: number }

    if (apiError.status === 401 && !isAuthEndpoint(fullUrl)) {
      try {
        return await refreshTokenAndRetry<T>(fullUrl, { ...options, headers })
      } catch (refreshError) {
        throw refreshError
      }
    }

    const notifications = useNotifications()
    const errorMessage = apiError.message || 'Произошла непредвиденная ошибка'

    if (apiError.status !== 401) {
      notifications.showToast('error', 'Ошибка запроса', errorMessage)
    }

    throw error
  }
}

export { apiClient as api }
