<script setup lang="ts">
import { ref, onMounted } from 'vue'

import Button from 'primevue/button'

import { QuestionBanksManager } from '@/widgets/question-banks-manager'
import { ImportQuestionBankModal } from '@/features/import-question-bank'
import { CreateQuestionBankModal } from '@/features/create-question-bank'
import { useQuestionBankStore } from '@/entities/question-bank'
import { useNotifications } from '@/shared/model'

const bankStore = useQuestionBankStore()
const notifications = useNotifications()

const isImportModalVisible = ref(false)
const isCreateModalVisible = ref(false)

const handleImportSuccess = () => {
  // Здесь можно показать Toast "Успешно импортировано"
  console.log('Bank successfully imported!')
}

// 2. ОБРАБОТЧИК СОЗДАНИЯ
const handleCreateBank = (data: { title: string; description: string }) => {
  // Вызываем твой готовый метод из стора
  debugger
  bankStore.createBank(data)

  // При желании здесь можно вызвать Toast "Bank created successfully"
  notifications.showToast('success', 'Bank list updated', `Bank created successfully`)
}

onMounted(async () => {
  // Загружаем банки с "бэкенда", если они еще не загружены
  if (bankStore.banks.length === 0) {
    await bankStore.loadBanks()
  }
  // Сбрасываем выделение банка, чтобы справа показывался стартовый экран (Empty State)
  bankStore.clearSelection()
})
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
        <Button
          label="Import"
          icon="pi pi-upload"
          severity="secondary"
          outlined
          @click="isImportModalVisible = true"
        />
        <Button label="Create New Bank" icon="pi pi-plus" @click="isCreateModalVisible = true" />
      </div>
    </header>

    <!-- CONTENT WIDGET -->
    <div class="page-content">
      <QuestionBanksManager @create-bank="isCreateModalVisible = true" />
    </div>

    <!-- Внедряем компонент фичи в корень страницы -->
    <ImportQuestionBankModal
      v-model:visible="isImportModalVisible"
      @success="handleImportSuccess"
    />

    <CreateQuestionBankModal v-model:visible="isCreateModalVisible" @create="handleCreateBank" />
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
