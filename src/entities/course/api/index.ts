import { api } from '@/shared/api'
import { courseApiPath } from '@/shared/config/api-routes'

import type { Course, StudentCourse, StudentCourseDetails } from '../model/types'

export const fetchCoursesList = () => api<Course[]>(courseApiPath('/teacher/courses'))

export const createCourse = (courseData: Partial<Course>) =>
  api<Course>(courseApiPath('/teacher/courses'), {
    method: 'POST',
    body: JSON.stringify(courseData)
  })

export const updateCourseById = (id: string, updatedData: Partial<Course>) =>
  api<Course>(courseApiPath(`/teacher/courses/${id}`), {
    method: 'PATCH',
    body: JSON.stringify(updatedData)
  })

export const fetchStudentCoursesList = () =>
  api<StudentCourse[]>(courseApiPath('/student/courses'))

export const fetchStudentCourseDetails = (id: string) =>
  api<StudentCourseDetails>(courseApiPath(`/student/courses/${id}`))
