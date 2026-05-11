import { tokenService } from './token.service'
import { useNotifications } from '../model/useNotifications'

// const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const BASE_URL = import.meta.env.VITE_API_URL

interface FailedRequest {
  resolve: (token: string | null) => void
  reject: (error: any) => void
}

let isRefreshing = false
let failedQueue: FailedRequest[] = []

/**
 * Обработка очереди задержанных запросов
 */
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`

  debugger
  // 1. Подготовка заголовков
  const headers = new Headers(options.headers)
  headers.set("Content-Type", "application/json")
  const accessToken = tokenService.getAccessToken()

  // Не добавляем токен, если это запрос на обновление или если токена нет
  if (accessToken && !endpoint.includes('/auth/login')) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  // Настройка конфига
  const config: RequestInit = {
    ...options,
    headers
  }

  try {
    const response = await fetch(url, config)

    // 2. Если запрос успешный (2xx)
    if (response.ok) {
      // Если контента нет (204), возвращаем пустой объект или null
      if (response.status === 204) return {} as T
      return await response.json()
    }

    // 3. Обработка 401 (Unauthorized)
    if (response.status === 401 && !endpoint.includes('/auth/login')) {
      // Если обновление уже идет, добавляем запрос в очередь
      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            headers.set('Authorization', `Bearer ${token}`)
            return apiClient<T>(endpoint, { ...options, headers })
          })
          .catch((err) => Promise.reject(err))
      }

      isRefreshing = true

      const refreshToken = tokenService.getRefreshToken()

      if (!refreshToken) {
        handleAuthError('Сессия истекла. Пожалуйста, войдите снова.')
        return Promise.reject(new Error('No refresh token available'))
      }

      try {
        // Попытка обновить токен
        const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        })

        if (!refreshResponse.ok) throw new Error('Refresh failed')

        const { access, refresh } = await refreshResponse.json()

        tokenService.setTokens(access, refresh)
        processQueue(null, access)
        isRefreshing = false

        // Повторяем исходный запрос с новым токеном
        headers.set('Authorization', `Bearer ${access}`)
        return apiClient<T>(endpoint, { ...options, headers })
      } catch (refreshError) {
        processQueue(refreshError, null)
        isRefreshing = false
        handleAuthError('Ошибка авторизации. Войдите в систему заново.')
        return Promise.reject(refreshError)
      }
    }

    // Обработка остальных ошибок (400, 403, 500 и т.д.)
    const errorData = await response.json().catch(() => ({}))
    throw errorData
  } catch (error: any) {
    // Если это не наша обработанная ошибка 401
    return Promise.reject(error)
  }
}

/**
 * Вспомогательный метод для очистки данных и редиректа
 */
function handleAuthError(message: string) {
  const { showToast } = useNotifications()

  tokenService.clearTokens()
  showToast('error', 'Авторизация', message)
}
