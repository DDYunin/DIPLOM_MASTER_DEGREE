import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { Decorator } from '@storybook/vue3-vite'

import { withAppSurface } from '@/shared/lib/storybook/decorators'
import { useAssessmentSessionStore } from '@/entities/assessment-session'
import QuestionMap from './QuestionMap.vue'

const questions = [
  { id: 'q1', type: 'single-choice' as const, text: 'Вопрос 1', points: 5, options: [] },
  { id: 'q2', type: 'single-choice' as const, text: 'Вопрос 2', points: 5, options: [] },
  { id: 'q3', type: 'single-choice' as const, text: 'Вопрос 3', points: 5, options: [] },
  { id: 'q4', type: 'single-choice' as const, text: 'Вопрос 4', points: 5, options: [] },
  { id: 'q5', type: 'single-choice' as const, text: 'Вопрос 5', points: 5, options: [] },
  { id: 'q6', type: 'long-text' as const, text: 'Вопрос 6', points: 10, options: [] }
]

/** Сессия: все вопросы отвечены, q3 помечен флагом. */
const withFullSession: Decorator = () => ({
  setup() {
    const store = useAssessmentSessionStore()
    store.$patch({
      session: {
        id: 'sess-story',
        assessmentId: 'a1',
        courseId: '1',
        courseTitle: 'Структуры данных',
        title: 'Промежуточный контроль',
        timeRemaining: 1530,
        questions,
        answers: {
          q1: { questionId: 'q1', value: 'a', isFlagged: false },
          q2: { questionId: 'q2', value: 'b', isFlagged: false },
          q3: { questionId: 'q3', value: 'c', isFlagged: true },
          q4: { questionId: 'q4', value: 'd', isFlagged: false },
          q5: { questionId: 'q5', value: null, isFlagged: false },
          q6: { questionId: 'q6', value: null, isFlagged: false }
        }
      },
      currentQuestionId: 'q3'
    })
  },
  template: '<story />'
})

/** Сессия в начале теста: ответов нет. */
const withEmptySession: Decorator = () => ({
  setup() {
    const store = useAssessmentSessionStore()
    store.$patch({
      session: {
        id: 'sess-empty',
        assessmentId: 'a1',
        courseId: '1',
        courseTitle: 'Структуры данных',
        title: 'Промежуточный контроль',
        timeRemaining: 3600,
        questions,
        answers: {}
      },
      currentQuestionId: 'q1'
    })
  },
  template: '<story />'
})

const meta: Meta<typeof QuestionMap> = {
  title: 'Widgets/AssessmentQuestionMap',
  component: QuestionMap,
  tags: ['autodocs'],
  decorators: [withAppSurface],
  parameters: {
    docs: {
      description: {
        component:
          'Боковая карта вопросов теста: сетка статусов (текущий / отвечен / без ответа / помечен), прогресс-бар и кнопка «Завершить и отправить».'
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const InProgress: Story = {
  name: 'В процессе (4 из 6 отвечено, q3 помечен)',
  decorators: [withFullSession]
}

export const JustStarted: Story = {
  name: 'Начало теста (ответов нет)',
  decorators: [withEmptySession]
}
