<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { useCourseStore } from '@/entities/course'
import { useCourseContentStore } from '@/entities/course-content'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

const { t } = useI18n()
const route = useRoute()
const courseStore = useCourseStore()
const contentStore = useCourseContentStore()

const courseId = computed(() => route.params.id as string)
const course = computed(() => courseStore.getCourseById(courseId.value))

onMounted(async () => {
  if (!course.value) {
    await courseStore.loadCourseById(courseId.value)
  }
})

onUnmounted(() => {
  contentStore.reset()
})

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
    <header class="page-header">
      <div class="header-top">
        <Button
          icon="pi pi-arrow-left"
          text
          rounded
          severity="secondary"
          @click="$router.push({ name: 'teacher-courses' })"
          :aria-label="t('teacherCourses.backToCourses')"
        />
        <div v-if="course" class="title-wrapper">
          <h1 class="page-title">{{ course.code }}: {{ course.title }}</h1>
          <Tag :value="course.status" :severity="getStatusSeverity(course.status)" />
        </div>
        <div v-else class="title-wrapper">
          <h1 class="page-title">{{ t('teacherCourses.loadingCourse') }}</h1>
        </div>
      </div>
    </header>

    <nav class="tabs-navigation">
      <router-link
        :to="{ name: 'course-main-info' }"
        class="tab-link"
        active-class="tab-link--active"
      >
        <i class="pi pi-info-circle"></i> {{ t('teacherCourses.tabs.mainInfo') }}
      </router-link>
      <router-link
        :to="{ name: 'course-content' }"
        class="tab-link"
        active-class="tab-link--active"
      >
        <i class="pi pi-file-edit"></i> {{ t('teacherCourses.tabs.content') }}
      </router-link>
      <router-link
        :to="{ name: 'course-participants' }"
        class="tab-link"
        active-class="tab-link--active"
      >
        <i class="pi pi-users"></i> {{ t('teacherCourses.tabs.participants') }}
      </router-link>
      <router-link :to="{ name: 'course-grades' }" class="tab-link" active-class="tab-link--active">
        <i class="pi pi-chart-bar"></i> {{ t('teacherCourses.tabs.grades') }}
      </router-link>
    </nav>

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
  color: var(--text-color);
  margin: 0;
}

.tabs-navigation {
  display: flex;
  gap: 2rem;
  border-bottom: 1px solid var(--surface-border);
  margin-bottom: 2rem;
}

.tab-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0;
  color: var(--text-color-muted);
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  margin-bottom: -1px;
}

.tab-link i {
  font-size: 1.125rem;
}

.tab-link:hover {
  color: var(--text-color);
}

.tab-link--active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.tab-container {
  background-color: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  padding: 2rem;
  min-height: 500px;
}
</style>
