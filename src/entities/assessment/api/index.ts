import { api } from '@/shared/api'
import type { AssessmentInfo } from '../model/types'

export const fetchAssessmentInfo = (courseId: string, assessmentId: string) =>
  api<AssessmentInfo>(`/student/courses/${courseId}/assessments/${assessmentId}`)
