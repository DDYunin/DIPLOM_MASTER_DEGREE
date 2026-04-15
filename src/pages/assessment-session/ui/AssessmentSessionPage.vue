<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAssessmentSessionStore } from '@/entities/assessment-session'

// Убрали FocusLayout и AssessmentPlayerHeader! Оставили только 2 виджета:
import { QuestionMap } from '@/widgets/assessment-question-map'
import { QuestionPlayer } from '@/widgets/assessment-question-player'

const route = useRoute()
const store = useAssessmentSessionStore()

onMounted(() => {
  const courseId = route.params.id as string
  const assessmentId = route.params.assessmentId as string
  if (courseId && assessmentId) {
    store.loadSession(courseId, assessmentId)
  }
})

onUnmounted(() => {
  store.stopTimer()
})
</script>

<template>
  <div class="assessment-page">
    <!-- Новая аккуратная шапка внутри контентной области -->
    <header class="page-topbar" v-if="!store.isLoading && store.session">
      <div class="title-group">
        <h1 class="page-title">{{ store.session.title }}</h1>
        <i class="pi pi-angle-right divider-icon"></i>
        <span class="course-subtitle">{{ store.session.courseTitle }}</span>
      </div>

      <!-- Таймер -->
      <div class="timer-badge" :class="{ 'timer-warning': store.session.timeRemaining < 300 }">
        <i class="pi pi-clock"></i>
        <span>{{ store.formattedTime }}</span>
      </div>
    </header>

    <!-- Основной контент (Сетка) -->
    <div class="assessment-workspace" v-if="!store.isLoading && store.session">
      <div class="sidebar-area">
        <QuestionMap />
      </div>
      <div class="player-area">
        <QuestionPlayer />
      </div>
    </div>
  </div>
</template>

<style scoped>
.assessment-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Стили для встроенного хедера */
.page-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--p-surface-0);
  border: 1px solid var(--p-surface-200);
  border-radius: var(--p-border-radius-xl);
  padding: 1rem 1.5rem;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.page-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--p-text-color);
}

.divider-icon {
  color: var(--p-text-muted-color);
  font-size: 0.875rem;
}

.course-subtitle {
  font-size: 1rem;
  font-weight: 500;
  color: var(--p-text-muted-color);
}

.timer-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--p-red-50);
  color: var(--p-red-600);
  padding: 0.5rem 1rem;
  border-radius: var(--p-border-radius-xl);
  font-weight: 700;
  font-size: 1.125rem;
  letter-spacing: 1px;
}

.timer-warning {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(239, 68, 68, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
}

/* Стили рабочей области */
.assessment-workspace {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 1.5rem;
  align-items: start;
}

@media (max-width: 1024px) {
  .assessment-workspace {
    grid-template-columns: 1fr;
  }
  .sidebar-area {
    order: 2;
  }
  .player-area {
    order: 1;
  }
  .page-topbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  .timer-badge {
    width: 100%;
    justify-content: center;
  }
}
</style>
