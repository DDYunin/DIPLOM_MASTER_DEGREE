// import { defineStore } from 'pinia'
// import { ref, computed } from 'vue'
// import type { QuestionBank } from './types'
// import * as bankApi from '../api'

// export const useQuestionBankStore = defineStore('question-bank', () => {
//   const banks = ref<QuestionBank[]>([])
//   const isLoading = ref(false)
//   const selectedBankId = ref<string | null>(null)

//   const selectedBank = computed(
//     () => banks.value.find((b) => b.id === selectedBankId.value) || null
//   )
//   const totalBanks = computed(() => banks.value.length)

//   const loadBanks = async () => {
//     isLoading.value = true
//     try {
//       const data = await bankApi.fetchBanks()
//       if (data) {
//         banks.value = data
//       }
//     } finally {
//       isLoading.value = false
//     }
//   }

//   const selectBank = (id: string) => {
//     selectedBankId.value = id
//   }
//   const clearSelection = () => {
//     selectedBankId.value = null
//   }

//   const createBank = async (data: { title: string; description: string }) => {
//     const newBank = await bankApi.createBank(data)
//     if (newBank) {
//       banks.value.unshift(newBank)
//       selectBank(newBank.id) // Сразу выбираем созданный банк
//     }
//   }

//   const addOrUpdateQuestion = async (bankId: string, questionData: any) => {
//     // API вернет обновленный банк
//     const updatedBank = await bankApi.saveQuestion(bankId, questionData)
//     if (updatedBank) {
//       const index = banks.value.findIndex((b) => b.id === bankId)
//       if (index !== -1) {
//         banks.value[index] = updatedBank
//       }
//     }
//   }

//   return {
//     banks,
//     isLoading,
//     selectedBankId,
//     selectedBank,
//     totalBanks,
//     loadBanks,
//     selectBank,
//     clearSelection,
//     createBank,
//     addOrUpdateQuestion
//   }
// })

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { QuestionBank } from './types'

export const useQuestionBankEntityStore = defineStore('entity-question-bank', () => {
  // === БАЗА ДАННЫХ (Single Source of Truth) ===
  // Ключ - ID банка, Значение - сам объект банка
  const banksMap = ref<Record<string, QuestionBank>>({})

  // === ГЕТТЕРЫ ===
  // Безопасное получение банка по ID (если он есть в кэше)
  const getBankById = computed(() => {
    return (id: string): QuestionBank | undefined => banksMap.value[id]
  })

  // === МУТАЦИИ (Действия с кэшем) ===

  // Универсальный метод добавления/обновления (Upsert)
  // Принимает массив Partial<QuestionBank>, чтобы можно было обновлять данные частями
  const upsertBanks = (incomingBanks: Partial<QuestionBank>[]) => {
    incomingBanks.forEach((bank) => {
      if (!bank.id) {
        return
      }

      if (banksMap.value[bank.id]) {
        // Если банк уже есть — делаем глубокое слияние (сохраняем старые поля, обновляем новые)
        banksMap.value[bank.id] = {
          ...banksMap.value[bank.id],
          ...bank
        } as QuestionBank
      } else {
        // Если банка нет — просто добавляем
        banksMap.value[bank.id] = bank as QuestionBank
      }
    })
  }

  // Метод для удаления банка из кэша
  const removeBankFromCache = (id: string) => {
    delete banksMap.value[id]
  }

  // Метод полной очистки кэша (полезно при логауте)
  const clearCache = () => {
    banksMap.value = {}
  }

  return {
    banksMap,
    getBankById,
    upsertBanks,
    removeBankFromCache,
    clearCache
  }
})
