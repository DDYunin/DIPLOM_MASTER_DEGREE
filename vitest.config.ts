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
            restoreMocks: true,
            coverage: {
              provider: 'v8',
              reporter: ['text', 'html', 'json-summary'],
              reportsDirectory: './coverage',
              include: ['src/**/*.{ts,vue}'],
              exclude: [
                'src/**/*.stories.{ts,tsx}',
                'src/**/*.spec.{ts,tsx}',
                'src/**/*.test.{ts,tsx}',
                'src/test/**',
                'src/main.ts',
                'src/app/App.vue',
                'src/**/index.ts',
                'src/**/*.d.ts'
              ],
              thresholds: {
                lines: 30,
                functions: 30,
                branches: 30,
                statements: 30
              }
            }
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
