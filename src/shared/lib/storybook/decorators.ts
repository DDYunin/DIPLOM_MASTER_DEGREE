import type { Decorator } from '@storybook/vue3-vite'

export const withAppSurface: Decorator = () => ({
  template: `
    <div
      style="
        padding: 1.5rem;
        background: var(--surface-ground);
        color: var(--text-color);
        font-family: var(--font-family);
        min-height: 120px;
      "
    >
      <story />
    </div>
  `
})

/** Тёмная тема — класс совпадает с useThemeStore (см. tokens.css). */
export const withDarkTheme: Decorator = () => ({
  template: `
    <div
      class="my-app-dark"
      style="
        padding: 1.5rem;
        background: var(--surface-ground);
        color: var(--text-color);
        font-family: var(--font-family);
        min-height: 120px;
      "
    >
      <story />
    </div>
  `
})

/** Ограничивает ширину для карточек курсов. */
export const withCardWidth: Decorator = () => ({
  template: '<div style="max-width: 360px;"><story /></div>'
})
