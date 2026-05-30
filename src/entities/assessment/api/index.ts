import { api } from '@/shared/api'
import { courseApiPath } from '@/shared/config/api-routes'

import type { AssessmentInfo } from '../model/types'

export const fetchAssessmentInfo = (courseId: string, assessmentId: string) =>
  api<AssessmentInfo>(courseApiPath(`/student/courses/${courseId}/assessments/${assessmentId}`))
