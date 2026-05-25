<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'

import { BankQuestionsTable } from '@/widgets/bank-questions-table'
import { QuestionEditorModal } from '@/features/question-editor'
import { useQuestionBankEntityStore, questionBankApi } from '@/entities/question-bank'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const entityStore = useQuestionBankEntityStore()

const bankId = computed(() => route.params.bankId as string)

const currentBank = computed(() => entityStore.getBankById(bankId.value))

onMounted(async () => {
  // Если зашли по прямой ссылке, грузим банки
  if (!currentBank.value) {
    const data = await questionBankApi.fetchBanks()
    entityStore.upsertBanks(data) // Сохраняем в кэш
  }
})

const isEditorVisible = ref(false)
const selectedQuestion = ref<any>(null)

const openCreateModal = () => {
  selectedQuestion.value = null // Новый вопрос
  isEditorVisible.value = true
}

const openEditModal = (question: any) => {
  selectedQuestion.value = question // Редактирование
  isEditorVisible.value = true
}

const handleSaveQuestion = async (questionData: any) => {
  // 1. Отправляем изменения на бэкенд
  const updatedBank = await questionBankApi.saveQuestion(bankId.value, questionData)

  if (updatedBank) {
    // 2. Кладем обновленный банк в глобальный кэш!
    // Computed-свойство currentBank мгновенно обновит таблицу!
    entityStore.upsertBanks([updatedBank])
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
      <span class="crumb active" v-if="currentBank">{{ currentBank.title }}</span>
    </nav>

    <header class="page-header" v-if="currentBank">
      <div class="header-info">
        <h1 class="page-title">Manage Questions: {{ currentBank.title }}</h1>
        <p class="page-subtitle">
          {{ currentBank.description }} You have {{ currentBank.questionsCount }} active questions.
        </p>
      </div>
      <div class="header-actions">
        <Button :label="t('teacherQuestionBanks.addQuestion')" icon="pi pi-plus" @click="openCreateModal" />
      </div>
    </header>

    <!-- Выводим таблицу, если банк загрузился -->
    <div class="page-content" v-if="currentBank">
      <!-- Ловим событие 'edit' из таблицы -->
      <BankQuestionsTable :questions="currentBank.questions" @edit="openEditModal" />
    </div>

    <!-- Модалка редактора -->
    <QuestionEditorModal
      v-model:visible="isEditorVisible"
      :bankName="currentBank?.title"
      :initialData="selectedQuestion"
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

/* --- BREADCRUMBS --- */
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

/* --- HEADER --- */
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
