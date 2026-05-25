<script setup lang="ts">
import { useRouter } from 'vue-router'
import { type QuestionType, type Difficulty } from '@/entities/question-bank'
import { useQuestionBanksManagerStore } from '../model/store'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

const widgetStore = useQuestionBanksManagerStore()
const router = useRouter()

const emit = defineEmits<{
  (e: 'create-bank'): void
}>()

// Хелперы для стилизации бейджей
const getTypeStyles = (type: QuestionType) => {
  switch (type) {
    case 'multiple-choice':
      return { bg: 'var(--color-accent-purple-muted)', color: 'var(--color-accent-purple-text)', label: 'MULTIPLE CHOICE' }
    case 'true-false':
      return { bg: 'var(--color-primary-muted)', color: 'var(--color-primary-text-on-subtle)', label: 'TRUE / FALSE' }
    case 'short-answer':
      return { bg: 'var(--color-warning-muted)', color: 'var(--color-warning-text)', label: 'SHORT ANSWER' }
    case 'essay':
      return { bg: 'var(--color-warning-muted)', color: 'var(--color-warning-text)', label: 'ESSAY' }
  }
}

const getDifficultyStyles = (diff: Difficulty) => {
  switch (diff) {
    case 'easy':
      return { bg: 'var(--color-success-muted)', color: 'var(--color-success-text)', label: 'EASY' }
    case 'medium':
      return { bg: 'var(--color-caution-muted)', color: 'var(--color-caution-text)', label: 'MEDIUM' }
    case 'hard':
      return { bg: 'var(--color-danger-muted)', color: 'var(--color-danger-text)', label: 'HARD' }
  }
}

const goToAllQuestions = () => {
  if (widgetStore.selectedBankId) {
    router.push({
      name: 'teacher-bank-questions',
      params: { bankId: widgetStore.selectedBankId }
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
        <span class="total-badge">{{ widgetStore.totalBanks }} Total</span>
      </div>

      <div class="banks-list">
        <div
          v-for="bank in widgetStore.banksList"
          :key="bank.id"
          class="bank-item"
          :class="{ 'bank-item--active': widgetStore.selectedBankId === bank.id }"
          @click="widgetStore.selectBank(bank.id)"
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
      <div v-if="!widgetStore.selectedBank" class="empty-state">
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
            <InputText v-model="widgetStore.selectedBank.title" class="w-full filled-input" />
          </div>

          <div class="form-group">
            <label class="form-label">Description</label>
            <InputText v-model="widgetStore.selectedBank.description" class="w-full filled-input" />
          </div>
        </section>

        <!-- Секция: Список вопросов -->
        <section class="questions-section">
          <div class="section-header">
            <h3 class="questions-title">
              Questions in this Bank ({{ widgetStore.selectedBank.questionsCount }})
            </h3>
            <div class="header-actions text-sm">
              <a href="#" class="action-link">Expand All</a>
              <span class="divider">|</span>
              <a href="#" class="action-link">Collapse All</a>
            </div>
          </div>

          <div class="questions-list">
            <div
              v-for="(question, index) in widgetStore.selectedBank.questions"
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
  background-color: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
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
  border-bottom: 1px solid var(--surface-subtle);
}

.sidebar-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-color);
}

.total-badge {
  background-color: var(--surface-subtle);
  color: var(--text-color-muted);
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
  border-bottom: 1px solid var(--surface-subtle);
  cursor: pointer;
  transition: background-color 0.2s;
}

.bank-item:hover {
  background-color: var(--surface-ground);
}

/* Активное состояние банка */
.bank-item--active {
  background-color: var(--color-primary-subtle);
  border-left: 3px solid var(--color-primary);
}

.bank-title {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-color);
}

.bank-item--active .bank-title {
  color: var(--color-primary-strong);
}

.bank-desc {
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  color: var(--text-color-muted);
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
  background-color: var(--surface-subtle);
  color: var(--text-color-muted);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-md);
}

.meta-date {
  font-size: 0.75rem;
  color: var(--text-color-muted);
  font-weight: 500;
}

/* --- ПРАВАЯ ПАНЕЛЬ (КОНТЕНТ) --- */
.banks-content {
  flex-grow: 1;
  background-color: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
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
  background-color: var(--surface-subtle);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.empty-icon {
  font-size: 2.5rem;
  color: var(--color-primary);
}

.empty-title {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
}

.empty-desc {
  margin: 0 0 2rem 0;
  font-size: 1rem;
  color: var(--text-color-muted);
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
  color: var(--text-color);
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
  color: var(--text-color);
}

.w-full {
  width: 100%;
}

.filled-input {
  background-color: var(--surface-ground);
  border-color: transparent;
  font-weight: 500;
}
.filled-input:focus {
  background-color: var(--surface-card);
  border-color: var(--color-primary-focus);
}

/* Список вопросов */
.questions-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-color);
}

.text-sm {
  font-size: 0.875rem;
}

.action-link {
  color: var(--text-color-muted);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.action-link:hover {
  color: var(--color-primary);
}

.divider {
  color: var(--surface-border-strong);
  margin: 0 0.5rem;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.question-card {
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  display: flex;
  background-color: var(--surface-card);
  transition: border-color 0.2s;
}

.question-card:hover {
  border-color: var(--color-primary-border);
}

.question-left {
  padding: 1.5rem 1rem;
  display: flex;
  align-items: flex-start;
  color: var(--text-color-muted);
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
  border-radius: var(--radius-md);
  letter-spacing: 0.5px;
}

.question-text {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-color);
}

.question-answer {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-color-muted);
}

.answer-label {
  color: var(--text-color-muted);
}

.text-green {
  color: var(--color-success-strong);
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
