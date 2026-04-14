<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import { useAssessmentSessionStore } from '@/entities/assessment-session'
import { useNotifications } from '@/shared/model' // Ваш хук уведомлений

const store = useAssessmentSessionStore()
const router = useRouter()
const notifications = useNotifications()

const isAllAnswered = computed(() => store.progressPercentage === 100)

const handleSubmit = async () => {
  if (!isAllAnswered.value) {
    const confirmSubmit = confirm('You have unanswered questions. Are you sure you want to submit?')
    if (!confirmSubmit) {
      return
    }
  }

  // Остановка таймера и "отправка" на сервер
  store.stopTimer()
  notifications.showToast(
    'success',
    'Submitted!',
    'Your assessment has been submitted successfully.'
  )

  // Возврат на страницу курса
  if (store.session?.assessmentId) {
    router.push({ name: 'student-courses' })
  }
}
</script>

<template>
  <Button
    label="Finish and Submit"
    :severity="isAllAnswered ? 'success' : 'primary'"
    class="submit-btn w-full"
    @click="handleSubmit"
  />
</template>

<style scoped>
.submit-btn {
  border-radius: var(--p-border-radius-xl);
  font-weight: 600;
  padding: 0.75rem;
}
.w-full {
  width: 100%;
}
</style>
