<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCourseStore } from '@/entities/course'
import { CourseInfoEditor } from '@/widgets/course-info-editor'

const route = useRoute()
const courseStore = useCourseStore()

const courseId = computed(() => route.params.id as string)
const currentCourse = computed(() => courseStore.getCourseById(courseId.value))

const handleUpdate = async (updatedData: any) => {
  if (currentCourse.value) {
    // Вызываем PATCH-запрос через стор
    await courseStore.updateCourse(currentCourse.value.id, updatedData)
  }
}

const handleCancel = () => {
  // Для таба редактирования "Cancel" может просто сбрасывать форму или ничего не делать
  console.log('Edit cancelled')
}
</script>

<template>
  <div class="course-main-info-tab">
    <div v-if="currentCourse">
      <CourseInfoEditor
        :initial-data="currentCourse"
        :is-edit-mode="true"
        @save="handleUpdate"
        @cancel="handleCancel"
      />
    </div>
    <div v-else class="loading-state">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
    </div>
  </div>
</template>

<style scoped>
.course-main-info-tab {
  /* Форма и так имеет нужные отступы из виджета */
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 4rem;
  color: var(--p-text-muted-color);
}
</style>
