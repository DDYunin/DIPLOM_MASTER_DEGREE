import { expect, within } from '@storybook/test'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { withDarkTheme } from '@/shared/lib/storybook/decorators'

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
  decorators: [withDarkTheme]
}

export const InteractionTest: Story = {
  name: 'Interaction: aria-label по теме',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const button = canvas.getByRole('button')
    await expect(button).toBeVisible()

    const label = button.getAttribute('aria-label')
    await expect(['Тёмная тема', 'Светлая тема', 'Dark mode', 'Light mode']).toContain(label)
  }
}
