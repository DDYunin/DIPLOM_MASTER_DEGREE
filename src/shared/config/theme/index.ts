/**
 * Тема приложения: светлая / тёмная.
 *
 * Все цвета задаются один раз в `src/app/styles/tokens.css`.
 * В компонентах используйте семантические CSS-переменные:
 * --text-color, --surface-card, --color-primary, --shadow-sm и т.д.
 *
 * Переключение: useThemeStore + класс `.my-app-dark` на `<html>`.
 * В кастомных стилях не используйте `--p-*` — только семантические токены из tokens.css.
 * Сами компоненты PrimeVue (Button, Input, …) стилизуются пресетом Aura через darkModeSelector.
 */

export const THEME_STORAGE_KEY = 'app-theme-mode' as const
export const THEME_DARK_CLASS = 'my-app-dark' as const
