<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import { useCourseStore } from '@/entities/course'
import { CourseInfoEditor } from '@/widgets/course-info-editor'

const { t } = useI18n()
const router = useRouter()
const courseStore = useCourseStore()

const handleCancel = () => {
  router.push({ name: 'teacher-courses' })
}

const handleCreate = async (courseData: any) => {
  // Вызываем экшен стора (моковый POST запрос)
  await courseStore.addCourse({
    ...courseData,
    status: 'Draft',
    term: 'Fall 2024',
    studentsCount: 0,
    nextDueLabel: 'Status',
    nextDueDate: 'Unpublished'
  })

  // После создания перекидываем обратно в список курсов (или сразу внутрь созданного)
  router.push({ name: 'teacher-courses' })
}
</script>

<template>
  <div class="add-course-page">
    <div class="page-intro-card">
      <h1 class="page-title">{{ t('teacherCourses.createCourse') }}</h1>
      <p class="page-subtitle">{{ t('teacherCourses.subtitle') }}</p>
    </div>

    <!-- Внедряем наш переиспользуемый виджет -->
    <CourseInfoEditor :is-edit-mode="false" @save="handleCreate" @cancel="handleCancel" />
  </div>
</template>

<style scoped>
.add-course-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

.page-intro-card {
  background-color: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  padding: 2rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
}

.page-subtitle {
  color: var(--text-color-muted);
  font-size: 1rem;
  margin: 0;
}
</style>
