import { api } from '@/shared/api'
import type { AssessmentInfo } from '../model/types'

export const fetchAssessmentInfo = (assessmentId: string) =>
  api<AssessmentInfo>(`/student/assessments/${assessmentId}`)
