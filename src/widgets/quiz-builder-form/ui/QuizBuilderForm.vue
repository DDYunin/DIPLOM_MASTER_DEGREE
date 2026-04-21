<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useQuestionBankStore } from '@/entities/question-bank'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import DatePicker from 'primevue/datepicker'
import ToggleSwitch from 'primevue/toggleswitch'
import InputNumber from 'primevue/inputnumber'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'

const props = defineProps<{
  initialData?: any // Если передано - режим редактирования
}>()

const emit = defineEmits<{
  (e: 'save-draft', data: any): void
  (e: 'publish', data: any): void
}>()

const bankStore = useQuestionBankStore()

// --- СОСТОЯНИЕ ФОРМЫ ---
const title = ref('')
const instructions = ref('')
const dueDate = ref<Date | null>(null)
const timeLimit = ref<number | null>(60)
const shuffleQuestions = ref(true)
const showResults = ref(false)

// Локальный стейт для конструктора (маппинг банков с их настройками для этого теста)
const bankConfigs = ref<any[]>([{
	title: 'Bank 1',
	description: 'Some description of bank 1',
	isSelected: false,
	availableQs: 10,
	pointsPerQ: 5
}])

const totalPoints = ref(0)
const totalQuestions = ref(0)
const collectFormData = () => {}
</script>

<template>
  <div class="quiz-builder-layout">
    <!-- ЛЕВАЯ КОЛОНКА: Настройки и Конструктор -->
    <div class="builder-main">
      <!-- 1. General Information -->
      <section class="builder-card">
        <div class="card-header">
          <i class="pi pi-list header-icon"></i>
          <h3 class="card-title">General Information</h3>
        </div>

        <div class="card-body">
          <div class="field-group">
            <label class="field-label">Assessment Title</label>
            <InputText
              v-model="title"
              placeholder="e.g. Midterm Exam: Data Structures"
              class="w-full"
            />
          </div>

          <div class="field-group mt-4">
            <label class="field-label">Instructions for Students</label>
            <Textarea
              v-model="instructions"
              rows="4"
              placeholder="Enter instructions, time limits, or allowed materials..."
              class="w-full text-area"
            />
            <small class="field-hint">Markdown is supported.</small>
          </div>
        </div>
      </section>

      <!-- 2. Test Constructor -->
      <section class="builder-card mt-5">
        <div class="card-header flex-between">
          <div class="flex-align-center">
            <i class="pi pi-question-circle header-icon text-blue"></i>
            <h3 class="card-title">Test Constructor</h3>
          </div>
          <Button label="Create New Question Bank" icon="pi pi-plus" text size="small" />
        </div>

        <div class="card-body">
          <div class="banks-list">
            <!-- Цикл по банкам вопросов -->
            <div
              v-for="bank in bankConfigs"
              :key="bank.id"
              class="bank-item"
              :class="{ 'bank-item--active': bank.isSelected }"
            >
              <div class="bank-item-header">
                <div class="flex-align-center gap-3">
                  <Checkbox v-model="bank.isSelected" :binary="true" />
                  <div>
                    <h4 class="bank-title">{{ bank.title }}</h4>
                    <p class="bank-desc">{{ bank.description }}</p>
                  </div>
                </div>
                <!-- Бейдж доступных вопросов -->
                <span class="badge-green">{{ bank.availableQs }} Qs Available</span>
              </div>

              <!-- Настройки выборки (показываются только если банк выбран) -->
              <div v-if="bank.isSelected" class="bank-item-settings">
                <div class="settings-inputs">
                  <div class="setting-field">
                    <label>Draw Randomly</label>
                    <div class="flex-align-center gap-2">
                      <InputNumber
                        v-model="bank.drawCount"
                        :min="0"
                        :max="bank.availableQs"
                        inputClass="w-20"
                      />
                      <span class="text-muted">questions</span>
                    </div>
                  </div>
                  <div class="setting-field">
                    <label>Points per Question</label>
                    <div class="flex-align-center gap-2">
                      <InputNumber v-model="bank.pointsPerQ" :min="0" inputClass="w-20" />
                      <span class="text-muted">pts</span>
                    </div>
                  </div>
                </div>
                <div class="setting-total">
                  Total: {{ (bank.drawCount || 0) * (bank.pointsPerQ || 0) }} pts
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- ПРАВАЯ КОЛОНКА: Сайдбар (Сводка и Параметры) -->
    <aside class="builder-sidebar">
      <!-- Summary Card -->
      <section class="builder-card">
        <div class="card-header">
          <h3 class="card-title">Assessment Summary</h3>
        </div>
        <div class="card-body summary-body">
          <div class="summary-row">
            <span>Total Questions</span>
            <strong class="text-xl">{{ totalQuestions }}</strong>
          </div>
          <div class="summary-row">
            <span>Total Points</span>
            <strong class="text-xl text-blue">{{ totalPoints }}</strong>
          </div>
          <div class="summary-row">
            <span>Est. Duration</span>
            <strong>~{{ timeLimit || 0 }} mins</strong>
          </div>

          <div class="summary-actions mt-4">
            <Button
              label="Publish Assessment"
              class="w-full"
              @click="$emit('publish', collectFormData())"
            />
          </div>
        </div>
      </section>

      <!-- Parameters Card -->
      <section class="builder-card mt-5">
        <div class="card-header">
          <h3 class="card-title text-sm text-muted uppercase tracking-wide">Parameters</h3>
        </div>
        <div class="card-body params-body">
          <div class="field-group">
            <label class="field-label">Due Date</label>
            <DatePicker v-model="dueDate" showIcon placeholder="mm/dd/yyyy, --:--" class="w-full" />
          </div>

          <div class="field-group mt-4">
            <label class="field-label">Time Limit (Minutes)</label>
            <IconField iconPosition="left">
              <InputIcon class="pi pi-clock" />
              <InputNumber
                v-model="timeLimit"
                placeholder="60"
                class="w-full"
                inputClass="w-full"
              />
            </IconField>
          </div>

          <div class="divider"></div>

          <div class="toggle-row">
            <label>Shuffle Questions</label>
            <ToggleSwitch v-model="shuffleQuestions" />
          </div>

          <div class="toggle-row mt-4">
            <label>Show Results Instantly</label>
            <ToggleSwitch v-model="showResults" />
          </div>
        </div>
      </section>
    </aside>
  </div>
