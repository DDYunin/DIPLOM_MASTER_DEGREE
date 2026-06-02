import { defineConfig, devices } from '@playwright/test'

/**
 * E2E тесты для ключевых пользовательских сценариев.
 * Запуск: npm run test:e2e
 * Перед запуском должно быть запущено приложение: npm run dev (порт 5173)
 */
export default defineConfig({
  testDir: './e2e',
  outputDir: './e2e/test-results',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,

  reporter: [['html', { outputFolder: 'e2e/playwright-report', open: 'never' }], ['list']],

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    locale: 'ru-RU'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],

  // Запустить dev-сервер автоматически если не запущен
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env['CI'],
    timeout: 30_000
  }
})
