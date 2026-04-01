import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { QuestionBank } from './types'
import * as bankApi from '../api'

export const useQuestionBankStore = defineStore('question-bank', () => {
  const banks = ref<QuestionBank[]>([])
  const isLoading = ref(false)
  const selectedBankId = ref<string | null>(null)

  const selectedBank = computed(
    () => banks.value.find((b) => b.id === selectedBankId.value) || null
  )
  const totalBanks = computed(() => banks.value.length)

  const loadBanks = async () => {
    isLoading.value = true
    try {
      const data = await bankApi.fetchBanks()
      if (data) {
        banks.value = data
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

  const createBank = async (data: { title: string; description: string }) => {
    const newBank = await bankApi.createBank(data)
    if (newBank) {
      banks.value.unshift(newBank)
      selectBank(newBank.id) // Сразу выбираем созданный банк
    }
  }

  const addOrUpdateQuestion = async (bankId: string, questionData: any) => {
    // API вернет обновленный банк
    const updatedBank = await bankApi.saveQuestion(bankId, questionData)
    if (updatedBank) {
      const index = banks.value.findIndex((b) => b.id === bankId)
      if (index !== -1) {
        banks.value[index] = updatedBank
      }
    }
  }

  return {
    banks,
    isLoading,
    selectedBankId,
    selectedBank,
    totalBanks,
    loadBanks,
    selectBank,
    clearSelection,
    createBank,
    addOrUpdateQuestion
  }
})
