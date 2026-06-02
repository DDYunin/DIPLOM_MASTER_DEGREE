import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { withAppSurface } from '@/shared/lib/storybook/decorators'
import StudentHeader from './StudentHeader.vue'

const meta: Meta<typeof StudentHeader> = {
  title: 'Widgets/StudentHeader',
  component: StudentHeader,
  tags: ['autodocs'],
  decorators: [withAppSurface],
  parameters: {
    docs: {
      description: {
        component:
          'Верхняя панель студенческого портала: переключатели языка и темы, кнопки уведомлений и помощи.'
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Шапка студента'
}
