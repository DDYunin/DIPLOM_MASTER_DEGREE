import { tokenService } from './token.service'
import { baseFetch } from './base'
import { refreshTokenAndRetry } from './auth-interceptor'
import { useNotifications } from '@/shared/model'

export interface ApiRequestOptions extends RequestInit {
  queryParams?: Record<string, string | number | boolean | undefined | null>;
}

export const apiClient = async <T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> => {
  let fullUrl = endpoint

  if (options.queryParams) {
    const query = new URLSearchParams()
    Object.entries(options.queryParams).forEach(([key, value]) => {
      // Игнорируем пустые значения, null и undefined
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, String(value))
      }
    })

    const queryString = query.toString()
    if (queryString) {
      // Проверяем, есть ли уже знак вопроса в URL
      fullUrl += (fullUrl.includes('?') ? '&' : '?') + queryString
    }
  }

  const token = tokenService.getAccessToken()
  const headers = new Headers(options.headers)

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  try {
    return await baseFetch<T>(fullUrl, { ...options, headers })
  } catch (error: any) {
    if (error.status === 401 && endpoint !== '/auth/refresh') {
      try {
        return await refreshTokenAndRetry<T>(fullUrl, { ...options, headers })
      } catch (refreshError) {
        throw refreshError
      }
    }

    const notifications = useNotifications()
    const errorMessage = error.message || 'Произошла непредвиденная ошибка'

    // Не показываем Toast для 401 ошибки (пользователя и так выкинет на /login)
    if (error.status !== 401) {
      notifications.showToast('error', 'Ошибка запроса', errorMessage)
    }

    throw error
  }
}
