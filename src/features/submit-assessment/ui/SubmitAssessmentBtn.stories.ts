import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { Decorator } from '@storybook/vue3-vite'

import { withAppSurface } from '@/shared/lib/storybook/decorators'
import { useAssessmentSessionStore } from '@/entities/assessment-session'
import SubmitAssessmentBtn from './SubmitAssessmentBtn.vue'

/** Декоратор: сессия с ответами на все 4 вопроса (прогресс 100 %). */
const withAllAnsweredSession: Decorator = () => ({
  setup() {
    const store = useAssessmentSessionStore()
    store.$patch({
      session: {
        id: 'sess-1',
        assessmentId: 'a1',
        courseId: '1',
        courseTitle: 'Структуры данных',
        title: 'Промежуточный контроль',
        timeRemaining: 1800,
        questions: [
          { id: 'q1', type: 'single-choice', text: 'Вопрос 1', options: [] },
          { id: 'q2', type: 'single-choice', text: 'Вопрос 2', options: [] },
          { id: 'q3', type: 'single-choice', text: 'Вопрос 3', options: [] },
          { id: 'q4', type: 'single-choice', text: 'Вопрос 4', options: [] }
        ],
        answers: {
          q1: { questionId: 'q1', value: 'a', isFlagged: false },
          q2: { questionId: 'q2', value: 'b', isFlagged: false },
          q3: { questionId: 'q3', value: 'c', isFlagged: false },
          q4: { questionId: 'q4', value: 'd', isFlagged: false }
        }
      }
    })
  },
  template: '<story />'
})

/** Декоратор: сессия с 2 неотвеченными вопросами (прогресс 50 %). */
const withPartialSession: Decorator = () => ({
  setup() {
    const store = useAssessmentSessionStore()
    store.$patch({
      session: {
        id: 'sess-2',
        assessmentId: 'a1',
        courseId: '1',
        courseTitle: 'Структуры данных',
        title: 'Промежуточный контроль',
        timeRemaining: 900,
        questions: [
          { id: 'q1', type: 'single-choice', text: 'Вопрос 1', options: [] },
          { id: 'q2', type: 'single-choice', text: 'Вопрос 2', options: [] },
          { id: 'q3', type: 'single-choice', text: 'Вопрос 3', options: [] },
          { id: 'q4', type: 'single-choice', text: 'Вопрос 4', options: [] }
        ],
        answers: {
          q1: { questionId: 'q1', value: 'a', isFlagged: false },
          q2: { questionId: 'q2', value: 'b', isFlagged: false },
          q3: { questionId: 'q3', value: null, isFlagged: false },
          q4: { questionId: 'q4', value: null, isFlagged: false }
        }
      }
    })
  },
  template: '<story />'
})

const meta: Meta<typeof SubmitAssessmentBtn> = {
  title: 'Features/SubmitAssessment/SubmitAssessmentBtn',
  component: SubmitAssessmentBtn,
  tags: ['autodocs'],
  decorators: [withAppSurface],
  parameters: {
    docs: {
      description: {
        component:
          'Кнопка завершения теста с диалогом подтверждения. Цвет и текст диалога зависят от полноты заполнения ответов.'
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const AllAnswered: Story = {
  name: 'Все ответы заполнены',
  decorators: [withAllAnsweredSession]
}

export const PartialAnswers: Story = {
  name: 'Есть неотвеченные вопросы',
  decorators: [withPartialSession]
}
