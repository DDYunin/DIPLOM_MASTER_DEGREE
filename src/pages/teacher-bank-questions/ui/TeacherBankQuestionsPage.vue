<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'
import { BankQuestionsTable } from '@/widgets/bank-questions-table'
import { QuestionEditorModal } from '@/features/question-editor'
import { type Question, useQuestionBankStore } from '@/entities/question-bank'

const route = useRoute()
const router = useRouter()
const bankStore = useQuestionBankStore()

const bankId = computed(() => route.params.bankId as string)

const currentBank = computed(() => bankStore.selectedBank)

// Мок-данные строго по макету
const mockQuestions: (Question & { hasImage?: boolean })[] = [
  {
    id: '1',
    type: 'multiple-choice',
    difficulty: 'easy',
    text: 'Solve for <code class="math-inline">x</code> in the equation: <code class="math-inline">2x + 4 = 12</code>. Select the correct integer value from the options below.',
    answerText: '',
    order: 1
  },
  {
    id: '2',
    type: 'essay',
    difficulty: 'hard',
    text: 'Explain the fundamental difference between linear and exponential growth patterns in real-world scenarios.',
    answerText: '',
    order: 2
  },
  {
    id: '3',
    type: 'true-false',
    difficulty: 'medium',
    text: 'True or False: The slope of a vertical line is zero.',
    answerText: '',
    order: 3
  },
  {
    id: '4',
    type: 'multiple-choice',
    difficulty: 'easy',
    text: 'Based on the graph shown in Figure A, identify the y-intercept.',
    answerText: '',
    order: 4,
    hasImage: true
  },
  {
    id: '5',
    type: 'short-answer',
    difficulty: 'medium',
    text: 'Simplify the following algebraic expression: 3(x + 2) - 4x.',
    answerText: '',
    order: 5
  }
]

const goBack = () => {
  router.push({ name: 'teacher-question-banks' })
}

// onMounted(async () => {
//   // Если зашли по прямой ссылке, грузим банки
//   if (bankStore.banks.length === 0) {
//     await bankStore.loadBanks()
//   }
//   bankStore.selectBank(bankId.value)
// })

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

const handleSaveQuestion = (questionData: any) => {
  console.log('Saved question:', questionData)
  // await bankStore.addOrUpdateQuestion(bankId.value, questionData)
  // В реальности мы бы отправили данные в стор или на бэкенд
  // mockQuestions.unshift(newQuestion)
}
</script>

<template>
  <div class="bank-questions-page">
    <!-- Хлебные крошки (Breadcrumbs) -->
    <nav class="breadcrumbs">
      <a href="#" class="crumb" @click.prevent="goBack">Question Banks</a>
      <span class="separator">/</span>
      <span class="crumb active" v-if="currentBank">{{ currentBank.title }}</span>
    </nav>

    <!-- Шапка страницы -->
    <header class="page-header" v-if="currentBank">
      <div class="header-info">
        <h1 class="page-title">Manage Questions: {{ currentBank.title }}</h1>
        <p class="page-subtitle">
          {{ currentBank.description }} You have {{ currentBank.questionsCount }} active questions.
        </p>
      </div>

      <div class="header-actions">
        <Button label="Add New Question" icon="pi pi-plus" @click="openCreateModal" />
      </div>
    </header>

    <!-- Виджет Таблицы -->
    <div class="page-content" v-if="currentBank">
      <BankQuestionsTable :questions="mockQuestions" @edit="openEditModal" />
    </div>

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
  color: var(--p-text-muted-color);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.crumb:hover {
  color: var(--p-primary-500);
}

.crumb.active {
  color: var(--p-text-color);
  font-weight: 600;
  pointer-events: none;
}

.separator {
  color: var(--p-surface-400);
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
  color: var(--p-text-color);
  letter-spacing: -0.5px;
}

.page-subtitle {
  margin: 0;
  font-size: 1rem;
  color: var(--p-text-muted-color);
}
</style>
