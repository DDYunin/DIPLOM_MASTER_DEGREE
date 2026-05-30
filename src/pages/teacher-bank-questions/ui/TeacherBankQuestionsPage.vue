<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'

import { BankQuestionsTable } from '@/widgets/bank-questions-table'
import { QuestionEditorModal } from '@/features/question-editor'
import {
  useQuestionBankEntityStore,
  questionBankApi,
  mapBanksToQuestionBanks,
  mapBankQuestionToQuestion,
  buildCreateQuestionPayload,
  buildUpdateQuestionPayload,
  type Question,
  type QuestionFormValues
} from '@/entities/question-bank'
import { getCurrentUserIdAsNumber } from '@/shared/lib/jwt'
import { useNotifications } from '@/shared/model'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const entityStore = useQuestionBankEntityStore()
const notifications = useNotifications()

const bankId = computed(() => route.params.bankId as string)
const currentBank = computed(() => entityStore.getBankById(bankId.value))

const isLoading = ref(false)
const isSaving = ref(false)
const isEditorVisible = ref(false)
const selectedQuestion = ref<Question | null>(null)

const loadBankData = async () => {
  isLoading.value = true

  try {
    const userId = getCurrentUserIdAsNumber()
    if (!userId) {
      return
    }

    if (!currentBank.value) {
      const banks = await questionBankApi.fetchBanks(userId)
      entityStore.upsertBanks(mapBanksToQuestionBanks(banks))
    }

    const response = await questionBankApi.fetchBankQuestions({
      bankId: bankId.value,
      limit: 100,
      offset: 0
    })

    const questions = response.data.map((question, index) =>
      mapBankQuestionToQuestion(question, index + 1)
    )

    entityStore.upsertBanks([
      {
        id: bankId.value,
        questions,
        questionsCount: response.meta.total
      }
    ])
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  try {
    await loadBankData()
  } catch {
    // Toast об ошибке показывает API-клиент
  }
})

const openCreateModal = () => {
  selectedQuestion.value = null
  isEditorVisible.value = true
}

const openEditModal = (question: Question) => {
  selectedQuestion.value = question
  isEditorVisible.value = true
}

const handleSaveQuestion = async (values: QuestionFormValues) => {
  isSaving.value = true

  try {
    if (values.id) {
      await questionBankApi.updateBankQuestion(
        values.id,
        buildUpdateQuestionPayload(bankId.value, values)
      )
      notifications.showToast('success', t('common.save'), t('bankQuestions.questionUpdated'))
    } else {
      await questionBankApi.createBankQuestion(
        buildCreateQuestionPayload(bankId.value, values)
      )
      notifications.showToast('success', t('common.save'), t('bankQuestions.questionCreated'))
    }

    await loadBankData()
  } finally {
    isSaving.value = false
  }
}

const handleDeleteQuestion = async (questionId: string) => {
  isSaving.value = true

  try {
    await questionBankApi.deleteBankQuestion(questionId)
    notifications.showToast('success', t('common.delete'), t('bankQuestions.questionDeleted'))
    await loadBankData()
  } finally {
    isSaving.value = false
  }
}

const handleDeleteMany = async (questionIds: string[]) => {
  isSaving.value = true

  try {
    await Promise.all(questionIds.map((id) => questionBankApi.deleteBankQuestion(id)))
    notifications.showToast('success', t('common.delete'), t('bankQuestions.questionsDeleted'))
    await loadBankData()
  } finally {
    isSaving.value = false
  }
}

const goBack = () => {
  router.push({ name: 'teacher-question-banks' })
}
</script>

<template>
  <div class="bank-questions-page">
    <nav class="breadcrumbs">
      <a href="#" class="crumb" @click.prevent="goBack">{{ t('teacherQuestionBanks.banksBreadcrumb') }}</a>
      <span class="separator">/</span>
      <span v-if="currentBank" class="crumb active">{{ currentBank.title }}</span>
    </nav>

    <header v-if="currentBank" class="page-header">
      <div class="header-info">
        <h1 class="page-title">
          {{ t('teacherQuestionBanks.manageQuestions', { name: currentBank.title }) }}
        </h1>
        <p class="page-subtitle">
          {{ currentBank.description }}
          {{ t('bankQuestions.totalCount', { count: currentBank.questionsCount }) }}
        </p>
      </div>
      <div class="header-actions">
        <Button
          :label="t('teacherQuestionBanks.addQuestion')"
          icon="pi pi-plus"
          :loading="isSaving"
          @click="openCreateModal"
        />
      </div>
    </header>

    <div v-if="isLoading" class="page-content">
      <Skeleton width="100%" height="400px" borderRadius="12px" />
    </div>

    <div v-else-if="currentBank" class="page-content">
      <BankQuestionsTable
        :questions="currentBank.questions"
        @edit="openEditModal"
        @delete="handleDeleteQuestion"
        @delete-many="handleDeleteMany"
      />
    </div>

    <QuestionEditorModal
      v-model:visible="isEditorVisible"
      :bank-name="currentBank?.title"
      :initial-data="selectedQuestion"
      @save="handleSaveQuestion"
    />
  </div>
</template>

<style scoped>
.bank-questions-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.crumb {
  color: var(--text-color-muted);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.crumb:hover {
  color: var(--color-primary);
}

.crumb.active {
  color: var(--text-color);
  font-weight: 600;
  pointer-events: none;
}

.separator {
  color: var(--icon-muted);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.header-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.page-title {
  margin: 0;
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--text-color);
  letter-spacing: -0.5px;
}

.page-subtitle {
  margin: 0;
  font-size: 1rem;
  color: var(--text-color-muted);
}
</style>
