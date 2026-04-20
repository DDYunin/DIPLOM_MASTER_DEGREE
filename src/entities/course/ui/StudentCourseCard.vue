<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import AvatarGroup from 'primevue/avatargroup'
import type { StudentCourse } from '../model/types'

const props = defineProps<{
  course: StudentCourse
}>()

const emit = defineEmits<{
  (e: 'resume', courseId: string): void
  (e: 'syllabus', courseId: string): void
}>()

const hasMultipleInstructors = computed(() => props.course.instructors.length > 1)
const mainInstructor = computed(() => props.course.instructors[0])
</script>

<template>
  <div class="course-card">
    <!-- Обложка с Fallback-ом -->
    <div class="course-cover">
      <img v-if="course.coverUrl" :src="course.coverUrl" :alt="course.title" class="cover-image" />
      <div v-else class="cover-fallback">
        <span class="fallback-text">{{ course.code }}</span>
      </div>
      <div class="category-badge">{{ course.category }}</div>
    </div>

    <!-- Тело карточки -->
    <div class="course-body">
      <div class="course-code">{{ course.code }}</div>
      <h3 class="course-title">{{ course.title }}</h3>

      <div class="course-instructors">
        <AvatarGroup v-if="hasMultipleInstructors">
          <Avatar
            v-for="inst in course.instructors"
            :key="inst.id"
            :image="inst.avatarUrl"
            :label="!inst.avatarUrl ? inst.name.charAt(0) : undefined"
            shape="circle"
          />
        </AvatarGroup>

        <div v-else-if="mainInstructor" class="single-instructor">
          <Avatar
            :image="mainInstructor.avatarUrl"
            :label="!mainInstructor.avatarUrl ? mainInstructor.name.charAt(0) : undefined"
            shape="circle"
          />
          <div class="instructor-info">
            <span class="instructor-label">INSTRUCTOR</span>
            <span class="instructor-name">{{ mainInstructor.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Футер карточки -->
    <div class="course-footer">
      <Button label="Resume" size="small" @click="emit('resume', course.id)" class="footer-btn" />
      <Button
        label="Syllabus"
        severity="secondary"
        outlined
        size="small"
        @click="emit('syllabus', course.id)"
        class="footer-btn"
      />
    </div>
  </div>
</template>

<style scoped>
.course-card {
  background-color: var(--p-surface-0);
  border: 1px solid var(--p-surface-200);
  border-radius: var(--p-border-radius);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  height: 100%;
}

.course-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
  border-color: var(--p-primary-300);
}

.course-cover {
  height: 140px;
  position: relative;
  background-color: var(--p-surface-100);
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--p-surface-200) 0%, var(--p-surface-100) 100%);
}

.fallback-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--p-surface-400);
  letter-spacing: 2px;
}

.category-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background-color: var(--p-surface-0);
  color: var(--p-text-color);
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: var(--p-border-radius-xl);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.5px;
}

.course-body {
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.course-code {
  color: var(--p-primary-500);
  font-weight: 700;
  font-size: 0.75rem;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.course-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--p-text-color);
  margin: 0;
  line-height: 1.3;
}

.course-instructors {
  margin-top: auto;
  padding-top: 1.5rem;
}

.single-instructor {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.instructor-info {
  display: flex;
  flex-direction: column;
}

.instructor-label {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--p-text-muted-color);
}

.instructor-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--p-text-color);
}

.course-footer {
  padding: 1.25rem 1.5rem;
  display: flex;
  gap: 1rem;
  background-color: var(--p-surface-50);
  border-top: 1px solid var(--p-surface-100);
}

.footer-btn {
  flex: 1;
}
</style>
