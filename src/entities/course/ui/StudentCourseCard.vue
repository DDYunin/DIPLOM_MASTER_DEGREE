<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import AvatarGroup from 'primevue/avatargroup'
import type { StudentCourse } from '../model/types'

const { t } = useI18n()

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
            <span class="instructor-label">{{ t('studentCourse.instructor') }}</span>
            <span class="instructor-name">{{ mainInstructor.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Футер карточки -->
    <div class="course-footer">
      <Button
        :label="t('studentCourse.resume')"
        size="small"
        @click="emit('resume', course.id)"
        class="footer-btn"
      />
      <Button
        :label="t('studentCourse.syllabus')"
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
  position: relative;
  background-color: var(--surface-subtle);
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
  background: var(--surface-media);
}

.fallback-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--icon-muted);
  letter-spacing: 2px;
}

.category-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background-color: var(--surface-card);
  color: var(--text-color);
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card-hover);
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
  color: var(--text-color-muted);
}

.instructor-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-color);
}

.course-footer {
  padding: 1.25rem 1.5rem;
  display: flex;
  gap: 1rem;
  background-color: var(--surface-ground);
  border-top: 1px solid var(--surface-subtle);
}

.footer-btn {
  flex: 1;
}
</style>
