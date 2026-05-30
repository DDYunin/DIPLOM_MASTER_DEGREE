import { AppPreset } from './prime-preset'

/**
 * Тема приложения: светлая / тёмная.
 *
 * Цвета UI приложения — в `src/app/styles/tokens.css` (--text-color, --surface-card, …).
 * Компоненты PrimeVue — через `AppPreset` (design tokens → CSS-переменные `--p-*`).
 *
 * Переключение dark mode: useThemeStore + класс `.my-app-dark` на `<html>`.
 * В своих компонентах используйте только семантические переменные из tokens.css, не `--p-*`.
 */

export const THEME_STORAGE_KEY = 'app-theme-mode' as const
export const THEME_DARK_CLASS = 'my-app-dark' as const

/** Селектор для PrimeVue darkModeSelector (приложение + Storybook-обёртки). */
export const PRIME_DARK_MODE_SELECTOR =
  `html.${THEME_DARK_CLASS}, .${THEME_DARK_CLASS}` as const

export const primeVueThemeConfig = {
  preset: AppPreset,
  options: {
    darkModeSelector: PRIME_DARK_MODE_SELECTOR
  }
} as const

export { AppPreset } from './prime-preset'
