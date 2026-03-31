<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'
import { BankQuestionsTable } from '@/widgets/bank-questions-table'
import { QuestionEditorModal } from '@/features/question-editor'
import type { Question } from '@/entities/question-bank'

const route = useRoute()
const router = useRouter()
// В реальности берем из стора: const bank = bankStore.getBankById(route.params.bankId)

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

const isEditorVisible = ref(false)

const handleSaveQuestion = (questionData: any) => {
  console.log('Saved question:', questionData)
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
      <span class="crumb active">Algebra Basics</span>
    </nav>

    <!-- Шапка страницы -->
    <header class="page-header">
      <div class="header-info">
        <h1 class="page-title">Manage Questions: Algebra Basics</h1>
        <p class="page-subtitle">
          Curate and edit the assessment items for this specific module. You have 142 active
          questions.
        </p>
      </div>

      <div class="header-actions">
        <Button label="Add New Question" icon="pi pi-plus" @click="isEditorVisible = true" />
      </div>
    </header>

    <!-- Виджет Таблицы -->
    <div class="page-content">
      <BankQuestionsTable :questions="mockQuestions" />
    </div>

    <QuestionEditorModal
      v-model:visible="isEditorVisible"
      bankName="Algebra 101 Question Bank"
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
