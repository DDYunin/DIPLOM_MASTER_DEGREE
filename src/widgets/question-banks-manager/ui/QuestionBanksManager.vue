<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useQuestionBankStore, type QuestionType, type Difficulty } from '@/entities/question-bank'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

const bankStore = useQuestionBankStore()
const router = useRouter()

const emit = defineEmits<{
  (e: 'create-bank'): void
}>()

// Хелперы для стилизации бейджей
const getTypeStyles = (type: QuestionType) => {
  switch (type) {
    case 'multiple-choice':
      return { bg: 'var(--p-purple-100)', color: 'var(--p-purple-700)', label: 'MULTIPLE CHOICE' }
    case 'true-false':
      return { bg: 'var(--p-blue-100)', color: 'var(--p-blue-700)', label: 'TRUE / FALSE' }
    case 'short-answer':
      return { bg: 'var(--p-orange-100)', color: 'var(--p-orange-700)', label: 'SHORT ANSWER' }
  }
}

const getDifficultyStyles = (diff: Difficulty) => {
  switch (diff) {
    case 'easy':
      return { bg: 'var(--p-green-100)', color: 'var(--p-green-700)', label: 'EASY' }
    case 'medium':
      return { bg: 'var(--p-yellow-100)', color: 'var(--p-yellow-700)', label: 'MEDIUM' }
    case 'hard':
      return { bg: 'var(--p-red-100)', color: 'var(--p-red-700)', label: 'HARD' }
  }
}

const goToAllQuestions = () => {
  if (bankStore.selectedBankId) {
    router.push({ 
      name: 'teacher-bank-questions', 
      params: { bankId: bankStore.selectedBankId } 
    })
  }
}
</script>

<!-- TODO: идеи рефакторинга -->
<!-- 1. Вынести Layout в отдельный файл -->
<!-- 2. Вынести карточку банка вопроса и вопроса в отдельный файл -->

<template>
  <div class="banks-manager-layout">
    <!-- ЛЕВАЯ ПАНЕЛЬ: Список банков -->
    <aside class="banks-sidebar">
      <div class="sidebar-header">
        <h3 class="sidebar-title">All Banks</h3>
        <span class="total-badge">{{ bankStore.totalBanks }} Total</span>
      </div>

      <div class="banks-list">
        <div
          v-for="bank in bankStore.banks"
          :key="bank.id"
          class="bank-item"
          :class="{ 'bank-item--active': bankStore.selectedBankId === bank.id }"
          @click="bankStore.selectBank(bank.id)"
        >
          <h4 class="bank-title">{{ bank.title }}</h4>
          <p class="bank-desc">{{ bank.description }}</p>
          <div class="bank-meta">
            <span class="meta-tag"
              ><i class="pi pi-question-circle"></i> {{ bank.questionsCount }} Qs</span
            >
            <span class="meta-date">{{ bank.lastUpdated }}</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- ПРАВАЯ ПАНЕЛЬ: Рабочая область -->
    <main class="banks-content">
      <!-- EMPTY STATE (Ничего не выбрано) -->
      <div v-if="!bankStore.selectedBank" class="empty-state">
        <div class="empty-icon-wrapper">
          <i class="pi pi-copy empty-icon"></i>
        </div>
        <h2 class="empty-title">No Question Bank Selected</h2>
        <p class="empty-desc">
          Select a bank from the list on the left to view its details<br />
          and manage questions, or create a new one to start<br />
          building your assessment.
        </p>
        <Button label="Create New Bank" icon="pi pi-plus" @click="emit('create-bank')" />
      </div>

      <!-- SELECTED STATE (Редактор банка) -->
      <div v-else class="bank-editor">
        <!-- Секция: Детали банка -->
        <section class="editor-section">
          <div class="section-header">
            <h2 class="section-title">Edit Bank Details</h2>
            <div class="header-actions">
              <Button
                icon="pi pi-trash"
                text
                rounded
                severity="secondary"
                aria-label="Delete Bank"
              />
              <Button label="Save Changes" icon="pi pi-save" text />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Bank Title</label>
            <!-- Спец. класс filled-input для имитации серого фона как на макете -->
            <InputText v-model="bankStore.selectedBank.title" class="w-full filled-input" />
          </div>

          <div class="form-group">
            <label class="form-label">Description</label>
            <InputText v-model="bankStore.selectedBank.description" class="w-full filled-input" />
          </div>
        </section>

        <!-- Секция: Список вопросов -->
        <section class="questions-section">
          <div class="section-header">
            <h3 class="questions-title">
              Questions in this Bank ({{ bankStore.selectedBank.questionsCount }})
            </h3>
            <div class="header-actions text-sm">
              <a href="#" class="action-link">Expand All</a>
              <span class="divider">|</span>
              <a href="#" class="action-link">Collapse All</a>
            </div>
          </div>

          <div class="questions-list">
            <div
              v-for="(question, index) in bankStore.selectedBank.questions"
              :key="question.id"
              class="question-card"
            >
              <!-- Левая часть с номером и drag handle -->
              <div class="question-left">
                <i class="pi pi-ellipsis-v drag-handle"></i>
                <i class="pi pi-ellipsis-v drag-handle drag-handle-second"></i>
                <span class="question-number">{{ String(index + 1).padStart(2, '0') }}</span>
              </div>

              <!-- Правая часть с контентом -->
              <div class="question-content">
                <div class="question-badges">
                  <span
                    class="custom-badge"
                    :style="{
                      backgroundColor: getTypeStyles(question.type).bg,
                      color: getTypeStyles(question.type).color
                    }"
                  >
                    {{ getTypeStyles(question.type).label }}
                  </span>
                  <span
                    class="custom-badge"
                    :style="{
                      backgroundColor: getDifficultyStyles(question.difficulty).bg,
                      color: getDifficultyStyles(question.difficulty).color
                    }"
                  >
                    {{ getDifficultyStyles(question.difficulty).label }}
                  </span>
                </div>

                <h4 class="question-text">{{ question.text }}</h4>
                <p
                  class="question-answer"
                  :class="{ 'text-green': question.type !== 'short-answer' }"
                >
                  <span class="answer-label">{{ question.answerText.split(':')[0] }}:</span>
                  {{ question.answerText.split(':')[1] }}
                </p>
              </div>
            </div>
          </div>

          <div class="load-more">
            <Button label="Show all questions" text @click="goToAllQuestions" />
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
.banks-manager-layout {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  height: 100%;
}

