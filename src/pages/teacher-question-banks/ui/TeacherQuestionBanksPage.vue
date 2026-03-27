<script setup lang="ts">
import Button from 'primevue/button'
import { QuestionBanksManager } from '@/widgets/question-banks-manager'
</script>

<template>
  <div class="question-banks-page">
    <!-- HEADER -->
    <header class="page-header">
      <div class="header-info">
        <h1 class="page-title">Question Banks</h1>
        <p class="page-subtitle">Manage your assessment categories and questions</p>
      </div>

      <div class="header-actions">
        <Button label="Import" icon="pi pi-upload" severity="secondary" outlined />
        <Button label="Create New Bank" icon="pi pi-plus" />
      </div>
    </header>

    <!-- CONTENT WIDGET -->
    <div class="page-content">
      <QuestionBanksManager />
    </div>
  </div>
</template>

<style scoped>
.question-banks-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.page-title {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: var(--p-text-color);
}

.page-subtitle {
  margin: 0;
  font-size: 1rem;
  color: var(--p-text-muted-color);
}

.header-actions {
  display: flex;
  gap: 1rem;
}
</style>
