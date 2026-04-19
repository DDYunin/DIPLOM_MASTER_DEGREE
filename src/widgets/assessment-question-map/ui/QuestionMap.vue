<script setup lang="ts">
import ProgressBar from 'primevue/progressbar'
import Button from 'primevue/button'
import { useAssessmentSessionStore } from '@/entities/assessment-session'
import { SubmitAssessmentBtn } from '@/features/submit-assessment'

const store = useAssessmentSessionStore()

const getQuestionStatus = (qId: string) => {
  const answer = store.session?.answers[qId]
  if (qId === store.currentQuestionId) return 'current'
  if (answer && answer.value !== null && answer.value !== '') return 'answered'
  return 'unanswered'
}

const isFlagged = (qId: string) => !!store.session?.answers[qId]?.isFlagged

const handleFlagToggle = () => {
  if (store.currentQuestionId) {
    store.toggleFlag(store.currentQuestionId)
  }
}
</script>

<template>
  <aside class="question-map-card">
    <div class="map-header">
      <h3 class="map-title">QUESTION MAP</h3>
    </div>

    <div class="map-grid">
      <button
        v-for="(q, index) in store.session?.questions"
        :key="q.id"
        :class="['grid-item', `is-${getQuestionStatus(q.id)}`]"
        @click="store.goToQuestion(q.id)"
      >
        {{ index + 1 }}
        <i v-if="isFlagged(q.id)" class="pi pi-flag-fill flag-icon"></i>
      </button>
    </div>

    <div class="progress-section">
      <div class="progress-labels">
        <span>Progress</span>
        <span>{{ store.progressPercentage }}%</span>
      </div>
      <ProgressBar :value="store.progressPercentage" :showValue="false" class="map-progress" />
    </div>

    <div class="map-actions">
      <Button
        :label="isFlagged(store.currentQuestionId!) ? 'Remove Flag' : 'Flag for Review'"
        icon="pi pi-flag"
        severity="secondary"
        outlined
        class="w-full flag-btn"
        @click="handleFlagToggle"
      />

      <SubmitAssessmentBtn />
    </div>
  </aside>
</template>

<style scoped>
.question-map-card {
  background-color: var(--p-surface-0);
  border: 1px solid var(--p-surface-200);
  border-radius: var(--p-border-radius-xl);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.map-title {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--p-text-muted-color);
  text-transform: uppercase;
}

.map-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

.grid-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: var(--p-border-radius);
  border: 1px solid var(--p-surface-300);
  background-color: var(--p-surface-0);
  color: var(--p-text-color);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.grid-item:hover {
  background-color: var(--p-surface-100);
}

.grid-item.is-answered {
  background-color: var(--p-primary-500);
  color: var(--p-surface-0);
  border-color: var(--p-primary-500);
}

.grid-item.is-current {
  border: 2px solid var(--p-primary-500);
  background-color: var(--p-primary-50);
  color: var(--p-primary-600);
}

.flag-icon {
  position: absolute;
  top: -4px;
  right: -4px;
  font-size: 0.65rem;
  color: var(--p-orange-500);
  background: var(--p-surface-0);
  border-radius: 50%;
  padding: 2px;
}

.progress-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem 0;
  border-top: 1px solid var(--p-surface-200);
  border-bottom: 1px solid var(--p-surface-200);
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--p-text-color);
}

.map-progress {
  height: 6px;
}

.map-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.w-full {
  width: 100%;
}
.flag-btn {
  border-radius: var(--p-border-radius-xl);
}
</style>
