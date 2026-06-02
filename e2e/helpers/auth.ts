import type { Page } from '@playwright/test'

/**
 * Вспомогательные функции для E2E-тестов авторизации.
 *
 * Mock JWT строится без подписи — достаточно для jwtDecode на клиенте.
 * Payload кодируется в base64url (стандарт JWT).
 */

const b64url = (obj: object) =>
  Buffer.from(JSON.stringify(obj))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

export const buildMockJwt = (role: string): string => {
  const payload = b64url({ roles: [role], exp: Math.floor(Date.now() / 1000) + 3600 })
  return `header.${payload}.signature`
}

/**
 * Авторизоваться через UI (форма логина).
 * API-запрос перехватывается и возвращает mock JWT.
 */
export const loginViaUI = async (page: Page, role: string) => {
  const token = buildMockJwt(role)

  await page.route('**/auth/login', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ accessToken: token })
    })
  )

  await page.goto('/login')
  await page.fill('#email', 'user@example.com')
  // PrimeVue Password рендерит input внутри обёртки — ищем по id на input
  await page.locator('#password').fill('password123')
  await page.click('[type=submit]')
}

/**
 * Авторизоваться быстро — сразу через localStorage (без UI).
 * Используется для тестов, где сам процесс логина не проверяется.
 */
export const loginViaStorage = async (page: Page, role: string) => {
  const token = buildMockJwt(role)

  await page.goto('/login')
  await page.evaluate((t) => localStorage.setItem('app_access_token', t), token)
}
