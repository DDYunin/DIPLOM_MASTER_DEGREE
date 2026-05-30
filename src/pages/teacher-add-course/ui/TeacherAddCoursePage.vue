<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { useCourseStore, type CourseFormValues } from '@/entities/course'
import { CourseInfoEditor } from '@/widgets/course-info-editor'
import { useNotifications } from '@/shared/model'

const { t } = useI18n()
const router = useRouter()
const courseStore = useCourseStore()
const notifications = useNotifications()

const handleCancel = () => {
  router.push({ name: 'teacher-courses' })
}

const handleCreate = async (courseData: CourseFormValues) => {
  try {
    const created = await courseStore.addCourse(courseData)
    notifications.showToast('success', t('common.success'), t('teacherCourses.courseCreated'))
    router.push({ name: 'course-main-info', params: { id: created.id } })
  } catch {
    // Toast об ошибке показывает API-клиент
  }
}
</script>

<template>
  <div class="add-course-page">
    <div class="page-intro-card">
      <h1 class="page-title">{{ t('teacherCourses.createCourse') }}</h1>
      <p class="page-subtitle">{{ t('teacherCourses.subtitle') }}</p>
    </div>

    <CourseInfoEditor
      :is-edit-mode="false"
      :is-saving="courseStore.isSaving"
      @save="handleCreate"
      @cancel="handleCancel"
    />
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
