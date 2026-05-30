<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import Button from 'primevue/button'

import {
  QuestionBanksManager,
  useQuestionBanksManagerStore
} from '@/widgets/question-banks-manager'
import { ImportQuestionBankModal } from '@/features/import-question-bank'
import { CreateQuestionBankModal } from '@/features/create-question-bank'
import { useNotifications } from '@/shared/model'

const { t, locale } = useI18n()
const widgetStore = useQuestionBanksManagerStore()
const notifications = useNotifications()

const isImportModalVisible = ref(false)
const isCreateModalVisible = ref(false)

const handleImportSuccess = () => {
  console.log('Bank successfully imported!')
}

const handleCreateBank = async (data: { title: string; description: string }) => {
  try {
    await widgetStore.createNewBank(data, locale.value)
    notifications.showToast('success', t('common.success'), t('teacherQuestionBanks.bankCreated'))
  } catch {
    // Toast об ошибке показывает API-клиент
  }
}

onMounted(async () => {
  if (widgetStore.bankIds.length === 0) {
    try {
      await widgetStore.loadBanks(locale.value)
    } catch {
      // Toast об ошибке показывает API-клиент
    }
  }

  widgetStore.clearSelection()
})
</script>

<template>
  <div class="question-banks-page">
    <header class="page-header">
      <div class="header-info">
        <h1 class="page-title">{{ t('teacherQuestionBanks.title') }}</h1>
        <p class="page-subtitle">{{ t('teacherQuestionBanks.subtitle') }}</p>
      </div>

      <div class="header-actions">
        <Button
          :label="t('teacherQuestionBanks.import')"
          icon="pi pi-upload"
          severity="secondary"
          outlined
          @click="isImportModalVisible = true"
        />
        <Button
          :label="t('teacherQuestionBanks.createBank')"
          icon="pi pi-plus"
          @click="isCreateModalVisible = true"
        />
      </div>
    </header>

    <div class="page-content">
      <QuestionBanksManager @create-bank="isCreateModalVisible = true" />
    </div>

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
  color: var(--text-color);
}

.page-subtitle {
  margin: 0;
  font-size: 1rem;
  color: var(--text-color-muted);
}

.header-actions {
  display: flex;
  gap: 1rem;
}
</style>
