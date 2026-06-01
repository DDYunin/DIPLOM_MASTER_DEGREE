import { api } from '@/shared/api'
import { courseApiPath } from '@/shared/config/api-routes'

import type {
  CourseDto,
  CourseSectionDto,
  CourseSectionItemDto,
  CourseWithItemsDto,
  CoursesStatsResponseDto,
  CreateAssignmentRequest,
  CreateCourseRequest,
  CreateCourseSectionItemRequest,
  CreateCourseSectionRequest,
  FetchCourseStatsQueryParams,
  FetchCoursesQueryParams,
  UpdateCourseRequest,
  UpdateCourseSectionItemRequest,
  UpdateCourseSectionRequest
} from './types'

const toQueryParams = (params: Record<string, string | number | boolean | null | undefined>) =>
  params as Record<string, string | number | boolean | null | undefined>

export const fetchCourses = (queryParams: FetchCoursesQueryParams) =>
  api<CourseDto[]>(courseApiPath('/courses'), {
    queryParams: toQueryParams(queryParams)
  })

export const fetchCourseStats = (queryParams: FetchCourseStatsQueryParams) =>
  api<CoursesStatsResponseDto>(courseApiPath('/courses/stats'), {
    queryParams: toQueryParams(queryParams)
  })

export const fetchCourseById = (courseId: number) =>
  api<CourseDto>(courseApiPath(`/courses/${courseId}`))

export const fetchCourseWithItems = (courseId: number, limit = 500, offset = 0) =>
  api<CourseWithItemsDto>(courseApiPath(`/courses/${courseId}/with-all-items`), {
    queryParams: { limit, offset }
  })

export const createCourse = (payload: CreateCourseRequest) =>
  api<CourseDto>(courseApiPath('/courses'), {
    method: 'POST',
    body: JSON.stringify(payload)
  })

export const updateCourse = (courseId: number, payload: UpdateCourseRequest) =>
  api<CourseDto>(courseApiPath(`/courses/${courseId}`), {
    method: 'PUT',
    body: JSON.stringify(payload)
  })

export const createCourseSection = (payload: CreateCourseSectionRequest) =>
  api<CourseSectionDto>(courseApiPath('/course-sections'), {
    method: 'POST',
    body: JSON.stringify(payload)
  })

export const updateCourseSection = (sectionId: number, payload: UpdateCourseSectionRequest) =>
  api<CourseSectionDto>(courseApiPath(`/course-sections/${sectionId}`), {
    method: 'PUT',
    body: JSON.stringify(payload)
  })

export const deleteCourseSection = (sectionId: number) =>
  api<void>(courseApiPath(`/course-sections/${sectionId}`), {
    method: 'DELETE'
  })

export const createCourseSectionItem = (payload: CreateCourseSectionItemRequest) =>
  api<CourseSectionItemDto>(courseApiPath('/course-section-items'), {
    method: 'POST',
    body: JSON.stringify(payload)
  })

export const updateCourseSectionItem = (
  itemId: number,
  payload: UpdateCourseSectionItemRequest
) =>
  api<CourseSectionItemDto>(courseApiPath(`/course-section-items/${itemId}`), {
    method: 'PUT',
    body: JSON.stringify(payload)
  })

export const deleteCourseSectionItem = (itemId: number) =>
  api<void>(courseApiPath(`/course-section-items/${itemId}`), {
    method: 'DELETE'
  })

export const createAssignment = (payload: CreateAssignmentRequest) =>
  api<unknown>(courseApiPath('/assignments'), {
    method: 'POST',
    body: JSON.stringify(payload)
  })

export const fetchStudentCoursesList = () =>
  api<import('../model/types').StudentCourse[]>(courseApiPath('/student/courses'))

export const fetchStudentCourseDetails = (id: string) =>
  api<import('../model/types').StudentCourseDetails>(courseApiPath(`/student/courses/${id}`))
