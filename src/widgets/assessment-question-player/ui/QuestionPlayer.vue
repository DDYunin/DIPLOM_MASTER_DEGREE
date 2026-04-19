<script setup lang="ts">
import { computed } from 'vue'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import RadioButton from 'primevue/radiobutton'
import Textarea from 'primevue/textarea'
import { useAssessmentSessionStore } from '@/entities/assessment-session'

const store = useAssessmentSessionStore()

const currentQ = computed(() => store.currentQuestion)
const currentIndex = computed(() => store.currentQuestionIndex)

// Локальное вычисляемое свойство для ответа (v-model)
const answerValue = computed({
  get: () => store.session?.answers[currentQ.value?.id || '']?.value || '',
  set: (val) => {
    if (currentQ.value) store.updateAnswer(currentQ.value.id, val)
  }
})

// Для макета 2 (эссе) - счетчики
const wordCount = computed(() => {
  const text = (answerValue.value as string) || ''
  return text.trim() ? text.trim().split(/\s+/).length : 0
})

const charCount = computed(() => {
  const text = (answerValue.value as string) || ''
  return text.length
})

// Навигация
const handleNext = () => {
  if (store.session && currentIndex.value < store.totalQuestions - 1) {
    store.goToQuestion(store.session.questions[currentIndex.value + 1].id)
  }
}

const handlePrev = () => {
  if (store.session && currentIndex.value > 0) {
    store.goToQuestion(store.session.questions[currentIndex.value - 1].id)
  }
}
</script>

<template>
  <div class="player-container" v-if="currentQ">
    <!-- Заголовок вопроса -->
    <div class="question-header">
      <div class="question-meta">
        <Tag
          :value="currentQ.type === 'single-choice' ? 'MULTIPLE CHOICE' : 'ESSAY QUESTION'"
          severity="info"
          rounded
        />
        <span v-if="currentQ.points" class="points-label"
          >Point Value: {{ currentQ.points }} pts</span
        >
      </div>
      <h2 class="question-text">{{ currentQ.text }}</h2>
    </div>

    <!-- Изображение (если есть) -->
    <img
      v-if="currentQ.imageUrl"
      :src="currentQ.imageUrl"
      alt="Question Graphic"
      class="question-image"
    />

    <!-- Рабочая область ответа -->
    <div class="answer-area">
      <!-- ТИП: Одиночный выбор (Радио кнопки) -->
      <div v-if="currentQ.type === 'single-choice'" class="options-list">
        <div
          v-for="opt in currentQ.options"
          :key="opt.id"
          :class="['option-card', { 'is-selected': answerValue === opt.id }]"
          @click="answerValue = opt.id"
        >
          <RadioButton :value="opt.id" v-model="answerValue" :inputId="opt.id" />
          <div class="option-content">
            <label :for="opt.id" class="option-text">{{ opt.text }}</label>
            <p v-if="opt.description" class="option-desc">{{ opt.description }}</p>
          </div>
        </div>
      </div>

      <!-- ТИП: Эссе (Длинный текст с "редактором") -->
      <div v-else-if="currentQ.type === 'long-text'" class="essay-editor">
        <div class="editor-toolbar">
          <div class="toolbar-group">
            <button class="tool-btn"><i class="pi pi-bold"></i></button>
            <button class="tool-btn"><i class="pi pi-italic"></i></button>
            <button class="tool-btn"><i class="pi pi-list"></i></button>
            <button class="tool-btn"><i class="pi pi-link"></i></button>
          </div>
          <span class="toolbar-hint">MARKDOWN SUPPORT ACTIVE</span>
        </div>

        <Textarea
          v-model="answerValue"
          rows="12"
          class="essay-textarea"
          placeholder="Type your detailed response here... Use markdown for structure."
        />

        <div class="editor-footer">
          <div class="word-counts">
            <span>Words: {{ wordCount }}</span>
            <span>Characters: {{ charCount }}</span>
          </div>
          <div class="save-status">
            <span v-if="store.isSaving" class="text-muted"
              ><i class="pi pi-spin pi-spinner"></i> Saving...</span
            >
            <span v-else class="text-success"><i class="pi pi-check-circle"></i> Draft Saved</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Навигация (Prev / Next) -->
    <div class="player-footer">
      <Button
        label="Previous Question"
        icon="pi pi-arrow-left"
        text
        severity="secondary"
        :disabled="currentIndex === 0"
        @click="handlePrev"
      />

      <div class="dots-indicator">
        <span
          v-for="i in Math.min(5, store.totalQuestions)"
          :key="i"
          :class="['dot', { 'is-active': i - 1 === currentIndex % 5 }]"
        ></span>
      </div>

      <Button
        label="Next Question"
        icon="pi pi-arrow-right"
        iconPos="right"
        :disabled="currentIndex === store.totalQuestions - 1"
        class="next-btn"
        @click="handleNext"
      />
    </div>
  </div>
