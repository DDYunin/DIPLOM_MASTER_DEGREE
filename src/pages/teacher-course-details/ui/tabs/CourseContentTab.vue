<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { CourseContentEditor } from '@/widgets/course-content-editor'
import { useCourseContentStore } from '@/entities/course-content'

const route = useRoute()
const contentStore = useCourseContentStore()

const courseId = computed(() => route.params.id as string)

onMounted(async () => {
  if (contentStore.courseId !== courseId.value) {
    await contentStore.loadCourseContent(courseId.value)
  }
})
</script>

<template>
  <div class="course-content-tab">
    <div v-if="contentStore.isLoading" class="loading-state">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
    </div>
    <CourseContentEditor v-else :course-id="courseId" />
  </div>
</template>

<style scoped>
.loading-state {
  display: flex;
  justify-content: center;
  padding: 4rem;
  color: var(--text-color-muted);
}
</style>
