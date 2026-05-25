<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import ProgressBar from 'primevue/progressbar'
import type { StudentCourseDetails, CourseElement } from '@/entities/course'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps<{
  course: StudentCourseDetails
}>()

// Цветовое кодирование иконок в стиле Teacher Portal
const getElementIconConfig = (type: CourseElement['type'], status: CourseElement['status']) => {
  if (status === 'locked') return { class: 'pi pi-lock', color: 'var(--icon-muted)' }

  switch (type) {
    case 'video':
      return { class: 'pi pi-play-circle', color: 'var(--color-primary)' }
    case 'pdf':
      return { class: 'pi pi-file-pdf', color: 'var(--color-warning)' }
    case 'quiz':
      return { class: 'pi pi-question-circle', color: 'var(--color-accent-purple)' }
    case 'assignment':
      return { class: 'pi pi-clipboard', color: 'var(--color-primary)' }
    default:
      return { class: 'pi pi-file', color: 'var(--text-color)' }
  }
}

const progressPercentage = computed(() => {
  return Math.round((props.course.completedElements / props.course.totalElements) * 100)
})

const handleElementClick = (element: CourseElement) => {
  if (element.status === 'locked') {
    return
  }

  if (element.type === 'quiz' || element.type === 'assignment') {
    // Переход на страницу информации об оценке
    router.push({
      name: 'student-assessment-info',
      params: {
        id: props.course.id,
        assessmentId: element.id
      }
    })
  } else if (element.type === 'pdf' || element.type === 'video') {
    // Скачивание или открытие в новой вкладке (по твоему предложению)
    // Пока заглушка:
    alert(`Downloading material: ${element.title}`)
  }
}
</script>

<template>
  <div class="course-details-layout">
    <!-- Левая колонка (Список модулей) -->
    <div class="modules-column">
      <div
        v-for="module in course.modules"
        :key="module.id"
        :class="['module-card', `is-${module.status}`]"
      >
        <div class="module-header">
          <div class="module-meta">
            <span class="module-order">MODULE {{ module.order.toString().padStart(2, '0') }}</span>
            <Tag
              v-if="module.status === 'current'"
              value="CURRENT"
              severity="info"
              rounded
              class="current-tag"
            />
            <div v-if="module.status === 'completed'" class="completed-check">
              <i class="pi pi-check"></i>
            </div>
          </div>
          <h3 class="module-title">{{ module.title }}</h3>
        </div>

        <div v-if="module.status === 'locked'" class="module-locked-state">
          <p>Unlock by completing previous modules</p>
        </div>

        <div v-else class="module-elements">
          <div
            v-for="element in module.elements"
            :key="element.id"
            :class="['element-item', `is-${element.status}`]"
          >
            <div
              class="element-icon"
              :style="{ color: getElementIconConfig(element.type, element.status).color }"
            >
              <i :class="getElementIconConfig(element.type, element.status).class"></i>
            </div>

            <div class="element-info">
              <span class="element-title">{{ element.title }}</span>
              <span class="element-meta">
                <span
                  class="element-type"
                  :style="{ color: getElementIconConfig(element.type, element.status).color }"
                >
                  {{ element.type.toUpperCase() }}
                </span>
                • {{ element.meta.split('•')[1]?.trim() || element.meta }}
              </span>
            </div>

            <div class="element-actions">
              <i v-if="element.status === 'completed'" class="pi pi-check-circle text-primary"></i>
              <Button
                v-else-if="element.status === 'current'"
                label="Resume"
                size="small"
                rounded
                @click="handleElementClick(element)"
              />
              <div v-else-if="element.status === 'locked'" class="locked-dot"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Правая колонка (Сайдбар) -->
    <aside class="sidebar-column">
      <!-- Навигация и Прогресс -->
      <div class="sidebar-card">
        <h4 class="sidebar-title"><i class="pi pi-list"></i> COURSE NAVIGATION</h4>

        <div class="navigation-stepper">
          <div
            v-for="module in course.modules"
            :key="`nav-${module.id}`"
            :class="['step-item', `is-${module.status}`]"
          >
            <div class="step-indicator">
              <i v-if="module.status === 'completed'" class="pi pi-check"></i>
              <div v-else-if="module.status === 'current'" class="current-dot"></div>
              <i v-else class="pi pi-lock"></i>
            </div>
            <div class="step-content">
              <span class="step-label">MODULE {{ module.order.toString().padStart(2, '0') }}</span>
              <span class="step-title">{{ module.title }}</span>
              <ProgressBar
                v-if="module.status === 'current'"
                :value="33"
                :showValue="false"
                class="step-progress"
              />
            </div>
          </div>
        </div>

        <div class="overall-progress">
          <div class="progress-header">
            <span>OVERALL COURSE PROGRESS</span>
            <span class="progress-percent text-primary">{{ progressPercentage }}%</span>
          </div>
          <ProgressBar :value="progressPercentage" :showValue="false" class="overall-bar" />
        </div>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.course-details-layout {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
  align-items: start;
}

