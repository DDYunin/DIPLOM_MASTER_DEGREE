export const baseFetch = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const headers = new Headers(options.headers)

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(endpoint, {
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

    const errorMessage =
      payload?.debugErrorMessage || payload?.errorCode || `HTTP Error: ${response.status}`
    const error = new Error(errorMessage)
    ;(error as Error & { status?: number; payload?: unknown; errorCode?: string }).status =
      response.status
    ;(error as Error & { payload?: unknown }).payload = errorPayload
    if (payload?.errorCode) {
      ;(error as Error & { errorCode?: string }).errorCode = payload.errorCode
    }
    throw error
  }

  if (response.status === 204) {
    return {} as T
  }

  return await response.json()
}
