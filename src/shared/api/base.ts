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
    // Выкидываем кастомную ошибку с полем status, чтобы перехватчики могли её прочитать
    const error = new Error(`HTTP Error: ${response.status}`)
    ;(error as any).status = response.status
    throw error
  }

  // Пустой ответ (204 No Content)
  if (response.status === 204) {
    return {} as T
  }

  return await response.json()
}
