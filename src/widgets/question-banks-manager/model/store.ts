import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import {
  mapBankQuestionToQuestion,
  mapBankToQuestionBank,
  mapBanksToQuestionBanks,
  questionBankApi,
  useQuestionBankEntityStore,
  type Question,
  type QuestionBank
} from '@/entities/question-bank'
import { getCurrentUserIdAsNumber } from '@/shared/lib/jwt'

const PREVIEW_QUESTIONS_LIMIT = 5

export const useQuestionBanksManagerStore = defineStore('widget-question-banks-manager', () => {
  const entityStore = useQuestionBankEntityStore()

  const bankIds = ref<string[]>([])
  const selectedBankId = ref<string | null>(null)
  const previewQuestions = ref<Question[]>([])
  const isLoading = ref(false)
  const isQuestionsLoading = ref(false)
  const isSaving = ref(false)
  const loadError = ref<string | null>(null)

  const banksList = computed(() => {
    return bankIds.value
      .map((id) => entityStore.getBankById(id))
      .filter(Boolean) as QuestionBank[]
  })

  const selectedBank = computed(() => {
    if (!selectedBankId.value) {
      return null
    }

    const bank = entityStore.getBankById(selectedBankId.value)
    if (!bank) {
      return null
    }

    return {
      ...bank,
      questions: previewQuestions.value
    }
  })

  const totalBanks = computed(() => bankIds.value.length)

  const resolveUserId = (): number => {
    const userId = getCurrentUserIdAsNumber()
    if (userId === null) {
      throw new Error('Unable to resolve current user id')
    }

    return userId
  }

  const loadPreviewQuestions = async (bankId: string) => {
    isQuestionsLoading.value = true

    try {
      const response = await questionBankApi.fetchBankQuestions({
        bankId,
        limit: PREVIEW_QUESTIONS_LIMIT,
        offset: 0
      })

      previewQuestions.value = response.data.map((question, index) =>
        mapBankQuestionToQuestion(question, index + 1)
      )
    } finally {
      isQuestionsLoading.value = false
    }
  }

  const loadBanks = async (locale = 'en') => {
    isLoading.value = true
    loadError.value = null

    try {
      const userId = resolveUserId()
      const data = await questionBankApi.fetchBanks(userId)
      const mappedBanks = mapBanksToQuestionBanks(data, locale)

      entityStore.upsertBanks(mappedBanks)
      bankIds.value = mappedBanks.map((bank) => bank.id)
    } catch (error) {
      loadError.value = error instanceof Error ? error.message : 'Failed to load question banks'
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const selectBank = async (id: string) => {
    selectedBankId.value = id
    previewQuestions.value = []
    await loadPreviewQuestions(id)
  }

  const clearSelection = () => {
    selectedBankId.value = null
    previewQuestions.value = []
  }

  const createNewBank = async (data: { title: string; description: string }, locale = 'en') => {
    isSaving.value = true

    try {
      const userId = resolveUserId()
      const createdBank = await questionBankApi.createBank({
        title: data.title,
        description: data.description,
        userId
      })

      const mappedBank = mapBankToQuestionBank(createdBank, [], locale)

      entityStore.upsertBanks([mappedBank])
      bankIds.value.unshift(mappedBank.id)
      await selectBank(mappedBank.id)

      return mappedBank
    } finally {
      isSaving.value = false
    }
  }

  const updateSelectedBank = async (
    data: { title: string; description: string },
    locale = 'en'
  ) => {
    if (!selectedBankId.value) {
      return
    }

    isSaving.value = true

    try {
      const userId = resolveUserId()
      const updatedBank = await questionBankApi.updateBank(selectedBankId.value, {
        title: data.title,
        description: data.description,
        userId
      })

      const mappedBank = mapBankToQuestionBank(updatedBank, previewQuestions.value, locale)
      entityStore.upsertBanks([mappedBank])
    } finally {
      isSaving.value = false
    }
  }

  const deleteSelectedBank = async () => {
    if (!selectedBankId.value) {
      return
    }

    const bankId = selectedBankId.value
    isSaving.value = true

    try {
      await questionBankApi.deleteBank(bankId)
      entityStore.removeBankFromCache(bankId)
      bankIds.value = bankIds.value.filter((id) => id !== bankId)
      clearSelection()
    } finally {
      isSaving.value = false
    }
  }

  return {
    bankIds,
    selectedBankId,
    isLoading,
    isQuestionsLoading,
    isSaving,
    loadError,
    banksList,
    selectedBank,
    totalBanks,
    loadBanks,
    selectBank,
    clearSelection,
    createNewBank,
    updateSelectedBank,
    deleteSelectedBank
  }
})
