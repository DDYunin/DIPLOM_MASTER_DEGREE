import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { withCardWidth } from '@/shared/lib/storybook/decorators'
import {
  mockStudentCourseMultipleInstructors,
  mockStudentCourseSingleInstructor
} from '../lib/storybook-mocks'

import StudentCourseCard from './StudentCourseCard.vue'

const meta: Meta<typeof StudentCourseCard> = {
  title: 'Entities/Course/StudentCourseCard',
  component: StudentCourseCard,
  tags: ['autodocs'],
  decorators: [withCardWidth],
  parameters: {
    docs: {
      description: {
        component: 'Карточка курса в списке студента.'
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const SingleInstructor: Story = {
  name: 'Один преподаватель',
  args: {
    course: mockStudentCourseSingleInstructor
  }
}

export const MultipleInstructors: Story = {
  name: 'Несколько преподавателей',
  args: {
    course: mockStudentCourseMultipleInstructors
  }
}
