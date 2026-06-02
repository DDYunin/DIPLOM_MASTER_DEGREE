import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { withAppSurface } from '@/shared/lib/storybook/decorators'
import FilterUsersByRole from './FilterUsersByRole.vue'

const meta: Meta<typeof FilterUsersByRole> = {
  title: 'Features/FilterUsersByRole/FilterUsersByRole',
  component: FilterUsersByRole,
  tags: ['autodocs'],
  decorators: [withAppSurface],
  parameters: {
    docs: {
      description: {
        component:
          'Таб-переключатель фильтрации таблицы пользователей по роли. Использует v-model для синхронизации активного фильтра.'
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const AllActive: Story = {
  name: 'Все пользователи',
  args: {
    modelValue: 'ALL'
  }
}

export const TeacherActive: Story = {
  name: 'Фильтр: Преподаватели',
  args: {
    modelValue: 'TEACHER'
  }
}

export const StudentActive: Story = {
  name: 'Фильтр: Студенты',
  args: {
    modelValue: 'STUDENT'
  }
}
