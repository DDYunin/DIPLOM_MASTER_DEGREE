import { expect, test } from '@playwright/test'

import { loginViaStorage } from './helpers/auth'

/**
 * 5.3 E2E — проверка navigation guards (RBAC).
 *
 * Сценарии: гость → защищённый маршрут, чужая роль → чужой портал.
 */

test.describe('Navigation guards', () => {
  test('неавторизованный пользователь перенаправляется на /login', async ({ page }) => {
    await page.goto('/admin')

    await expect(page).toHaveURL(/\/login/)
  })

  test('попытка войти на /admin с токеном студента → редирект на /student', async ({ page }) => {
    await loginViaStorage(page, 'ROLE_STUDENT')

    await page.goto('/admin')

    await expect(page).toHaveURL(/\/student/)
  })

  test('попытка войти на /student с токеном преподавателя → редирект на /teacher', async ({
    page
  }) => {
    await loginViaStorage(page, 'ROLE_TEACHER')

    await page.goto('/student')

    await expect(page).toHaveURL(/\/teacher/)
  })

  test('/login недоступен для авторизованного пользователя', async ({ page }) => {
    await loginViaStorage(page, 'ROLE_ADMIN')

    await page.goto('/login')

    await expect(page).toHaveURL(/\/admin/)
  })
})
