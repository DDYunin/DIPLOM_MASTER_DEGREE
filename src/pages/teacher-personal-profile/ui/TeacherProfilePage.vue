<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { TeacherProfileSettings } from '@/widgets/teacher-profile-settings'

const { t } = useI18n()
</script>

<template>
  <div class="teacher-profile-page">
    <header class="page-header">
      <h1 class="page-title">{{ t('teacherProfile.title') }}</h1>
    </header>

    <main class="page-content">
      <TeacherProfileSettings />
    </main>
  </div>
</template>

<style scoped>
.teacher-profile-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1000px; /* Ограничиваем ширину для лучшей читаемости, как на макете */
  margin: 0 auto;
  width: 100%;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.page-title {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color);
  letter-spacing: -0.5px;
}

.page-subtitle {
  margin: 0;
  font-size: 1rem;
  color: var(--text-color-muted);
}
</style>
