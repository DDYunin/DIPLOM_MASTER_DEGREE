<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { useCourseStore, type CourseFormValues } from '@/entities/course'
import { CourseInfoEditor } from '@/widgets/course-info-editor'
import { useNotifications } from '@/shared/model'

const { t } = useI18n()
const route = useRoute()
const courseStore = useCourseStore()
const notifications = useNotifications()

const courseId = computed(() => route.params.id as string)
const currentCourse = computed(() => courseStore.getCourseById(courseId.value))

onMounted(async () => {
  if (!currentCourse.value) {
    await courseStore.loadCourseById(courseId.value)
  }
})

const handleUpdate = async (updatedData: CourseFormValues) => {
  if (!currentCourse.value) {
    return
  }

  try {
    await courseStore.updateCourse(currentCourse.value.id, updatedData)
    notifications.showToast('success', t('common.success'), t('teacherCourses.courseUpdated'))
  } catch {
    // Toast об ошибке показывает API-клиент
  }
}
</script>

<template>
  <div class="course-main-info-tab">
    <div v-if="currentCourse">
      <CourseInfoEditor
        :initial-data="currentCourse"
        :is-edit-mode="true"
        :is-saving="courseStore.isSaving"
        @save="handleUpdate"
        @cancel="() => undefined"
      />
    </div>
    <div v-else class="loading-state">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
    </div>
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