</template>

<style scoped>
.player-container {
  background-color: var(--p-surface-0);
  border-radius: var(--p-border-radius-xl);
  border: 1px solid var(--p-surface-200);
  padding: 3rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  max-width: 900px;
  margin: 0 auto;
}

.question-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.points-label {
  font-size: 0.875rem;
  color: var(--p-text-muted-color);
  font-weight: 600;
}

.question-text {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--p-text-color);
  line-height: 1.4;
}

.question-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: var(--p-border-radius-xl);
}

/* Options List (Radio) */
.options-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.option-card {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  padding: 1.5rem;
  border-radius: var(--p-border-radius-lg);
  border: 2px solid var(--p-surface-200);
  background-color: var(--p-surface-50);
  cursor: pointer;
  transition: all 0.2s;
}

.option-card:hover {
  border-color: var(--p-primary-300);
  background-color: var(--p-primary-50);
}

.option-card.is-selected {
  border-color: var(--p-primary-500);
  background-color: var(--p-surface-0);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.option-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-top: 0.1rem;
}

.option-text {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--p-text-color);
  cursor: pointer;
}

.option-desc {
  margin: 0;
  font-size: 0.875rem;
  color: var(--p-text-muted-color);
}

/* Essay Editor */
.essay-editor {
  border: 1px solid var(--p-surface-300);
  border-radius: var(--p-border-radius-lg);
  overflow: hidden;
}

.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: var(--p-surface-50);
  border-bottom: 1px solid var(--p-surface-300);
}

.toolbar-group {
  display: flex;
  gap: 0.5rem;
}

.tool-btn {
  background: none;
  border: none;
  color: var(--p-text-color);
  width: 32px;
  height: 32px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tool-btn:hover {
  background-color: var(--p-surface-200);
}

.toolbar-hint {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--p-text-muted-color);
  letter-spacing: 0.5px;
}

.essay-textarea {
  width: 100%;
  border: none;
  border-radius: 0;
  padding: 1.5rem;
  font-size: 1rem;
  resize: vertical;
}

.essay-textarea:focus {
  outline: none;
  box-shadow: none;
}

.editor-footer {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  background-color: var(--p-surface-50);
  border-top: 1px solid var(--p-surface-200);
  font-size: 0.875rem;
  font-weight: 600;
}

.word-counts {
  display: flex;
  gap: 1.5rem;
  color: var(--p-text-muted-color);
}

.text-success {
  color: var(--p-green-600);
}
.text-muted {
  color: var(--p-text-muted-color);
}

/* Footer Navigation */
.player-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--p-surface-200);
}

.next-btn {
  border-radius: 2rem;
  padding: 0.75rem 2rem;
}

.dots-indicator {
  display: flex;
  gap: 0.5rem;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--p-surface-300);
}
.dot.is-active {
  width: 24px;
  border-radius: 4px;
  background-color: var(--p-primary-500);
}
</style>
