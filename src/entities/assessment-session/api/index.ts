import { api } from '@/shared/api'
import { courseApiPath } from '@/shared/config/api-routes'

import type { AssessmentSession, AnswerValue } from '../model/types'

export const fetchSession = (courseId: string, assessmentId: string) =>
  api<AssessmentSession>(
    courseApiPath(`/student/courses/${courseId}/assessments/${assessmentId}/session`)
  )

export const saveAnswerApi = (sessionId: string, questionId: string, value: AnswerValue) =>
  api<{ success: boolean }>(courseApiPath(`/student/assessment-sessions/${sessionId}/answers`), {
    method: 'PATCH',
    body: JSON.stringify({ questionId, value })
  })
