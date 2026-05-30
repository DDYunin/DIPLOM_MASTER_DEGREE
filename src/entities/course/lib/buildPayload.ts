import type { Course } from '../model/types'
import type { CreateCourseRequest, UpdateCourseRequest } from '../api/types'
import { mapStatusUiToDto } from './mappers'

export interface CourseFormValues {
  title: string
  description?: string
  status?: Course['status']
  coverImageId?: string
}

export const buildCreateCoursePayload = (
  values: CourseFormValues,
  ownerUserId: number
): CreateCourseRequest => ({
  title: values.title.trim(),
  description: values.description?.trim() || undefined,
  ownerUserId,
  coverImageId: values.coverImageId
})

export const buildUpdateCoursePayload = (values: CourseFormValues): UpdateCourseRequest => ({
  title: values.title.trim(),
  description: values.description?.trim(),
  coverImageId: values.coverImageId,
  status: values.status ? mapStatusUiToDto(values.status) : undefined
})
