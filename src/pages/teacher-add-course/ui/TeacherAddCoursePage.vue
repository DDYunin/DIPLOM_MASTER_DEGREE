<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from 'primevue/button'

const router = useRouter()

const goBack = () => {
  router.push({ name: 'teacher-courses' })
}
</script>

<template>
  <div class="add-course-page">
    <header class="page-header">
      <Button
        icon="pi pi-arrow-left"
        text
        rounded
        severity="secondary"
        @click="goBack"
        aria-label="Go back"
      />
      <div>
        <h1 class="page-title">Create New Course</h1>
        <p class="page-subtitle">Configure syllabus, schedule, and grading policies</p>
      </div>
    </header>

    <main class="page-content">
      <!-- В будущем здесь появится компонент многошаговой формы (Stepper) -->
      <div class="placeholder-box">
        <i class="pi pi-hammer text-muted"></i>
        <span class="text-muted">Course creation form will be here...</span>
      </div>
    </main>
  </div>
</template>

<style scoped>
.add-course-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1000px;
  width: 100%;
}

.page-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--p-text-color);
  margin: 0 0 0.5rem 0;
}

.page-subtitle {
  color: var(--p-text-muted-color);
  font-size: 1rem;
  margin: 0;
}

.page-content {
  background-color: var(--p-surface-0);
  border: 1px solid var(--p-surface-200);
  border-radius: var(--p-border-radius);
  padding: 3rem;
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.placeholder-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.text-muted {
  color: var(--p-text-muted-color);
  font-size: 1.25rem;
}
</style>
