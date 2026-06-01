import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import { getCurrentUserIdAsNumber } from '@/shared/lib/jwt'

import * as courseApi from '../api'
import { buildCreateCoursePayload, buildUpdateCoursePayload, type CourseFormValues } from '../lib/buildPayload'
import { mapCourseDtoToCourse } from '../lib/mappers'
import type { Course } from './types'

export const useCourseStore = defineStore('course', () => {
  const courses = ref<Course[]>([])
  const isLoading = ref(false)
  const isSaving = ref(false)
  const stats = ref({ activeCoursesCount: 0, totalStudents: 0 })

  const activeCourses = computed(() => courses.value.filter((c) => c.status === 'Active'))
  const draftCourses = computed(() =>
    courses.value.filter((c) => c.status === 'Draft' || c.status === 'Unpublished')
  )
  const totalStudents = computed(() => stats.value.totalStudents)

  const resolveUserId = (): number => {
    const userId = getCurrentUserIdAsNumber()
    if (userId === null) {
      throw new Error('Unable to resolve current user id')
    }
    return userId
  }

  const upsertCourse = (course: Course) => {
    const index = courses.value.findIndex((item) => item.id === course.id)
    if (index === -1) {
      courses.value.unshift(course)
      return
    }
    courses.value[index] = course
  }

  const loadCourses = async (filter?: string) => {
    isLoading.value = true
    try {
      const userId = resolveUserId()
      const [coursesResponse, statsResponse] = await Promise.all([
        courseApi.fetchCourses({ user_id: userId, filter }),
        courseApi.fetchCourseStats({ user_id: userId })
      ])

      courses.value = coursesResponse.map(mapCourseDtoToCourse)
      stats.value = statsResponse
    } finally {
      isLoading.value = false
    }
  }

  const loadCourseById = async (courseId: string) => {
    const cached = getCourseById(courseId)
    if (cached) {
      return cached
    }

    isLoading.value = true
    try {
      const dto = await courseApi.fetchCourseById(Number(courseId))
      const course = mapCourseDtoToCourse(dto)
      upsertCourse(course)
      return course
    } finally {
      isLoading.value = false
    }
  }

  const addCourse = async (values: CourseFormValues) => {
    isSaving.value = true
    try {
      const ownerUserId = resolveUserId()
      const dto = await courseApi.createCourse(buildCreateCoursePayload(values, ownerUserId))
      const course = mapCourseDtoToCourse(dto)
      upsertCourse(course)
      return course
    } finally {
      isSaving.value = false
    }
  }

  const updateCourse = async (id: string, values: CourseFormValues) => {
    isSaving.value = true
    try {
      const dto = await courseApi.updateCourse(Number(id), buildUpdateCoursePayload(values))
      const course = mapCourseDtoToCourse(dto)
      upsertCourse(course)
      return course
    } finally {
      isSaving.value = false
    }
  }

  const getCourseById = (id: string) => courses.value.find((c) => c.id === id)

  return {
    courses,
    isLoading,
    isSaving,
    stats,
    activeCourses,
    draftCourses,
    totalStudents,
    loadCourses,
    loadCourseById,
    addCourse,
    updateCourse,
    getCourseById
  }
})
