<script setup lang="ts">
import { StudentCourses } from '@/widgets/student-courses'
</script>

<template>
  <div class="student-courses-page">
    <header class="student-courses-page__header">
      <h1 class="student-courses-page__title">My Courses</h1>
      <p class="student-courses-page__subtitle">
        Continue your academic journey and track your semester progress.
      </p>
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
  color: var(--p-text-color);
}

.student-courses-page__subtitle {
  margin: 0;
  font-size: 1rem;
  color: var(--p-text-muted-color);
}
</style>
