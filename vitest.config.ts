import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig, mergeConfig } from 'vitest/config'

import viteConfig from './vite.config'

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))

// More info at: https://storybook.js.org/docs/writing-tests/integrations/vitest-addon
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      projects: [
        {
          // Проект для unit-тестов: логика, мапперы, схемы, сервисы
          extends: true,
          test: {
            name: 'unit',
            environment: 'happy-dom',
            setupFiles: ['./src/test/setup.ts'],
            include: ['src/**/*.{spec,test}.{ts,tsx}'],
            clearMocks: true,
            restoreMocks: true
          }
        },
        {
          // Проект для Story-тестов: interaction, a11y, visual через реальный браузер
          extends: true,
          plugins: [storybookTest({ configDir: path.join(dirname, '.storybook') })],
          test: {
            name: 'storybook',
            browser: {
              enabled: true,
              headless: true,
              provider: playwright({}),
              instances: [{ browser: 'chromium' }]
            }
          }
        }
      ]
    }
  })
)
