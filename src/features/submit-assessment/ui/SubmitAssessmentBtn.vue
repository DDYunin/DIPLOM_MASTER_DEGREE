<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { useAssessmentSessionStore } from '@/entities/assessment-session'
import { useNotifications } from '@/shared/model'

const { t } = useI18n()
const store = useAssessmentSessionStore()
const router = useRouter()
const notifications = useNotifications()

// Состояние для отображения модального окна
const isDialogVisible = ref(false)

// Вычисляем статус заполнения
const isAllAnswered = computed(() => store.progressPercentage === 100)

const unansweredCount = computed(() => {
  if (!store.session) return 0
  const answeredCount = Object.values(store.session.answers).filter(
    (ans) =>
      ans.value !== null &&
      ans.value !== '' &&
      (Array.isArray(ans.value) ? ans.value.length > 0 : true)
  ).length
  return store.totalQuestions - answeredCount
})

// Открытие окна подтверждения
const confirmSubmit = () => {
  isDialogVisible.value = true
}

// Финальная отправка (если юзер нажал "Yes, Submit" внутри модалки)
const executeSubmit = () => {
  isDialogVisible.value = false
  store.stopTimer()

  notifications.showToast('success', t('assessment.submittedTitle'), t('assessment.submittedDetail'))

  if (store.session?.courseId) {
    // Возвращаемся на страницу курса
    router.push({
      name: 'student-course-details',
      params: { id: store.session.courseId }
    })
  } else {
    router.push({ name: 'student-courses' })
  }
}
</script>

<template>
  <!-- Главная кнопка на панели (Question Map) -->
  <Button
    :label="t('assessment.finishSubmit')"
    :severity="isAllAnswered ? 'success' : 'primary'"
    class="submit-btn w-full"
    @click="confirmSubmit"
  />

  <!-- Диалоговое окно подтверждения -->
  <Dialog
    v-model:visible="isDialogVisible"
    modal
    :header="t('assessment.submitTitle')"
    :style="{ width: '450px' }"
    :closable="false"
  >
    <div class="dialog-content">
      <!-- Иконка меняется в зависимости от того, все ли решено -->
      <i
        class="pi"
        :class="
          isAllAnswered ? 'pi-info-circle text-primary' : 'pi-exclamation-triangle text-orange'
        "
        style="font-size: 2.5rem"
      ></i>

      <div class="dialog-text">
        <p v-if="isAllAnswered" class="message-text">
          You have answered all questions. Are you sure you want to submit your assessment?
          <br /><br />
          <span class="muted-text">You won't be able to change your answers after submission.</span>
        </p>

        <p v-else class="message-text">{{ t('assessment.submitBody') }}</p>
      </div>
    </div>

    <!-- Кнопки управления модалкой -->
    <template #footer>
      <Button
        :label="t('assessment.returnTest')"
        icon="pi pi-times"
        text
        severity="secondary"
        @click="isDialogVisible = false"
      />
      <Button
        :label="t('assessment.yesSubmit')"
        icon="pi pi-check"
        :severity="isAllAnswered ? 'primary' : 'danger'"
        @click="executeSubmit"
        autofocus
      />
    </template>
  </Dialog>
</template>

<style scoped>
.submit-btn {
  border-radius: var(--radius-xl);
  font-weight: 600;
  padding: 0.75rem;
}
.w-full {
  width: 100%;
}

/* Стили для контента внутри Dialog */
.dialog-content {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  padding-top: 0.5rem;
}

.text-primary {
  color: var(--color-primary);
}

.text-orange {
  color: var(--color-warning);
}

.dialog-text {
  flex: 1;
}

.message-text {
  margin: 0;
  font-size: 1rem;
  color: var(--text-color);
  line-height: 1.5;
}

.muted-text {
  font-size: 0.875rem;
  color: var(--text-color-muted);
}
</style>
