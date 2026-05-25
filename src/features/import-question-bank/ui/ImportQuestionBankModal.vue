<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'
import Stepper from 'primevue/stepper'
import StepList from 'primevue/steplist'
import Step from 'primevue/step'
import StepPanels from 'primevue/steppanels'
import StepPanel from 'primevue/steppanel'
import Button from 'primevue/button'
import ProgressBar from 'primevue/progressbar'

// Управление видимостью через v-model
const { t } = useI18n()

const visible = defineModel<boolean>('visible', { default: false })

const emit = defineEmits<{
  (e: 'success'): void
}>()

// Состояние импорта
const isUploading = ref(false)
const selectedFile = ref<File | null>(null)

// Имитация выбора файла
const handleFileUpload = (activateCallback: (val: string) => void) => {
  // В реальности здесь input type="file"
  selectedFile.value = new File(['mock content'], 'biology_quiz_export.csv', { type: 'text/csv' })
  isUploading.value = true

  // Имитация задержки парсинга
  setTimeout(() => {
    isUploading.value = false
    activateCallback('2') // Переходим на Шаг 2
  }, 1500)
}

const finishImport = () => {
  // Здесь будет вызов action из стора для сохранения
  visible.value = false
  emit('success')

  // Сбрасываем состояние для следующих открытий
  setTimeout(() => {
    selectedFile.value = null
  }, 300)
}
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="t('modals.importBank.title')"
    :style="{ width: '600px' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <div class="import-wizard">
      <!-- PrimeVue v4 Stepper -->
      <Stepper value="1">
        <!-- Навигация по шагам -->
        <StepList>
          <Step value="1">{{ t('modals.importBank.upload') }}</Step>
          <Step value="2">{{ t('modals.importBank.preview') }}</Step>
          <Step value="3">{{ t('modals.importBank.complete') }}</Step>
        </StepList>

        <!-- Контент шагов -->
        <StepPanels>
          <!-- ШАГ 1: Загрузка файла -->
          <StepPanel v-slot="{ activateCallback }" value="1">
            <div class="step-content flex-column-center">
              <div
                v-if="!isUploading"
                class="upload-zone"
                @click="handleFileUpload(activateCallback)"
              >
                <i class="pi pi-cloud-upload upload-icon"></i>
                <h4 class="upload-title">Click or drag file to this area to upload</h4>
                <p class="upload-desc">
                  Support for a single or bulk upload. Strictly prohibit from uploading company data
                  or other band files.
                </p>
                <div class="format-badges">
                  <span class="format-badge">.CSV</span>
                  <span class="format-badge">.JSON</span>
                  <span class="format-badge">Aiken</span>
                </div>
              </div>

              <!-- Состояние загрузки (фейковое) -->
              <div v-else class="uploading-state">
                <i class="pi pi-spin pi-spinner text-primary text-4xl mb-3"></i>
                <p class="text-muted">{{ t('modals.importBank.parsing') }}</p>
                <ProgressBar mode="indeterminate" style="height: 6px; width: 100%" />
              </div>
            </div>
            <div class="step-actions justify-end">
              <Button
                :label="t('common.cancel')"
                severity="secondary"
                outlined
                @click="visible = false"
              />
            </div>
          </StepPanel>

          <!-- ШАГ 2: Превью данных -->
          <StepPanel v-slot="{ activateCallback }" value="2">
            <div class="step-content">
              <div class="preview-header">
                <i class="pi pi-file-excel file-icon"></i>
                <div class="file-info">
                  <span class="file-name">{{ selectedFile?.name }}</span>
                  <span class="file-size">14 KB</span>
                </div>
              </div>

              <div class="stats-grid">
                <div class="stat-box">
                  <span class="stat-label">Total Questions Found</span>
                  <span class="stat-value text-primary">24</span>
                </div>
                <div class="stat-box">
                  <span class="stat-label">Multiple Choice</span>
                  <span class="stat-value">18</span>
                </div>
                <div class="stat-box">
                  <span class="stat-label">True / False</span>
                  <span class="stat-value">6</span>
                </div>
                <div class="stat-box error-box">
                  <span class="stat-label">Formatting Errors</span>
                  <span class="stat-value text-red">0</span>
                </div>
              </div>

              <div class="mapping-hint">
                <i class="pi pi-info-circle"></i>
                <span
                  >All columns matched successfully. The bank will be named
                  <strong>"Imported Bank"</strong> by default.</span
                >
              </div>
            </div>

            <div class="step-actions justify-between">
              <Button
                :label="t('common.back')"
                severity="secondary"
                outlined
                icon="pi pi-arrow-left"
                @click="activateCallback('1')"
              />
              <Button
                :label="t('modals.importBank.importData')"
                icon="pi pi-check"
                @click="activateCallback('3')"
              />
            </div>
          </StepPanel>

          <!-- ШАГ 3: Успешное завершение -->
          <StepPanel value="3">
            <div class="step-content flex-column-center success-step">
              <div class="success-icon-wrapper">
                <i class="pi pi-check success-icon"></i>
              </div>
              <h3 class="success-title">Import Successful!</h3>
              <p class="success-desc">24 questions have been added to your new question bank.</p>
            </div>
            <div class="step-actions justify-end">
              <Button :label="t('common.finish')" @click="finishImport" />
            </div>
          </StepPanel>
        </StepPanels>
      </Stepper>
    </div>
  </Dialog>