/* --- MODULES COLUMN --- */
.modules-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.module-card {
  background-color: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  transition: all 0.2s;
}

.module-card.is-current {
  border-color: var(--color-primary-border);
  box-shadow: var(--shadow-soft);
}

.module-card.is-locked {
  opacity: 0.7;
  background-color: var(--surface-ground);
  border: 1px dashed var(--surface-border);
}

.module-header {
  margin-bottom: 1.5rem;
}

.module-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.module-order {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-color-muted);
  letter-spacing: 1px;
}

.current-tag {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.1rem 0.5rem;
}

.completed-check {
  width: 20px;
  height: 20px;
  background-color: var(--color-primary);
  color: var(--surface-card);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
}

.module-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
}

.module-locked-state {
  padding: 2rem;
  text-align: center;
  border-radius: var(--radius-md);
  border: 1px dashed var(--surface-border-strong);
  color: var(--text-color-muted);
  font-style: italic;
}

/* Elements List */
.module-elements {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.element-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--surface-border);
  background-color: var(--surface-card);
  transition: border-color 0.2s;
}

.element-item.is-current {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-subtle);
}

.element-item.is-locked {
  background-color: var(--surface-ground);
}

.element-icon {
  font-size: 1.5rem;
  margin-right: 1.25rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--surface-ground);
  border-radius: var(--radius-md);
}

.element-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.element-title {
  font-weight: 600;
  color: var(--text-color);
  font-size: 1rem;
}

.is-locked .element-title {
  color: var(--text-color-muted);
}

.element-meta {
  font-size: 0.75rem;
  color: var(--text-color-muted);
  font-weight: 500;
}

.element-type {
  font-weight: 700;
}

.element-actions {
  margin-left: 1rem;
}

.text-primary {
  color: var(--color-primary);
  font-size: 1.25rem;
}

.locked-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--surface-border-strong);
}

/* --- SIDEBAR COLUMN --- */
.sidebar-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar-card {
  background-color: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
}

.sidebar-title {
  margin: 0 0 1.5rem 0;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-color-muted);
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Stepper */
.navigation-stepper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
  margin-bottom: 2rem;
}

.navigation-stepper::before {
  content: '';
  position: absolute;
  left: 11px;
  top: 10px;
  bottom: 10px;
  width: 2px;
  background-color: var(--surface-border);
  z-index: 0;
}

.step-item {
  display: flex;
  gap: 1rem;
  position: relative;
  z-index: 1;
}

.step-indicator {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: var(--surface-card);
  border: 2px solid var(--surface-border-strong);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 0.75rem;
  color: var(--icon-muted);
}

.step-item.is-completed .step-indicator {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-on-primary);
}

.step-item.is-current .step-indicator {
  border-color: var(--color-primary);
}

.current-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--color-primary);
}

.step-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-top: 0.1rem;
}

.step-label {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--text-color-muted);
  letter-spacing: 0.5px;
}

.step-item.is-current .step-label {
  color: var(--color-primary);
}

.step-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-color);
}

.step-item.is-locked .step-title {
  color: var(--text-color-muted);
}

.step-progress {
  height: 6px;
  margin-top: 0.5rem;
}

.overall-progress {
  padding-top: 1.5rem;
  border-top: 1px solid var(--surface-border);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-color-muted);
  letter-spacing: 0.5px;
}

.overall-bar {
  height: 8px;
}

@media (max-width: 1024px) {
  .course-details-layout {
    grid-template-columns: 1fr;
  }
}
</style>
