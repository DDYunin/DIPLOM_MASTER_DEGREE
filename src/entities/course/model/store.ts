import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Course } from './types'
import * as courseApi from '../api'

export const useCourseStore = defineStore('course', () => {
  const courses = ref<Course[]>([])
  const isLoading = ref(false)

  // --- ГЕТТЕРЫ ---
  // Пригодятся для вывода статистики на странице TeacherCourses
  const activeCourses = computed(() => courses.value.filter((c) => c.status === 'Active'))
  const draftCourses = computed(() =>
    courses.value.filter((c) => c.status === 'Draft' || c.status === 'Unpublished')
  )

  // Подсчет общего количества студентов на всех активных курсах преподавателя
  const totalStudents = computed(() =>
    activeCourses.value.reduce((sum, course) => sum + course.studentsCount, 0)
  )

  // --- ЭКШЕНЫ ---
  const loadCourses = async () => {
    isLoading.value = true
    try {
      const data = await courseApi.fetchCoursesList()
      if (data) {
        courses.value = data
      }
    } finally {
      isLoading.value = false
    }
  }

  const addCourse = async (course: Partial<Course>) => {
    // try/catch не нужен, ошибку покажет Toast из apiClient
    const createdCourse = await courseApi.createCourse(course)
    if (createdCourse) {
      courses.value.unshift(createdCourse)
    }
  }

  const updateCourse = async (id: string, updatedData: Partial<Course>) => {
    const updatedCourse = await courseApi.updateCourseById(id, updatedData)
    if (updatedCourse) {
      const index = courses.value.findIndex((c) => c.id === id)
      if (index !== -1) {
        courses.value[index] = updatedCourse
      }
    }
  }

  const getCourseById = (id: string) => courses.value.find((c) => c.id === id)

  return {
    courses,
    isLoading,
    activeCourses,
    draftCourses,
    totalStudents,
    loadCourses,
    addCourse,
    updateCourse,
    getCourseById
  }
})
