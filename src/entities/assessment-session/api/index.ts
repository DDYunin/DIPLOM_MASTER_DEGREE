import { api } from '@/shared/api'
import type { AssessmentSession, AnswerValue } from '../model/types'

// Получить сессию тестирования со всеми вопросами
export const fetchSession = (courseId: string, assessmentId: string) =>
  api<AssessmentSession>(`/student/courses/${courseId}/assessments/${assessmentId}/session`)

// Автосохранение одного ответа
export const saveAnswerApi = (sessionId: string, questionId: string, value: AnswerValue) =>
  api<{ success: boolean }>(`/student/assessment-sessions/${sessionId}/answers`, {
    method: 'PATCH',
    body: JSON.stringify({ questionId, value })
  })
