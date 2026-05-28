import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { withCardWidth } from '@/shared/lib/storybook/decorators'
import { mockTeacherCourseActive, mockTeacherCourseDraft } from '../lib/storybook-mocks'

import CourseCard from './CourseCard.vue'

const meta: Meta<typeof CourseCard> = {
  title: 'Entities/Course/CourseCard',
  component: CourseCard,
  tags: ['autodocs'],
  decorators: [withCardWidth],
  parameters: {
    docs: {
      description: {
        component: 'Карточка курса в списке преподавателя.'
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Active: Story = {
  name: 'Активный курс',
  args: {
    course: mockTeacherCourseActive
  }
}

export const Draft: Story = {
  name: 'Черновик',
  args: {
    course: mockTeacherCourseDraft
  }
}
