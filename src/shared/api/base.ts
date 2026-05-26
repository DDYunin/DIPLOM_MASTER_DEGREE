const BASE_URL = import.meta.env.VITE_API_URL

export const baseFetch = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const headers = new Headers(options.headers)

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  })

  if (!response.ok) {
    let errorPayload: unknown = null
    try {
      errorPayload = await response.json()
    } catch {
      errorPayload = null
    }

    const payload = errorPayload as
      | { debugErrorMessage?: string; errorCode?: string }
      | null
      | undefined

    const errorMessage = payload?.debugErrorMessage || payload?.errorCode || `HTTP Error: ${response.status}`
    // Выкидываем кастомную ошибку с полем status, чтобы перехватчики могли её прочитать
    const error = new Error(errorMessage)
    ;(error as any).status = response.status
    ;(error as any).payload = errorPayload
    if (payload?.errorCode) {
      ;(error as any).errorCode = payload.errorCode
    }
    throw error
  }

  // Пустой ответ (204 No Content)
  if (response.status === 204) {
    return {} as T
  }

  return await response.json()
}
