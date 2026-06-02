import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { withAppSurface } from '@/shared/lib/storybook/decorators'
import {
  mockTeacherUser,
  mockStudentUser,
  mockAdminUser,
  mockDepartments,
  mockGroups
} from '../lib/storybook-mocks'
import ProfileInfoCard from './ProfileInfoCard.vue'

const meta: Meta<typeof ProfileInfoCard> = {
  title: 'Widgets/ProfileInfoCard',
  component: ProfileInfoCard,
  tags: ['autodocs'],
  decorators: [withAppSurface],
  parameters: {
    docs: {
      description: {
        component:
          'Карточка профиля пользователя с аватаром и редактируемыми полями. Адаптирует отображаемые поля в зависимости от роли (преподаватель, студент, администратор) и варианта (`default` / `own-profile`).'
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Teacher: Story = {
  name: 'Профиль преподавателя',
  args: {
    modelValue: mockTeacherUser,
    variant: 'default',
    departmentOptions: mockDepartments
  }
}

export const Student: Story = {
  name: 'Профиль студента',
  args: {
    modelValue: mockStudentUser,
    variant: 'default',
    groupOptions: mockGroups
  }
}

export const Admin: Story = {
  name: 'Профиль администратора',
  args: {
    modelValue: mockAdminUser,
    variant: 'own-profile'
  }
}
