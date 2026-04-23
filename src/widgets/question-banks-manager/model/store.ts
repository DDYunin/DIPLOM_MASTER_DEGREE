import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  useQuestionBankEntityStore,
  questionBankApi,
  type QuestionBank
} from '@/entities/question-bank'

export const useQuestionBanksManagerStore = defineStore('widget-question-banks-manager', () => {
  const entityStore = useQuestionBankEntityStore()

  // === UI-СОСТОЯНИЕ ВИДЖЕТА ===
  const bankIds = ref<string[]>([]) // Храним ТОЛЬКО идентификаторы!
  const selectedBankId = ref<string | null>(null)
  const isLoading = ref(false)

  // === ВЫЧИСЛЯЕМЫЕ ДАННЫЕ ДЛЯ РЕНДЕРА ===
  // Собираем полноценные объекты банков из глобального кэша по нашим ID
  const banksList = computed(() => {
    return bankIds.value.map((id) => entityStore.getBankById(id)).filter(Boolean) as QuestionBank[] // Отсекаем возможные undefined
  })

  const selectedBank = computed(() => {
    if (!selectedBankId.value) {
      return null
    }
    return entityStore.getBankById(selectedBankId.value) || null
  })

  const totalBanks = computed(() => bankIds.value.length)

  // === ЭКШЕНЫ (Бизнес-логика виджета) ===

  const loadBanks = async () => {
    isLoading.value = true
    try {
      const data = await questionBankApi.fetchBanks()
      if (data) {
        // 1. Сохраняем "мясо" (объекты) в глобальную базу (SSOT)
        entityStore.upsertBanks(data)

        // 2. Сохраняем "скелет" (идентификаторы) для нашего списка
        bankIds.value = data.map((b: any) => b.id)
      }
    } finally {
      isLoading.value = false
    }
  }

  const selectBank = (id: string) => {
    selectedBankId.value = id
  }

  const clearSelection = () => {
    selectedBankId.value = null
  }

  // Метод создания банка переехал сюда, так как он обновляет НАШ локальный список
  const createNewBank = async (data: { title: string; description: string }) => {
    const newBank = await questionBankApi.createBank(data)
    if (newBank) {
      entityStore.upsertBanks([newBank]) // Кладем в глобальный кэш
      bankIds.value.unshift(newBank.id) // Добавляем ID в начало нашего списка
      selectBank(newBank.id) // Сразу делаем его активным
    }
  }

  return {
    bankIds,
    selectedBankId,
    isLoading,
    banksList,
    selectedBank,
    totalBanks,
    loadBanks,
    selectBank,
    clearSelection,
    createNewBank
  }
})
