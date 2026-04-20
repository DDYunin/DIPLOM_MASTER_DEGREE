import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { StudentCourse, StudentCourseDetails } from './types'
import { fetchStudentCoursesList, fetchStudentCourseDetails } from '../api'

export const useStudentCourseStore = defineStore('studentCourse', () => {
  const courses = ref<StudentCourse[]>([])
  const isLoading = ref(false)

  const activeCourses = computed(() => courses.value.filter((c) => c.status === 'Active'))
  const completedCourses = computed(() => courses.value.filter((c) => c.status === 'Completed'))

  const loadCourses = async () => {
    isLoading.value = true
    try {
      const data = await fetchStudentCoursesList()
      if (data) {
        courses.value = data
      }
    } finally {
      isLoading.value = false
    }
  }

  const currentCourseDetails = ref<StudentCourseDetails | null>(null)
  const isDetailsLoading = ref(false)
  const loadCourseDetails = async (id: string) => {
    isDetailsLoading.value = true
    try {
      const data = await fetchStudentCourseDetails(id)
      if (data) {
        currentCourseDetails.value = data
      }
    } finally {
      isDetailsLoading.value = false
    }
  }

  return {
    courses,
    isLoading,
    activeCourses,
    completedCourses,
    loadCourses,
    currentCourseDetails,
    isDetailsLoading,
    loadCourseDetails
  }
})
