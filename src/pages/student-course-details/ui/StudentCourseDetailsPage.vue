<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'

import { useStudentCourseStore } from '@/entities/course'
import { StudentCourseDetails } from '@/widgets/student-course-details'

const route = useRoute()
const router = useRouter()
const store = useStudentCourseStore()

const activeTab = ref('content')

onMounted(() => {
  const courseId = route.params.id as string
  if (courseId) {
    store.loadCourseDetails(courseId)
  }
})

const goBack = () => {
  router.push({ name: 'student-courses' })
}
</script>

<template>
  <div class="course-page">
    <div v-if="store.isDetailsLoading || !store.currentCourseDetails" class="loading-state">
      <Skeleton height="200px" borderRadius="var(--p-border-radius-xl)" />
      <Skeleton height="500px" borderRadius="var(--p-border-radius-xl)" />
    </div>

    <template v-else>
      <!-- HEADER -->
      <header class="course-header">
        <Button 
          icon="pi pi-arrow-left" 
          label="Back to My Courses" 
          text 
          class="back-btn" 
          @click="goBack" 
        />

        <div class="header-main">
          <div class="header-info">
            <div class="badges">
              <Tag 
                :value="store.currentCourseDetails.status.toUpperCase()" 
                severity="success" 
                rounded 
              />
              <span class="course-code">{{ store.currentCourseDetails.code }}</span>
            </div>
            <h1 class="course-title">{{ store.currentCourseDetails.title }}</h1>
            <p class="course-desc">{{ store.currentCourseDetails.description }}</p>
          </div>

          <div class="header-stats">
            <div class="stat-box">
              <span class="stat-label">GRADE</span>
              <span class="stat-value text-primary">{{ store.currentCourseDetails.gradePercentage }}%</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-box">
              <span class="stat-label">PROGRESS</span>
              <span class="stat-value">{{ store.currentCourseDetails.completedElements }}/{{ store.currentCourseDetails.totalElements }}</span>
            </div>
          </div>
        </div>

        <!-- TABS (Teacher Portal Style) -->
        <nav class="course-tabs">
          <button 
            :class="['tab-btn', { active: activeTab === 'content' }]" 
            @click="activeTab = 'content'"
          >
            Course Content
          </button>
          <button 
            :class="['tab-btn', { active: activeTab === 'grades' }]" 
            @click="activeTab = 'grades'"
          >
            My Grades
          </button>
          <button 
            :class="['tab-btn', { active: activeTab === 'discussion' }]" 
            @click="activeTab = 'discussion'"
          >
            Discussion
          </button>
        </nav>
      </header>

      <!-- CONTENT -->
      <main class="course-content">
        <StudentCourseDetails 
          v-if="activeTab === 'content'" 
          :course="store.currentCourseDetails" 
        />
        <div v-else class="placeholder-tab">
          <p>Content for {{ activeTab }} is coming soon...</p>
        </div>
      </main>
    </template>
  </div>
</template>

<style scoped>
.course-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem 0;
}

.loading-state {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Header */
.course-header {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.back-btn {
  align-self: flex-start;
  padding-left: 0;
  color: var(--p-text-muted-color);
  font-weight: 600;
}

.header-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  flex-wrap: wrap;
}

.header-info {
  flex: 1;
  max-width: 700px;
}

.badges {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.course-code {
  font-weight: 600;
  color: var(--p-text-muted-color);
  letter-spacing: 0.5px;
}

.course-title {
  margin: 0 0 1rem 0;
  font-size: 3rem;
  font-weight: 800;
  color: var(--p-text-color);
  line-height: 1.1;
}

.course-desc {
  margin: 0;
  font-size: 1.125rem;
  color: var(--p-text-muted-color);
  line-height: 1.6;
}

/* Stats Box */
.header-stats {
  display: flex;
  background-color: var(--p-surface-0);
  border: 1px solid var(--p-surface-200);
  border-radius: var(--p-border-radius-xl);
  padding: 1.5rem 2.5rem;
  gap: 2.5rem;
}

.stat-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.stat-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--p-text-muted-color);
  letter-spacing: 1px;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: var(--p-text-color);
}

.stat-divider {
  width: 1px;
  background-color: var(--p-surface-200);
}

/* Tabs (Teacher Style) */
.course-tabs {
  display: flex;
  gap: 2rem;
  border-bottom: 1px solid var(--p-surface-200);
  margin-top: 1rem;
}

.tab-btn {
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 0.75rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--p-text-muted-color);
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: -1px;
}

.tab-btn:hover {
  color: var(--p-text-color);
}

.tab-btn.active {
  color: var(--p-primary-500);
  border-bottom-color: var(--p-primary-500);
}

.placeholder-tab {
  padding: 4rem;
  text-align: center;
  color: var(--p-text-muted-color);
  background-color: var(--p-surface-50);
  border-radius: var(--p-border-radius-xl);
  border: 1px dashed var(--p-surface-200);
}

@media (max-width: 768px) {
  .course-title {
    font-size: 2rem;
  }
  .header-stats {
    width: 100%;
    justify-content: center;
  }
}
</style>