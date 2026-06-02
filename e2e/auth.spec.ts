import { expect, test } from '@playwright/test'

import { loginViaUI } from './helpers/auth'

/**
 * 5.3 E2E — сценарии авторизации и ролевой маршрутизации.
 *
 * API-запросы к /auth/login перехватываются и возвращают mock JWT
 * с нужной ролью — реальный бэкенд не требуется.
 */

test.describe('Страница логина', () => {
  test('гость видит форму входа', async ({ page }) => {
    await page.goto('/login')

    await expect(page.locator('#email')).toBeVisible()
    await expect(page.locator('#password')).toBeVisible()
    await expect(page.locator('[type=submit]')).toBeVisible()
  })

  test('авторизованный пользователь не попадает на /login — редирект на портал', async ({
    page
  }) => {
    // Логинимся как студент
    await loginViaUI(page, 'ROLE_STUDENT')

    // После успешного логина роутер должен перенаправить на /student
    await expect(page).toHaveURL(/\/student/)
  })

  test('администратор перенаправляется на /admin', async ({ page }) => {
    await loginViaUI(page, 'ROLE_ADMIN')

    await expect(page).toHaveURL(/\/admin/)
  })

  test('преподаватель перенаправляется на /teacher', async ({ page }) => {
    await loginViaUI(page, 'ROLE_TEACHER')

    await expect(page).toHaveURL(/\/teacher/)
  })
})
