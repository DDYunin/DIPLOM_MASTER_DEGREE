import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { withAppSurface } from '@/shared/lib/storybook/decorators'
import TeacherHeader from './TeacherHeader.vue'

const meta: Meta<typeof TeacherHeader> = {
  title: 'Widgets/TeacherHeader',
  component: TeacherHeader,
  tags: ['autodocs'],
  decorators: [withAppSurface],
  parameters: {
    docs: {
      description: {
        component:
          'Верхняя панель портала преподавателя: переключатели языка и темы, кнопки уведомлений.'
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Шапка преподавателя'
}
