<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Question, Difficulty } from '@/entities/question-bank'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Select from 'primevue/select'
import Button from 'primevue/button'

const { t } = useI18n()

const props = defineProps<{
  questions: Question[]
}>()

const emit = defineEmits<{
  (e: 'edit', question: Question): void
}>()

const selectedQuestions = ref<Question[]>([])
const searchQuery = ref('')
const selectedType = ref()
const selectedDifficulty = ref()

const types = [
  { label: 'All Types', value: null },
  { label: 'Multiple Choice', value: 'multiple-choice' },
  { label: 'True / False', value: 'true-false' },
  { label: 'Short Answer', value: 'short-answer' },
  { label: 'Essay', value: 'essay' }
]

const difficulties = [
  { label: 'All Difficulties', value: null },
  { label: 'Easy', value: 'easy' },
  { label: 'Medium', value: 'medium' },
  { label: 'Hard', value: 'hard' }
]

// Стилизация бейджей типов (по новому макету)
const getTypeStyles = (type: string) => {
  switch (type) {
    case 'multiple-choice':
      return {
        bg: 'var(--color-primary-muted)',
        color: 'var(--color-primary-text-on-subtle)',
        label: t('bankQuestions.types.multipleChoice')
      }
    case 'true-false':
      return {
        bg: 'var(--color-accent-indigo-muted)',
        color: 'var(--color-accent-indigo-text)',
        label: t('bankQuestions.types.trueFalse')
      }
    case 'short-answer':
      return {
        bg: 'var(--color-warning-muted)',
        color: 'var(--color-warning-text)',
        label: t('bankQuestions.types.shortAnswer')
      }
    case 'essay':
      return {
        bg: 'var(--color-accent-purple-muted)',
        color: 'var(--color-accent-purple-text)',
        label: t('bankQuestions.types.essay')
      }
    default:
      return { bg: 'var(--surface-subtle)', color: 'var(--text-color)', label: type }
  }
}

// Стилизация сложности
const getDifficultyColor = (diff: Difficulty) => {
  switch (diff) {
    case 'easy':
      return 'var(--color-success)'
    case 'medium':
      return 'var(--color-caution)'
    case 'hard':
      return 'var(--color-danger)'
    default:
      return 'var(--text-color-muted)'
  }
}

// Фильтрация
const filteredQuestions = computed(() => {
  return props.questions.filter((q) => {
    const matchSearch = q.text.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchType = selectedType.value ? q.type === selectedType.value : true
    const matchDiff = selectedDifficulty.value ? q.difficulty === selectedDifficulty.value : true
    return matchSearch && matchType && matchDiff
  })
})
</script>

<template>
  <div class="questions-table-widget">
    <!-- Тулбар (Поиск, Фильтры, Массовые действия) -->
    <div class="table-toolbar">
      <div class="toolbar-left">
        <IconField iconPosition="left" class="search-field">
          <InputIcon class="pi pi-search" />
          <InputText
            v-model="searchQuery"
            :placeholder="t('bankQuestions.search')"
            class="w-full"
          />
        </IconField>
        <Select
          v-model="selectedType"
          :options="types"
          optionLabel="label"
          optionValue="value"
          :placeholder="t('bankQuestions.type')"
          class="filter-dropdown"
        />
        <Select
          v-model="selectedDifficulty"
          :options="difficulties"
          optionLabel="label"
          optionValue="value"
          :placeholder="t('bankQuestions.difficulty')"
          class="filter-dropdown"
        />
      </div>

      <div class="toolbar-right">
        <!-- Блок массовых действий (появляется только при выборе) -->
        <div v-if="selectedQuestions.length > 0" class="bulk-actions">
          <span class="selected-count">{{ selectedQuestions.length }} Selected</span>
          <Button
            :label="t('common.delete')"
            icon="pi pi-trash"
            severity="danger"
            outlined
            class="bulk-btn bg-red-50"
          />
          <Button
            :label="t('common.move')"
            icon="pi pi-file-export"
            severity="secondary"
            outlined
            class="bulk-btn"
          />
        </div>
      </div>
    </div>

    <!-- Таблица -->
    <div class="table-container">
      <DataTable
        v-model:selection="selectedQuestions"
        :value="filteredQuestions"
        dataKey="id"
        paginator
        :rows="5"
        class="custom-table"
      >
        <!-- Чекбоксы -->
        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

        <!-- Текст вопроса -->
        <Column field="text" :header="t('bankQuestions.columns.text')" style="width: 50%">
          <template #body="{ data }">
            <div class="question-text-cell">
              <!-- Иконка картинки, если вопрос содержит медиа (фейковая логика для макета) -->
              <i v-if="data.hasImage" class="pi pi-image text-muted"></i>
              <span class="q-text" v-html="data.text"></span>
            </div>
          </template>
        </Column>

        <!-- Тип вопроса -->
        <Column field="type" :header="t('bankQuestions.columns.type')" style="width: 20%">
          <template #body="{ data }">
            <span
              class="type-badge"
              :style="{
                backgroundColor: getTypeStyles(data.type).bg,
                color: getTypeStyles(data.type).color
              }"
            >
              {{ getTypeStyles(data.type).label }}
            </span>
          </template>
        </Column>

        <!-- Сложность -->
        <Column field="difficulty" :header="t('bankQuestions.columns.difficulty')" style="width: 15%">
          <template #body="{ data }">
            <div class="difficulty-cell" :style="{ color: getDifficultyColor(data.difficulty) }">
              <i class="pi pi-signal"></i>
              <span class="diff-label capitalize">{{ data.difficulty }}</span>
            </div>
          </template>
        </Column>

        <!-- Действия -->
        <Column :header="t('bankQuestions.columns.actions')" style="width: 10%; text-align: right">
          <template #body="{ data }">
            <Button
              icon="pi pi-pencil"
              text
              rounded
              severity="secondary"
              :aria-label="t('bankQuestions.editQuestion')"
              @click="emit('edit', data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<style scoped>
.questions-table-widget {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* --- TOOLBAR --- */
.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.toolbar-left {
  display: flex;
  gap: 1rem;
  flex-grow: 1;
}

.search-field {
  width: 100%;
  max-width: 350px;
}

.filter-dropdown {
  width: 140px;
}

.toolbar-right {
  display: flex;
  align-items: center;
}

.bulk-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.selected-count {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-color-muted);
}

.bulk-btn {
  padding: 0.5rem 1rem;
}

.bg-red-50 {
  background-color: var(--color-danger-subtle);
}

/* --- TABLE --- */
.table-container {
  background-color: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.custom-table :deep(th) {
  background-color: transparent;
  border-bottom: 1px solid var(--surface-border);
  padding: 1rem;
  font-size: 0.75rem;
  color: var(--text-color-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.custom-table :deep(td) {
  border-bottom: 1px solid var(--surface-subtle);
  padding: 1.25rem 1rem;
}

/* Стили ячеек */
.question-text-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: var(--text-color);
  font-weight: 500;
  line-height: 1.5;
}

.text-muted {
  color: var(--text-color-muted);
}

/* Поддержка инлайн-математики из макета */
.question-text-cell :deep(.math-inline) {
  background-color: var(--surface-subtle);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.85rem;
  color: var(--text-color);
}

.type-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
}

.difficulty-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
}

.capitalize {
  text-transform: capitalize;
}
</style>
