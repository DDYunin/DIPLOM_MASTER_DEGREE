<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCourseStore } from '@/entities/course'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

const route = useRoute()
const router = useRouter()
const courseStore = useCourseStore()

// Получаем ID курса из URL (например, 'course-1')
const courseId = computed(() => route.params.id as string)

// Находим курс в сторе
const course = computed(() => courseStore.getCourseById(courseId.value))

onMounted(async () => {
  // Если зашли по прямой ссылке и курсов в сторе еще нет — загружаем
  if (courseStore.courses.length === 0) {
    await courseStore.loadCourses()
  }
})

const goBack = () => {
  router.push({ name: 'teacher-courses' })
}

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
  <div class="course-details-page">
    <!-- Шапка страницы -->
    <header class="page-header">
      <div class="header-top">
        <Button
          icon="pi pi-arrow-left"
          text
          rounded
          severity="secondary"
          @click="goBack"
          aria-label="Back to courses"
        />
        <div v-if="course" class="title-wrapper">
          <h1 class="page-title">{{ course.code }}: {{ course.title }}</h1>
          <Tag :value="course.status" :severity="getStatusSeverity(course.status)" />
        </div>
        <div v-else class="title-wrapper">
          <h1 class="page-title">Loading course...</h1>
        </div>
      </div>
    </header>

    <!-- Навигация по вкладкам (Tabs) -->
    <nav class="tabs-navigation">
      <router-link
        :to="{ name: 'course-main-info' }"
        class="tab-link"
        active-class="tab-link--active"
      >
        <i class="pi pi-info-circle"></i> Main Info
      </router-link>
      <router-link
        :to="{ name: 'course-content' }"
        class="tab-link"
        active-class="tab-link--active"
      >
        <i class="pi pi-file-edit"></i> Content
      </router-link>
      <router-link
        :to="{ name: 'course-participants' }"
        class="tab-link"
        active-class="tab-link--active"
      >
        <i class="pi pi-users"></i> Participants
      </router-link>
      <router-link :to="{ name: 'course-grades' }" class="tab-link" active-class="tab-link--active">
        <i class="pi pi-chart-bar"></i> Grades
      </router-link>
    </nav>

    <!-- Контейнер для активной вкладки -->
    <main class="tab-container">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.course-details-page {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

/* --- HEADER --- */
.page-header {
  margin-bottom: 2rem;
}

.header-top {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--p-text-color);
  margin: 0;
}

/* --- TABS NAVIGATION --- */
.tabs-navigation {
  display: flex;
  gap: 2rem;
  border-bottom: 1px solid var(--p-surface-200);
  margin-bottom: 2rem;
}

.tab-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0;
  color: var(--p-text-muted-color);
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  margin-bottom: -1px; /* Накладываем бордер на бордер контейнера */
}

.tab-link i {
  font-size: 1.125rem;
}

.tab-link:hover {
  color: var(--p-text-color);
}

.tab-link--active {
  color: var(--p-primary-500);
  border-bottom-color: var(--p-primary-500);
}

/* --- TAB CONTAINER --- */
.tab-container {
  background-color: var(--p-surface-0);
  border: 1px solid var(--p-surface-200);
  border-radius: var(--p-border-radius);
  padding: 2rem;
  min-height: 500px;
}
</style>
