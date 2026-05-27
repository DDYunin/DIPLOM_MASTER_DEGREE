import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ThemeToggler from './ThemeToggler.vue'

const meta: Meta<typeof ThemeToggler> = {
  title: 'Features/ToggleTheme/ThemeToggler',
  component: ThemeToggler,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Кнопка переключения светлой/тёмной темы. Состояние хранится в `useThemeStore` (Pinia).'
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const LightMode: Story = {
  name: 'Светлая тема'
}

export const DarkMode: Story = {
  name: 'Тёмная тема',
  decorators: [
    () => ({
      template: '<div class="my-app-dark" style="padding: 1rem; background: #1a1a2e"><story /></div>'
    })
  ]
}
