/**
 * Единый API gateway: один apiClient, маршрутизация по префиксу пути.
 * Vite proxy (dev) / nginx (prod) перенаправляет:
 *   /api/users  → users service  (8080)
 *   /api/course → course service (10001)
 *   /api/files  → file service   (8087)
 */
export const API_GATEWAY = '/api'

export const USERS_API_PREFIX = `${API_GATEWAY}/users/v1`
export const COURSE_API_PREFIX = `${API_GATEWAY}/course/cs/v1`
export const FILES_API_PREFIX = `${API_GATEWAY}/files/v1`

const withLeadingSlash = (path: string): string => (path.startsWith('/') ? path : `/${path}`)

export const usersApiPath = (path: string): string =>
  `${USERS_API_PREFIX}${withLeadingSlash(path)}`

export const courseApiPath = (path: string): string =>
  `${COURSE_API_PREFIX}${withLeadingSlash(path)}`

export const filesApiPath = (path: string): string =>
  `${FILES_API_PREFIX}${withLeadingSlash(path)}`
