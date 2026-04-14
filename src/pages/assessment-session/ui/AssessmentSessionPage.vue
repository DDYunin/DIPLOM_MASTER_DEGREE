<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAssessmentSessionStore } from '@/entities/assessment-session'
import { FocusLayout } from '@/shared/ui'
import { AssessmentPlayerHeader } from '@/widgets/assessment-player-header'
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
  store.stopTimer() // Обязательно чистим таймер при уходе
})
</script>

<template>
  <FocusLayout>
    <!-- Шапка на весь экран -->
    <template #header-left>
      <AssessmentPlayerHeader />
    </template>

    <!-- Основной контент (Grid) -->
    <div class="assessment-workspace" v-if="!store.isLoading && store.session">
      <div class="sidebar-area">
        <QuestionMap />
      </div>
      <div class="player-area">
        <QuestionPlayer />
      </div>
    </div>
  </FocusLayout>
</template>

<style scoped>
.assessment-workspace {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 2rem;
  height: 100%;
  align-items: start;
}

@media (max-width: 1024px) {
  .assessment-workspace {
    grid-template-columns: 1fr;
  }
  .sidebar-area {
    order: 2; /* На мобильных карта вопросов уходит вниз */
  }
  .player-area {
    order: 1;
  }
}
</style>