</template>

<style scoped>
.import-wizard {
  margin-top: 1rem;
}

.step-content {
  min-height: 250px;
  padding: 2rem 0;
}

.step-actions {
  display: flex;
  padding-top: 1rem;
  border-top: 1px solid var(--surface-border);
}

.justify-end {
  justify-content: flex-end;
}
.justify-between {
  justify-content: space-between;
}
.flex-column-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

/* --- Upload Zone (Step 1) --- */
.upload-zone {
  border: 2px dashed var(--surface-border-strong);
  border-radius: var(--radius-md);
  padding: 3rem 2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: var(--surface-ground);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.upload-zone:hover {
  border-color: var(--color-primary-focus);
  background-color: var(--color-primary-subtle);
}

.upload-icon {
  font-size: 3rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
}

.upload-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
}

.upload-desc {
  font-size: 0.875rem;
  color: var(--text-color-muted);
  max-width: 400px;
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
}

.format-badges {
  display: flex;
  gap: 0.5rem;
}

.format-badge {
  background-color: var(--surface-border);
  color: var(--text-color);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.uploading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 300px;
}

.text-primary {
  color: var(--color-primary);
}
.text-muted {
  color: var(--text-color-muted);
  margin-bottom: 1rem;
}
.text-4xl {
  font-size: 2.5rem;
}
.mb-3 {
  margin-bottom: 1rem;
}

/* --- Preview Zone (Step 2) --- */
.preview-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: var(--surface-ground);
  border: 1px solid var(--surface-border);
  padding: 1rem;
  border-radius: var(--radius-md);
  margin-bottom: 1.5rem;
}

.file-icon {
  font-size: 2rem;
  color: var(--color-success);
}

.file-info {
  display: flex;
  flex-direction: column;
}

.file-name {
  font-weight: 600;
  color: var(--text-color);
}

.file-size {
  font-size: 0.875rem;
  color: var(--text-color-muted);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-box {
  background-color: var(--surface-card);
  border: 1px solid var(--surface-border);
  padding: 1rem;
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.error-box {
  background-color: var(--color-danger-subtle);
  border-color: var(--color-danger-border);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-color-muted);
  font-weight: 500;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
}

.text-red {
  color: var(--color-danger);
}

.mapping-hint {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-primary-text-on-subtle);
  background-color: var(--color-primary-subtle);
  padding: 1rem;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
}

/* --- Success Zone (Step 3) --- */
.success-step {
  padding-top: 1rem;
}

.success-icon-wrapper {
  width: 72px;
  height: 72px;
  background-color: var(--color-success-muted);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.success-icon {
  font-size: 2.5rem;
  color: var(--color-success-strong);
}

.success-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
}

.success-desc {
  color: var(--text-color-muted);
  margin: 0;
}
</style>
