import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useQuestionBankEntityStore, questionBankApi } from '@/entities/question-bank'
import type { QuizBankConfig } from './types'

export const useQuizBuilderStore = defineStore('widget-quiz-builder', () => {
  const entityStore = useQuestionBankEntityStore()

  // === ОБЩИЕ НАСТРОЙКИ ФОРМЫ ===
  const title = ref('')
  const instructions = ref('')
  const dueDate = ref<Date | null>(null)
  const timeLimit = ref<number | null>(60)
  const shuffleQuestions = ref(true)
  const showResults = ref(false)

  // === КОНФИГУРАЦИЯ БАНКОВ (UI Состояние Конструктора) ===
  const bankConfigs = ref<QuizBankConfig[]>([])
  const isLoading = ref(false)

  // === ВЫЧИСЛЯЕМЫЕ СВОЙСТВА ===

  // Общее количество вопросов
  const totalQuestions = computed(() => {
    return bankConfigs.value
      .filter((config) => config.isSelected)
      .reduce((sum, config) => sum + (config.drawCount || 0), 0)
  })

  // Общее количество баллов
  const totalPoints = computed(() => {
    return bankConfigs.value
      .filter((config) => config.isSelected)
      .reduce((sum, config) => sum + (config.drawCount || 0) * (config.pointsPerQ || 0), 0)
  })

  // === ЭКШЕНЫ ===

  // Инициализация конструктора
  const initBuilder = async (editData: any = null) => {
    isLoading.value = true
    try {
      // 1. Загружаем доступные банки из API
      const banks = await questionBankApi.fetchBanks()

      // 2. Кладем "мясо" (объекты) в глобальную базу
      entityStore.upsertBanks(banks)

      // 3. Строим локальную конфигурацию для UI
      if (editData) {
        // Режим редактирования (подставляем данные с бэкенда)
        title.value = editData.title
        instructions.value = editData.instructions
        timeLimit.value = editData.timeLimit
        // и т.д., мапим bankConfigs из editData
      } else {
        // Режим создания (дефолтные настройки)
        bankConfigs.value = banks.map((bank) => ({
          bankId: bank.id,
          isSelected: false,
          drawCount: 0,
          pointsPerQ: 1
        }))
      }
    } finally {
      isLoading.value = false
    }
  }

  // Очистка при закрытии/уходе со страницы
  const resetBuilder = () => {
    title.value = ''
    instructions.value = ''
    dueDate.value = null
    timeLimit.value = 60
    shuffleQuestions.value = true
    showResults.value = false
    bankConfigs.value = []
    isLoading.value = false
  }

  return {
	title,
	instructions,
	dueDate,
	timeLimit,
	shuffleQuestions,
	showResults,
	bankConfigs,
	isLoading,
	totalQuestions,
	totalPoints,
	initBuilder,
	resetBuilder
  }
})
