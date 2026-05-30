<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Question, QuestionType } from '@/entities/question-bank'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Select from 'primevue/select'
import Button from 'primevue/button'
import { useConfirm } from 'primevue/useconfirm'

const { t } = useI18n()
const confirm = useConfirm()

const props = defineProps<{
  questions: Question[]
}>()

const emit = defineEmits<{
  edit: [question: Question]
  delete: [questionId: string]
  'delete-many': [questionIds: string[]]
}>()

const selectedQuestions = ref<Question[]>([])
const searchQuery = ref('')
const selectedType = ref<QuestionType | null>(null)

const types = computed(() => [
  { label: t('bankQuestions.allTypes'), value: null },
  { label: t('bankQuestions.types.single'), value: 'SINGLE' as QuestionType },
  { label: t('bankQuestions.types.multiple'), value: 'MULTIPLE' as QuestionType },
  { label: t('bankQuestions.types.text'), value: 'TEXT' as QuestionType }
])

const getTypeStyles = (type: QuestionType) => {
  switch (type) {
    case 'SINGLE':
      return {
        bg: 'var(--color-primary-muted)',
        color: 'var(--color-primary-text-on-subtle)',
        label: t('bankQuestions.types.single')
      }
    case 'MULTIPLE':
      return {
        bg: 'var(--color-accent-purple-muted)',
        color: 'var(--color-accent-purple-text)',
        label: t('bankQuestions.types.multiple')
      }
    case 'TEXT':
      return {
        bg: 'var(--color-warning-muted)',
        color: 'var(--color-warning-text)',
        label: t('bankQuestions.types.text')
      }
  }
}

const filteredQuestions = computed(() => {
  return props.questions.filter((question) => {
    const matchSearch = question.text.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchType = selectedType.value ? question.type === selectedType.value : true
    return matchSearch && matchType
  })
})

const handleDeleteQuestion = (question: Question) => {
  confirm.require({
    message: t('bankQuestions.deleteConfirm'),
    header: t('common.delete'),
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: t('common.cancel'),
    acceptLabel: t('common.delete'),
    acceptClass: 'p-button-danger',
    accept: () => emit('delete', question.id)
  })
}

const handleDeleteSelected = () => {
  confirm.require({
    message: t('bankQuestions.deleteManyConfirm', { count: selectedQuestions.value.length }),
    header: t('common.delete'),
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: t('common.cancel'),
    acceptLabel: t('common.delete'),
    acceptClass: 'p-button-danger',
    accept: () => {
      emit(
        'delete-many',
        selectedQuestions.value.map((question) => question.id)
      )
      selectedQuestions.value = []
    }
  })
}
</script>

<template>
  <div class="questions-table-widget">
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
      </div>

      <div class="toolbar-right">
        <div v-if="selectedQuestions.length > 0" class="bulk-actions">
          <span class="selected-count">
            {{ t('bankQuestions.selectedCount', { count: selectedQuestions.length }) }}
          </span>
          <Button
            :label="t('common.delete')"
            icon="pi pi-trash"
            severity="danger"
            outlined
            class="bulk-btn bg-red-50"
            @click="handleDeleteSelected"
          />
        </div>
      </div>
    </div>

    <div class="table-container">
      <DataTable
        v-model:selection="selectedQuestions"
        :value="filteredQuestions"
        dataKey="id"
        paginator
        :rows="10"
        class="custom-table"
      >
        <Column selectionMode="multiple" headerStyle="width: 3rem" />

        <Column field="text" :header="t('bankQuestions.columns.text')" style="width: 45%">
          <template #body="{ data }">
            <span class="q-text">{{ data.text }}</span>
          </template>
        </Column>

        <Column field="type" :header="t('bankQuestions.columns.type')" style="width: 18%">
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

        <Column field="points" :header="t('bankQuestions.columns.points')" style="width: 12%">
          <template #body="{ data }">
            <span class="points-cell">{{ data.points }}</span>
          </template>
        </Column>

        <Column :header="t('bankQuestions.columns.actions')" style="width: 15%; text-align: right">
          <template #body="{ data }">
            <Button
              icon="pi pi-pencil"
              text
              rounded
              severity="secondary"
              :aria-label="t('bankQuestions.editQuestion')"
              @click="emit('edit', data)"
            />
            <Button
              icon="pi pi-trash"
              text
              rounded
              severity="danger"
              :aria-label="t('common.delete')"
              @click="handleDeleteQuestion(data)"
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
  width: 180px;
}

.toolbar-right {
  display: flex;
  align-items: center;
}

.bulk-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.selected-count {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-color-muted);
}

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

.q-text {
  font-size: 0.95rem;
  color: var(--text-color);
  font-weight: 500;
  line-height: 1.5;
}

.type-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
}

.points-cell {
  font-weight: 600;
  color: var(--text-color);
}
</style>
