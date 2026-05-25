<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { StudentProfileInfo } from '@/widgets/student-profile-info'

const { t } = useI18n()
</script>

<template>
  <div class="student-profile-page">
    <header class="page-header">
      <h1 class="page-title">{{ t('studentProfile.title') }}</h1>
    </header>

    <main class="page-content">
      <StudentProfileInfo />
    </main>
  </div>
</template>

<style scoped>
.student-profile-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem 0;
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
}

.page-subtitle {
  margin: 0;
  font-size: 1rem;
  color: var(--text-color-muted);
}
</style>
