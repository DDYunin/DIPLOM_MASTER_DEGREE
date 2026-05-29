import { usersApiPath } from '@/shared/config/api-routes'

import { baseFetch } from './base'
import { tokenService } from './token.service'

interface FailedRequest {
  resolve: (token: string | null) => void
  reject: (error: any) => void
}

let isRefreshing = false

let failedQueue: FailedRequest[] = []

// Представим, что эта функция реализована: она должна перебрать failedQueue
// и вызвать resolve(token) или reject(error) для каждого элемента.
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

export const refreshTokenAndRetry = async <T>(
  endpoint: string,
  options: RequestInit
): Promise<T> => {
  // 1. Если процесс обновления УЖЕ идет в другом запросе
  if (isRefreshing) {
    return new Promise(function (resolve, reject) {
      // Ставим этот запрос в очередь
      failedQueue.push({
        resolve: function (token: string | null) {
          // Когда токен обновится, подставляем его и повторяем запрос
          const headers = new Headers(options.headers)
          headers.set('Authorization', `Bearer ${token}`)
          resolve(baseFetch<T>(endpoint, { ...options, headers }))
        },
        reject: function (err: any) {
          reject(err)
        }
      })
    })
  }

  // 2. Если мы первые, кто столкнулся с 401 ошибкой — блокируем очередь
  isRefreshing = true

  try {
    const refreshToken = tokenService.getRefreshToken()
    if (!refreshToken) {
      throw new Error('Refresh token is missing')
    }

    // Делаем запрос на бэкенд за новой парой токенов
    // ВАЖНО: используем "глупый" baseFetch, чтобы не попасть в бесконечный цикл 401 ошибок
    const response = await baseFetch<{ accessToken: string; refreshToken: string }>(
      usersApiPath('/auth/refresh'),
      {
        method: 'POST',
        body: JSON.stringify({ refreshToken })
      }
    )

    // Сохраняем новые токены в localStorage
    tokenService.setTokens(response.accessToken, response.refreshToken)

    // Разбудить все ожидающие запросы, передав им новый токен
    processQueue(null, response.accessToken)

    // Повторить наш текущий (первый упавший) запрос с новым токеном
    const headers = new Headers(options.headers)
    headers.set('Authorization', `Bearer ${response.accessToken}`)

    return await baseFetch<T>(endpoint, { ...options, headers })
  } catch (error) {
    // Если refresh-токен тоже протух или сервер вернул ошибку
    processQueue(error, null) // Отклоняем все ждущие запросы
    tokenService.clearTokens() // Очищаем хранилище
    throw error
  } finally {
    // В любом случае (успех или ошибка) снимаем блокировку
    isRefreshing = false
  }
}
