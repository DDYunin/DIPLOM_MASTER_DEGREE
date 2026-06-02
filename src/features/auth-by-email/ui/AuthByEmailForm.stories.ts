import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { within, userEvent, expect } from '@storybook/test'

import { withAppSurface } from '@/shared/lib/storybook/decorators'
import AuthByEmailForm from './AuthByEmailForm.vue'

const meta: Meta<typeof AuthByEmailForm> = {
  title: 'Features/AuthByEmail/AuthByEmailForm',
  component: AuthByEmailForm,
  tags: ['autodocs'],
  decorators: [withAppSurface],
  parameters: {
    docs: {
      description: {
        component:
          'Форма авторизации по email и паролю. При успешном входе перенаправляет пользователя на портал, соответствующий его роли.'
      }
    },
    layout: 'centered'
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Пустая форма'
}

export const FilledCredentials: Story = {
  name: 'Interaction: заполнение реквизитов',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const emailInput = canvas.getByPlaceholderText('student.university.edu')
    const passwordInput = canvas.getByPlaceholderText('••••••••')
    const submitBtn = canvas.getByRole('button', { name: /sign in/i })

    await expect(emailInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
    await expect(submitBtn).toBeVisible()

    await userEvent.type(emailInput, 'admin@university.edu')
    await userEvent.type(passwordInput, 'secret123')

    await expect(emailInput).toHaveValue('admin@university.edu')
  }
}