/* --- ЛЕВАЯ ПАНЕЛЬ (САЙДБАР) --- */
.banks-sidebar {
  width: 320px;
  background-color: var(--p-surface-0);
  border: 1px solid var(--p-surface-200);
  border-radius: var(--p-border-radius);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
}

.sidebar-header {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--p-surface-100);
}

.sidebar-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--p-text-color);
}

.total-badge {
  background-color: var(--p-surface-100);
  color: var(--p-text-muted-color);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
}

.banks-list {
  display: flex;
  flex-direction: column;
  max-height: 700px;
  overflow-y: auto;
}

.bank-item {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--p-surface-100);
  cursor: pointer;
  transition: background-color 0.2s;
}

.bank-item:hover {
  background-color: var(--p-surface-50);
}

/* Активное состояние банка */
.bank-item--active {
  background-color: var(--p-primary-50);
  border-left: 3px solid var(--p-primary-500);
}

.bank-title {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--p-text-color);
}

.bank-item--active .bank-title {
  color: var(--p-primary-600);
}

.bank-desc {
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  color: var(--p-text-muted-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bank-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.meta-tag {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: var(--p-surface-100);
  color: var(--p-text-muted-color);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: var(--p-border-radius);
}

.meta-date {
  font-size: 0.75rem;
  color: var(--p-text-muted-color);
  font-weight: 500;
}

/* --- ПРАВАЯ ПАНЕЛЬ (КОНТЕНТ) --- */
.banks-content {
  flex-grow: 1;
  background-color: var(--p-surface-0);
  border: 1px solid var(--p-surface-200);
  border-radius: var(--p-border-radius);
  min-height: 600px;
  display: flex;
  flex-direction: column;
}

/* Пустое состояние */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  text-align: center;
  padding: 3rem;
}

.empty-icon-wrapper {
  width: 80px;
  height: 80px;
  background-color: var(--p-surface-100);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.empty-icon {
  font-size: 2.5rem;
  color: var(--p-primary-500);
}

.empty-title {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--p-text-color);
}

.empty-desc {
  margin: 0 0 2rem 0;
  font-size: 1rem;
  color: var(--p-text-muted-color);
  line-height: 1.5;
}

/* Редактор банка */
.bank-editor {
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--p-text-color);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--p-text-color);
}

.w-full {
  width: 100%;
}

.filled-input {
  background-color: var(--p-surface-50);
  border-color: transparent;
  font-weight: 500;
}
.filled-input:focus {
  background-color: var(--p-surface-0);
  border-color: var(--p-primary-400);
}

/* Список вопросов */
.questions-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--p-text-color);
}

.text-sm {
  font-size: 0.875rem;
}

.action-link {
  color: var(--p-text-muted-color);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.action-link:hover {
  color: var(--p-primary-500);
}

.divider {
  color: var(--p-surface-300);
  margin: 0 0.5rem;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.question-card {
  border: 1px solid var(--p-surface-200);
  border-radius: var(--p-border-radius);
  display: flex;
  background-color: var(--p-surface-0);
  transition: border-color 0.2s;
}

.question-card:hover {
  border-color: var(--p-primary-300);
}

.question-left {
  padding: 1.5rem 1rem;
  display: flex;
  align-items: flex-start;
  color: var(--p-text-muted-color);
}

.drag-handle {
  font-size: 1rem;
  cursor: grab;
}

.drag-handle-second {
  margin-left: -8px;
  margin-right: 0.5rem;
}

.question-number {
  font-weight: 600;
  font-size: 0.875rem;
}

.question-content {
  padding: 1.5rem 1.5rem 1.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex-grow: 1;
}

.question-badges {
  display: flex;
  gap: 0.5rem;
}

.custom-badge {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: var(--p-border-radius);
  letter-spacing: 0.5px;
}

.question-text {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--p-text-color);
}

.question-answer {
  margin: 0;
  font-size: 0.875rem;
  color: var(--p-text-muted-color);
}

.answer-label {
  color: var(--p-text-muted-color);
}

.text-green {
  color: var(--p-green-600);
  font-weight: 500;
}

.load-more {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

@media (max-width: 1024px) {
  .banks-manager-layout {
    flex-direction: column;
  }
  .banks-sidebar {
    width: 100%;
    max-height: 350px;
  }
}
</style>
