import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { withAppSurface } from '@/shared/lib/storybook/decorators'
import AdminHeader from './AdminHeader.vue'

const meta: Meta<typeof AdminHeader> = {
  title: 'Widgets/AdminHeader',
  component: AdminHeader,
  tags: ['autodocs'],
  decorators: [withAppSurface],
  parameters: {
    docs: {
      description: {
        component:
          'Верхняя панель административного портала: переключатели языка и темы, кнопка уведомлений.'
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Шапка администратора'
}
