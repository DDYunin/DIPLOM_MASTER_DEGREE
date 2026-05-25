<script setup lang="ts">
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import type { Course } from '../model/types'

defineProps<{
  course: Course
}>()

const emit = defineEmits<{
  (e: 'manage', courseId: string): void
}>()

const getStatusSeverity = (status: string) => {
  if (status === 'Active') {
    return 'success'
  }
  if (status === 'Draft') {
    return 'warning'
  }
  return 'secondary'
}
</script>

<template>
  <div class="course-card">
    <div class="course-cover">
      <Tag :value="course.status" :severity="getStatusSeverity(course.status)" class="status-tag" />
    </div>

    <div class="course-body">
      <div class="course-meta-top">
        <span class="course-code">{{ course.code }}</span>
        <Button
          icon="pi pi-ellipsis-v"
          text
          rounded
          severity="secondary"
          size="small"
          aria-label="Options"
        />
      </div>

      <h3 class="course-title">{{ course.title }}</h3>
      <p class="course-desc">{{ course.description }}</p>

      <div class="course-meta-bottom">
        <span class="meta-item"><i class="pi pi-calendar"></i> {{ course.term }}</span>
        <span class="meta-item"
          ><i class="pi pi-users"></i> {{ course.studentsCount }} Students</span
        >
      </div>
    </div>

    <div class="course-footer">
      <div class="due-info">
        <span class="due-label">NEXT DUE</span>
        <span class="due-value">{{ course.nextDueLabel }}: {{ course.nextDueDate }}</span>
      </div>

      <Button
        :label="course.status === 'Draft' || course.status === 'Unpublished' ? 'Edit' : 'Manage'"
        :severity="
          course.status === 'Draft' || course.status === 'Unpublished' ? 'secondary' : 'info'
        "
        outlined
        size="small"
        @click="emit('manage', course.id)"
      />
    </div>
  </div>
</template>

<style scoped>
/* Сюда переносим все стили карточки из предыдущего шага */
.course-card {
  background-color: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  height: 100%;
}

.course-card:hover {
  box-shadow: var(--shadow-card);
  transform: translateY(-2px);
  border-color: var(--color-primary-border);
}

.course-cover {
  height: 140px;
  background: var(--surface-media);
  position: relative;
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
}

.course-body {
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.course-meta-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.course-code {
  color: var(--color-primary);
  font-weight: 700;
  font-size: 0.75rem;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.course-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}

.course-desc {
  color: var(--text-color-muted);
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0 0 1.5rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-meta-bottom {
  display: flex;
  gap: 1.5rem;
  margin-top: auto;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color-muted);
  font-size: 0.875rem;
  font-weight: 500;
}

.course-footer {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid var(--surface-subtle);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--surface-ground);
}

.due-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.due-label {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--text-color-muted);
  letter-spacing: 0.5px;
}

.due-value {
  font-size: 0.875rem;
  color: var(--text-color);
  font-weight: 600;
}
</style>
