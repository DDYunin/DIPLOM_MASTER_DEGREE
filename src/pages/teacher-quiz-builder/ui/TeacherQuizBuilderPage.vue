<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import { QuizBuilderForm, useQuizBuilderStore } from '@/widgets/quiz-builder-form'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const builderStore = useQuizBuilderStore() // Подключаем локальный стор формы

// Получаем ID курса и опциональный ID темы из URL
const courseId = computed(() => route.params.id as string)
const isEditMode = computed(() => !!route.query.editId)

// ЖИЗНЕННЫЙ ЦИКЛ СТРАНИЦЫ
onMounted(async () => {
  // Передаем editId (если есть), чтобы стор сам решил: создавать или редактировать
  await builderStore.initBuilder(route.query.editId)
})

onUnmounted(() => {
  // Очищаем форму при уходе со страницы, чтобы не было утечек памяти!
  builderStore.resetBuilder()
})

const goBack = () => {
  router.push({ name: 'teacher-course-details', params: { id: courseId.value } })
}

// Обработчики, которые ты вызовешь из виджета
const handleSaveDraft = (data: any) => {
  console.log('Saving draft...', data)
  goBack()
}

const handlePublish = (data: any) => {
  console.log('Publishing quiz...', data)
  goBack()
}

const save = () => {}
</script>

<template>
  <div class="quiz-builder-page">
    <!-- Шапка страницы -->
    <header class="page-header">
      <div class="header-left">
        <!-- Хлебные крошки -->
        <nav class="breadcrumbs">
          <a href="#" class="crumb">{{ t('teacherQuiz.courses') }}</a>
          <span class="separator">/</span>
          <a href="#" class="crumb" @click.prevent="goBack">CS-101</a>
          <span class="separator">/</span>
          <span class="crumb active">{{
            isEditMode ? t('teacherQuiz.editAssessment') : t('teacherQuiz.newAssessment')
          }}</span>
        </nav>

        <div class="title-row">
          <h1 class="page-title">{{
            isEditMode ? t('teacherQuiz.editAssessment') : t('teacherQuiz.newAssessment')
          }}</h1>
          <Tag value="Draft" severity="warning" class="status-badge" />
        </div>
        <p class="page-subtitle">{{ t('teacherQuiz.subtitle') }}</p>
      </div>

      <div class="header-right">
        <Button :label="t('teacherQuiz.saveDraft')" icon="pi pi-save" @click="save" />
      </div>
    </header>

    <!-- Вызов виджета формы -->
    <main class="page-content">
      <QuizBuilderForm
        :initial-data="isEditMode ? {} : null"
        @save-draft="handleSaveDraft"
        @publish="handlePublish"
      />
    </main>
  </div>
</template>

<style scoped>
.quiz-builder-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* --- HEADER --- */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--surface-border);
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Хлебные крошки */
.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.crumb {
  color: var(--text-color-muted);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.crumb:hover {
  color: var(--color-primary);
}
.crumb.active {
  color: var(--text-color);
  font-weight: 600;
  pointer-events: none;
}
.separator {
  color: var(--icon-muted);
}

.title-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.page-title {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color);
  letter-spacing: -0.5px;
}

.status-badge {
  background-color: var(--color-caution-muted);
  color: var(--color-caution-text);
  font-weight: 700;
}

.page-subtitle {
  margin: 0;
  font-size: 1rem;
  color: var(--text-color-muted);
}

.header-right {
  display: flex;
  align-items: center;
}

.mr-3 {
  margin-right: 1rem;
}
</style>
