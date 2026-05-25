<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'
import { useAssessmentStore } from '@/entities/assessment'

const router = useRouter()
const route = useRoute()
const store = useAssessmentStore()

const handleReturn = () => {
  if (store.currentAssessment?.courseId) {
    router.push({
      name: 'student-course-details',
      params: { id: store.currentAssessment.courseId }
    })
  } else {
    router.push({ name: 'student-courses' })
  }
}

const handleStartTest = () => {
  // console.log('Starting test...', store.currentAssessment?.id)
  router.push({
    name: 'student-assessment-take',
    params: {
      id: route.params.id,
      assessmentId: store.currentAssessment?.id
    }
  })
}
</script>

<template>
  <div class="assessment-info-widget">
    <div v-if="store.isLoading || !store.currentAssessment" class="loading-state">
      <Skeleton height="150px" borderRadius="var(--radius-xl)" />
      <Skeleton height="120px" borderRadius="var(--radius-xl)" />
      <Skeleton height="300px" borderRadius="var(--radius-xl)" />
    </div>

    <template v-else>
      <!-- Breadcrumbs -->
      <nav class="breadcrumbs">
        <span>Courses</span>
        <i class="pi pi-angle-right"></i>
        <span>{{ store.currentAssessment.courseCode }}</span>
        <i class="pi pi-angle-right"></i>
        <span class="current-page">{{ store.currentAssessment.title }}</span>
      </nav>

      <!-- Header Section -->
      <header class="header-section">
        <Tag value="ACADEMIC ASSESSMENT" severity="success" rounded class="assessment-tag" />
        <h1 class="title">{{ store.currentAssessment.title }}</h1>
        <p class="description">{{ store.currentAssessment.description }}</p>
      </header>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="icon-wrapper bg-blue-100">
            <i class="pi pi-stopwatch text-blue-600"></i>
          </div>
          <div class="stat-content">
            <span class="stat-label">TIME LIMIT</span>
            <span class="stat-value">{{ store.currentAssessment.timeLimit }} Minutes</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="icon-wrapper bg-green-100">
            <i class="pi pi-check-square text-green-600"></i>
          </div>
          <div class="stat-content">
            <span class="stat-label">TOTAL QUESTIONS</span>
            <span class="stat-value">{{ store.currentAssessment.totalQuestions }} Tasks</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="icon-wrapper bg-orange-100">
            <i class="pi pi-calendar text-orange-600"></i>
          </div>
          <div class="stat-content">
            <span class="stat-label">DUE DATE</span>
            <span class="stat-value">{{ store.currentAssessment.dueDate }}</span>
          </div>
        </div>
      </div>

      <!-- Instructions Section -->
      <section class="instructions-section">
        <h2 class="instructions-title">Instructions for Candidates</h2>

        <div class="instructions-list">
          <div
            v-for="(instruction, index) in store.currentAssessment.instructions"
            :key="index"
            class="instruction-item"
          >
            <div class="instruction-number">{{ index + 1 }}</div>
            <p
              class="instruction-text"
              v-html="instruction.replace('Start Test', '<strong>Start Test</strong>')"
            ></p>
          </div>
        </div>
      </section>

      <!-- Actions -->
      <div class="actions-section">
        <Button
          label="Start Test"
          icon="pi pi-play"
          iconPos="right"
          size="large"
          class="start-btn"
          @click="handleStartTest"
        />
        <Button
          label="Return to Course"
          icon="pi pi-arrow-left"
          severity="secondary"
          outlined
          size="large"
          class="return-btn"
          @click="handleReturn"
        />
      </div>

      <p class="footer-note">
        By starting this exam, you agree to the Academic Atelier Honor Code and Privacy Policy.
      </p>
    </template>
  </div>
</template>

<style scoped>
.assessment-info-widget {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem 0 3rem 0;
}

.loading-state {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Breadcrumbs */
.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-color-muted);
  font-weight: 500;
}

.breadcrumbs i {
  font-size: 0.75rem;
}

.current-page {
  color: var(--text-color);
  font-weight: 600;
}

/* Header */
.header-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
}

.assessment-tag {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.title {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text-color);
  line-height: 1.2;
}

.description {
  margin: 0;
  font-size: 1.125rem;
  color: var(--text-color-muted);
  line-height: 1.6;
  max-width: 700px;
}

/* Stats Cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.stat-card {
  background-color: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

/* Используем тональные цвета для иконок */
.bg-blue-100 {
  background-color: var(--color-primary-muted);
}
.text-blue-600 {
  color: var(--color-primary-strong);
}
.bg-green-100 {
  background-color: var(--color-success-muted);
}
.text-green-600 {
  color: var(--color-success-strong);
}
.bg-orange-100 {
  background-color: var(--color-warning-muted);
}
.text-orange-600 {
  color: var(--color-warning-strong);
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-color-muted);
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text-color);
}

/* Instructions */
.instructions-section {
  background-color: var(--surface-ground);
  border-radius: var(--radius-xl);
  padding: 2.5rem;
}

.instructions-title {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-color);
}

.instructions-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.instruction-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.instruction-number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: var(--color-primary-subtle);
  color: var(--color-primary-strong);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.instruction-text {
  margin: 0;
  color: var(--text-color);
  line-height: 1.6;
  font-size: 1rem;
}

/* Actions */
.actions-section {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1rem;
}

.start-btn {
  min-width: 200px;
  border-radius: 2rem;
}

.return-btn {
  min-width: 200px;
  border-radius: 2rem;
}

.footer-note {
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-color-muted);
  font-style: italic;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  .actions-section {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
