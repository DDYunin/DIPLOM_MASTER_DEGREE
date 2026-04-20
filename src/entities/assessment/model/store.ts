import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AssessmentInfo } from './types'
import { fetchAssessmentInfo } from '../api'

export const useAssessmentStore = defineStore('assessment', () => {
  const currentAssessment = ref<AssessmentInfo | null>(null)
  const isLoading = ref(false)

  const loadAssessment = async (courseId: string, assessmentId: string) => {
    isLoading.value = true
    try {
      const data = await fetchAssessmentInfo(courseId, assessmentId)
      if (data) {
        currentAssessment.value = data
      }
    } finally {
      isLoading.value = false
    }
  }

  return {
    currentAssessment,
    isLoading,
    loadAssessment
  }
})
