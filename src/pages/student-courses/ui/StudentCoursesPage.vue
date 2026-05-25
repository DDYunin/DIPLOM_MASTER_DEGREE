<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { StudentCourses } from '@/widgets/student-courses'

const { t } = useI18n()
</script>

<template>
  <div class="student-courses-page">
    <header class="student-courses-page__header">
      <h1 class="student-courses-page__title">{{ t('studentCourses.title') }}</h1>
    </header>

    <main class="student-courses-page__content">
      <StudentCourses />
    </main>
  </div>
</template>

<style scoped>
.student-courses-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem 0;
}

.student-courses-page__header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.student-courses-page__title {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color);
}

.student-courses-page__subtitle {
  margin: 0;
  font-size: 1rem;
  color: var(--text-color-muted);
}
</style>
