import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AssessmentSession, AnswerValue } from './types'
import { fetchSession, saveAnswerApi } from '../api'

export const useAssessmentSessionStore = defineStore('assessmentSession', () => {
  const session = ref<AssessmentSession | null>(null)
  const currentQuestionId = ref<string | null>(null)
  const isLoading = ref(false)
  const isSaving = ref(false) // Для индикации "Draft Saved"

  // Таймер
  let timerInterval: ReturnType<typeof setInterval> | null = null

  // --- ГЕТТЕРЫ ---
  const currentQuestion = computed(
    () => session.value?.questions.find((q) => q.id === currentQuestionId.value) || null
  )

  const currentQuestionIndex = computed(() => {
    if (!session.value || !currentQuestionId.value) {
      return -1
    }
    return session.value.questions.findIndex((q) => q.id === currentQuestionId.value)
  })

  const totalQuestions = computed(() => session.value?.questions.length || 0)

  // Форматирование времени (MM:SS)
  const formattedTime = computed(() => {
    if (!session.value) {
      return '00:00'
    }
    const m = Math.floor(session.value.timeRemaining / 60)
      .toString()
      .padStart(2, '0')
    const s = (session.value.timeRemaining % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  })

  // Прогресс заполнения (%)
  const progressPercentage = computed(() => {
    if (!session.value || totalQuestions.value === 0) {
      return 0
    }
    const answeredCount = Object.values(session.value.answers).filter(
      (ans) =>
        ans.value !== null &&
        ans.value !== '' &&
        (Array.isArray(ans.value) ? ans.value.length > 0 : true)
    ).length
    return Math.round((answeredCount / totalQuestions.value) * 100)
  })

  // --- ЭКШЕНЫ ---
  const loadSession = async (courseId: string, assessmentId: string) => {
    isLoading.value = true
    try {
      const data = await fetchSession(courseId, assessmentId)
      if (data) {
        session.value = data
        // Устанавливаем первый вопрос по умолчанию
        if (data.questions.length > 0) {
          currentQuestionId.value = data.questions[0].id
        }
        startTimer()
      }
    } finally {
      isLoading.value = false
    }
  }

  const startTimer = () => {
    if (timerInterval) clearInterval(timerInterval)
    timerInterval = setInterval(() => {
      if (session.value && session.value.timeRemaining > 0) {
        session.value.timeRemaining--
      } else {
        stopTimer()
        // В будущем: триггер автоматического сабмита по истечению времени
      }
    }, 1000)
  }

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }

  // Обновление ответа (синхронно в стор, асинхронно на бек)
  const updateAnswer = async (questionId: string, value: AnswerValue) => {
    if (!session.value) return

    // Оптимистичное обновление UI
    if (!session.value.answers[questionId]) {
      session.value.answers[questionId] = { questionId, value, isFlagged: false }
    } else {
      session.value.answers[questionId].value = value
    }

    // Имитация автосохранения
    isSaving.value = true
    await saveAnswerApi(session.value.id, questionId, value)
    isSaving.value = false
  }

  const toggleFlag = (questionId: string) => {
    if (!session.value) return
    if (!session.value.answers[questionId]) {
      session.value.answers[questionId] = { questionId, value: null, isFlagged: true }
    } else {
      session.value.answers[questionId].isFlagged = !session.value.answers[questionId].isFlagged
    }
  }

  const goToQuestion = (id: string) => {
    currentQuestionId.value = id
  }

  return {
    session,
    currentQuestionId,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    isLoading,
    isSaving,
    formattedTime,
    progressPercentage,
    loadSession,
    startTimer,
    stopTimer,
    updateAnswer,
    toggleFlag,
    goToQuestion
  }
})
