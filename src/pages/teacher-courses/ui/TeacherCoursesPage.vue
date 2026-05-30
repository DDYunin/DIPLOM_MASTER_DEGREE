<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { useCourseStore, CourseCard } from '@/entities/course'

// Переиспользуемый UI-кит
import { WidgetCard } from '@/shared/ui'

// Компоненты PrimeVue
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

const { t } = useI18n()
const courseStore = useCourseStore()
const router = useRouter()
const searchQuery = ref('')

// При монтировании страницы запрашиваем список курсов
onMounted(() => {
  courseStore.loadCourses()
})

// --- ВЫЧИСЛЯЕМЫЕ ДАННЫЕ ДЛЯ СТАТИСТИКИ ---
const activeCoursesCount = computed(() => courseStore.stats.activeCoursesCount || courseStore.activeCourses.length)
const totalStudentsCount = computed(() => courseStore.totalStudents)
const pendingGradingCount = 0

// --- ЛОГИКА ПОИСКА ---
const filteredCourses = computed(() => {
  if (!searchQuery.value) {
    return courseStore.courses
  }
  const query = searchQuery.value.toLowerCase()
  return courseStore.courses.filter(
    (c) => c.title.toLowerCase().includes(query) || c.code.toLowerCase().includes(query)
  )
})

// Обработчик для кнопки "Add Course"
const goToAddCourse = () => {
  router.push({ name: 'teacher-add-course' })
}

const goToCourseDetails = (courseId: string) => {
  router.push({ name: 'course-main-info', params: { id: courseId } })
}
</script>

<template>
  <div class="teacher-courses-page">
    <!-- Секция приветствия -->
    <header class="page-header">
      <!-- Имя можно брать из userStore, пока хардкод по макету -->
      <h1 class="welcome-title">{{ t('teacherCourses.title') }}</h1>
      <p class="welcome-subtitle">{{ t('teacherCourses.subtitle') }}</p>
    </header>

    <!-- TODO: Возможно лишние карточки -->
    <!-- Секция статистики (используем твой WidgetCard) -->
    <section class="stats-grid">
      <!-- Карточка 1: Total Students -->
      <WidgetCard
        :title="t('teacherCourses.totalStudents')"
        icon="pi-users"
        iconColorClass="stat-icon-blue"
      >
        <div class="stat-content">
          <div class="stat-value">{{ totalStudentsCount }}</div>
          <div class="stat-trend trend-up">
            <i class="pi pi-arrow-up-right"></i> {{ t('teacherCourses.trendSemester') }}
          </div>
        </div>
      </WidgetCard>

      <WidgetCard
        :title="t('teacherCourses.activeCourses')"
        icon="pi-book"
        iconColorClass="stat-icon-purple"
      >
        <div class="stat-content">
          <div class="stat-value">{{ activeCoursesCount }}</div>
          <div class="stat-desc">{{ t('teacherCourses.syllabiUpdated') }}</div>
        </div>
      </WidgetCard>

      <WidgetCard
        :title="t('teacherCourses.pendingGrading')"
        icon="pi-exclamation-circle"
        iconColorClass="stat-icon-orange"
      >
        <div class="stat-content">
          <div class="stat-value">{{ pendingGradingCount }}</div>
          <div class="stat-desc text-warning">{{ t('teacherCourses.due48h') }}</div>
        </div>
      </WidgetCard>
    </section>

    <!-- Секция тулбара (Поиск и действия) -->
    <section class="toolbar-section">
      <IconField iconPosition="left" class="search-field">
        <InputIcon class="pi pi-search" />
        <InputText
          v-model="searchQuery"
          :placeholder="t('teacherCourses.searchPlaceholder')"
          class="full-width-input"
        />
      </IconField>

      <div class="toolbar-actions">
        <Button :label="t('common.filter')" icon="pi pi-filter" severity="secondary" outlined />
        <Button :label="t('teacherCourses.addCourse')" icon="pi pi-plus" @click="goToAddCourse" />
      </div>
    </section>

    <!-- Сетка карточек курсов -->
    <section class="courses-grid">
      <div v-if="courseStore.isLoading" class="loading-state">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
      </div>

      <div v-else-if="filteredCourses.length === 0" class="empty-state">{{ t('common.noData') }}</div>

      <CourseCard
        v-for="course in filteredCourses"
        :key="course.id"
        :course="course"
        @manage="goToCourseDetails"
      />
    </section>
  </div>
</template>

<style scoped>
.teacher-courses-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1400px; /* Ограничиваем ширину для больших экранов */
  margin: 0 auto;
  width: 100%;
}

/* --- ЗАГОЛОВОК --- */
.page-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.welcome-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
}

.welcome-subtitle {
  color: var(--text-color-muted);
  font-size: 1rem;
  margin: 0;
}

/* --- СТАТИСТИКА --- */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.5rem;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-color);
  line-height: 1;
}

.stat-trend {
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 500;
}

.trend-up {
  color: var(--color-success);
}

.stat-desc {
  font-size: 0.875rem;
  color: var(--text-color-muted);
}

.text-warning {
  color: var(--color-warning);
  font-weight: 500;
}

/* --- ТУЛБАР --- */
.toolbar-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap; /* Для мобильных устройств */
}

.search-field {
  flex-grow: 1;
  max-width: 450px;
}

.full-width-input {
  width: 100%;
}

.toolbar-actions {
  display: flex;
  gap: 1rem;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;
}

/* Состояния загрузки и пустых данных */
.loading-state,
.empty-state {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  color: var(--text-color-muted);
}
</style>