</template>

<style scoped>
.quiz-builder-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 2rem;
  align-items: start;
}

@media (max-width: 1024px) {
  .quiz-builder-layout {
    grid-template-columns: 1fr;
  }
}

/* --- CARDS COMMON --- */
.builder-card {
  background-color: var(--p-surface-0);
  border: 1px solid var(--p-surface-200);
  border-radius: var(--p-border-radius);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--p-surface-100);
}

.header-icon {
  font-size: 1.25rem;
  color: var(--p-primary-500);
}

.text-blue {
  color: var(--p-blue-600);
}

.card-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--p-text-color);
}

.card-body {
  padding: 1.5rem;
}

/* --- TYPOGRAPHY & UTILS --- */
.text-sm {
  font-size: 0.875rem;
}
.text-xl {
  font-size: 1.25rem;
}
.text-muted {
  color: var(--p-text-muted-color);
}
.uppercase {
  text-transform: uppercase;
}
.tracking-wide {
  letter-spacing: 0.5px;
}
.w-full {
  width: 100%;
}
.mt-4 {
  margin-top: 1rem;
}
.mt-5 {
  margin-top: 1.5rem;
}
.gap-2 {
  gap: 0.5rem;
}
.gap-3 {
  gap: 0.75rem;
}
.flex-align-center {
  display: flex;
  align-items: center;
}
.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.divider {
  height: 1px;
  background-color: var(--p-surface-200);
  margin: 1.5rem 0;
}

/* --- FORMS --- */
.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.field-label {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--p-text-color);
}
.field-hint {
  font-size: 0.75rem;
  color: var(--p-text-muted-color);
  margin-top: 0.25rem;
}
.text-area {
  resize: vertical;
}
.w-20 {
  width: 4rem;
  text-align: center;
}

/* --- BANKS CONSTRUCTOR --- */
.banks-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.bank-item {
  border: 1px solid var(--p-surface-200);
  border-radius: var(--p-border-radius);
  transition:
    border-color 0.2s,
    background-color 0.2s;
  overflow: hidden;
}

.bank-item--active {
  border-color: var(--p-primary-300);
  background-color: var(--p-primary-50);
}

.bank-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
}

.bank-title {
  margin: 0 0 0.25rem 0;
  font-weight: 600;
  color: var(--p-text-color);
}
.bank-desc {
  margin: 0;
  font-size: 0.875rem;
  color: var(--p-text-muted-color);
}

.badge-green {
  background-color: var(--p-green-100);
  color: var(--p-green-700);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
}

.bank-item-settings {
  border-top: 1px solid var(--p-surface-200);
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  background-color: var(--p-surface-0);
}

.settings-inputs {
  display: flex;
  gap: 2rem;
}

.setting-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.setting-field label {
  font-size: 0.75rem;
  color: var(--p-text-muted-color);
  font-weight: 500;
}

.setting-total {
  font-weight: 700;
  color: var(--p-text-color);
}

/* --- SIDEBAR SUMMARY & PARAMS --- */
.summary-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--p-text-muted-color);
  font-size: 0.875rem;
}

.summary-row strong {
  color: var(--p-text-color);
}

.toggle-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toggle-row label {
  font-weight: 500;
  color: var(--p-text-color);
  font-size: 0.875rem;
}
</style>
