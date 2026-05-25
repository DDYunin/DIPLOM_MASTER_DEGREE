<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCourseGradeStore } from '@/entities/course-grade'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Button from 'primevue/button'
import Select from 'primevue/select'
import Tag from 'primevue/tag'

const { t } = useI18n()
const gradeStore = useCourseGradeStore()
const searchQuery = ref('')

const selectedGroup = ref()
const selectedStatus = ref()
const groups = [
  { label: 'All Groups', value: 'all' },
  { label: 'CS-2023-A', value: 'A' }
]
const statuses = [
  { label: 'All Statuses', value: 'all' },
  { label: 'At Risk', value: 'risk' }
]

// Хелпер для раскраски Total %
const getTotalColor = (percent: number) => {
  if (percent >= 90) return 'var(--color-success-strong)'
  if (percent >= 70) return 'var(--color-warning-strong)'
  return 'var(--color-danger-strong)'
}
</script>

<template>
  <div class="grades-manager">
    <!-- Тулбар: Поиск и Фильтры -->
    <div class="toolbar-section">
      <div class="toolbar-left">
        <IconField iconPosition="left" class="search-field">
          <InputIcon class="pi pi-search" />
          <InputText
            v-model="searchQuery"
            :placeholder="t('courseGrades.searchStudent')"
            class="w-full"
          />
        </IconField>
        <Select
          v-model="selectedGroup"
          :options="groups"
          optionLabel="label"
          :placeholder="t('courseGrades.allGroups')"
          class="filter-dropdown"
        />
        <Select
          v-model="selectedStatus"
          :options="statuses"
          optionLabel="label"
          :placeholder="t('courseGrades.allStatuses')"
          class="filter-dropdown"
        />
      </div>
      <div class="toolbar-right">
        <Button
          :label="t('courseGrades.exportCsv')"
          icon="pi pi-download"
          outlined
          severity="secondary"
        />
        <Button :label="t('courseGrades.addColumn')" icon="pi pi-plus" />
      </div>
    </div>

    <!-- Карточки статистики по оценкам -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon-wrapper bg-blue">
          <i class="pi pi-users text-blue"></i>
        </div>
        <div class="stat-info">
          <span class="stat-label">Class Average</span>
          <div class="stat-value-row">
            <span class="stat-value">84%</span>
            <span class="stat-trend trend-up">+2.1%</span>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-wrapper bg-green">
          <i class="pi pi-check-circle text-green"></i>
        </div>
        <div class="stat-info">
          <span class="stat-label">Submissions Rated</span>
          <span class="stat-value">142/150</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-wrapper bg-yellow">
          <i class="pi pi-exclamation-triangle text-yellow"></i>
        </div>
        <div class="stat-info">
          <span class="stat-label">Pending Grading</span>
          <span class="stat-value">8</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-wrapper bg-red">
          <i class="pi pi-chart-line text-red" style="transform: scaleY(-1)"></i>
        </div>
        <div class="stat-info">
          <span class="stat-label">At Risk Students</span>
          <span class="stat-value">3</span>
        </div>
      </div>
    </div>

    <!-- Таблица Оценок -->
    <div class="table-container">
      <DataTable
        :value="gradeStore.gradebook"
        dataKey="id"
        paginator
        :rows="5"
        class="grades-table"
      >
        <!-- STUDENT NAME -->
        <Column field="student.name" :header="t('courseGrades.columns.name')" style="width: 25%">
          <template #body="{ data }">
            <div class="student-cell">
              <div
                class="avatar"
                :style="{ backgroundColor: data.student.avatarColor, color: 'var(--text-color)' }"
              >
                <!-- Если ID = 2, показываем картинку как на макете у Sarah Smith, либо инициалы -->
                <img
                  v-if="data.id === '2'"
                  src="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
                  alt="avatar"
                />
                <img
                  v-else-if="data.id === '4'"
                  src="https://primefaces.org/cdn/primevue/images/avatar/asiyajavayant.png"
                  alt="avatar"
                />
                <span v-else>{{ data.student.avatarInitials }}</span>
              </div>
              <div class="student-info">
                <span class="student-name">{{ data.student.name }}</span>
                <span class="student-email">{{ data.student.email }}</span>
              </div>
            </div>
          </template>
        </Column>

        <!-- GROUP -->
        <Column field="group" :header="t('courseGrades.columns.group')" style="width: 15%">
          <template #body="{ data }">
            <Tag :value="data.group" class="group-tag" />
          </template>
        </Column>

        <!-- QUIZ 1 -->
        <Column style="width: 10%; text-align: center">
          <template #header>
            <div class="col-header">
              <span>QUIZ 1</span>
              <span class="col-max">MAX 100</span>
            </div>
          </template>
          <template #body="{ data }">
            <span class="grade-text">{{ data.grades.quiz1.score }}</span>
          </template>
        </Column>

        <!-- MIDTERM -->
        <Column style="width: 10%; text-align: center">
          <template #header>
            <div class="col-header">
              <span>MIDTERM</span>
              <span class="col-max">MAX 100</span>
            </div>
          </template>
          <template #body="{ data }">
            <span class="grade-text">{{ data.grades.midterm.score }}</span>
          </template>
        </Column>

        <!-- ESSAY -->
        <Column style="width: 10%; text-align: center">
          <template #header>
            <div class="col-header">
              <span>ESSAY</span>
              <span class="col-max">MAX 50</span>
            </div>
          </template>
          <template #body="{ data }">
            <Tag v-if="data.grades.essay.score === 'Late'" value="Late" class="late-tag" />
            <span v-else class="grade-text">{{ data.grades.essay.score }}</span>
          </template>
        </Column>

        <!-- FINAL -->
        <Column style="width: 10%; text-align: center">
          <template #header>
            <div class="col-header">
              <span>FINAL</span>
              <span class="col-max">MAX 100</span>
            </div>
          </template>
          <template #body="{ data }">
            <span class="grade-text empty-grade">{{ data.grades.final.score }}</span>
          </template>
        </Column>

        <!-- TOTAL % -->
        <Column
          field="totalPercent"
          :header="t('courseGrades.columns.total')"
          style="width: 10%; text-align: center"
        >
          <template #body="{ data }">
            <strong :style="{ color: getTotalColor(data.totalPercent) }">
              {{ data.totalPercent }}%
            </strong>
          </template>
        </Column>

        <!-- ACTIONS -->
        <Column :header="t('common.actions')" style="width: 10%; text-align: center">
          <template #body>
            <Button icon="pi pi-pencil" text rounded severity="secondary" aria-label="Edit Grade" />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<style scoped>
.grades-manager {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* --- TOOLBAR --- */
.toolbar-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.toolbar-left {
  display: flex;
  gap: 1rem;
  flex-grow: 1;
}

.search-field {
  width: 100%;
  max-width: 300px;
}

.filter-dropdown {
  width: 180px;
}

.toolbar-right {
  display: flex;
  gap: 1rem;
}

/* --- STATS GRID --- */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.stat-card {
  background-color: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.stat-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

/* Цвета иконок статистики на основе токенов Aura */
.bg-blue {
  background-color: var(--color-primary-subtle);
}
.text-blue {
  color: var(--color-primary);
}

.bg-green {
  background-color: var(--color-success-subtle);
}
.text-green {
  color: var(--color-success);
}

.bg-yellow {
  background-color: var(--color-caution-subtle);
}
.text-yellow {
  color: var(--color-caution);
}

.bg-red {
  background-color: var(--color-danger-subtle);
}
.text-red {
  color: var(--color-danger);
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-color-muted);
  font-weight: 500;
}

.stat-value-row {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
  line-height: 1;
}

.stat-trend {
  font-size: 0.875rem;
  font-weight: 600;
}
.trend-up {
  color: var(--color-success);
}

/* --- TABLE SECTION --- */
.table-container {
  background-color: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

/* Кастомизация заголовков колонок */
.grades-table :deep(th) {
  background-color: transparent;
  border-bottom: 1px solid var(--surface-border);
  padding: 1.25rem 1rem;
}

.col-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--text-color-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 700;
}

.col-max {
  font-size: 0.65rem;
  font-weight: 500;
  opacity: 0.7;
}

.grades-table :deep(td) {
  border-bottom: 1px solid var(--surface-subtle);
  padding: 1rem;
}

/* Стили ячеек */
.student-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.student-info {
  display: flex;
  flex-direction: column;
}

.student-name {
  font-weight: 600;
  color: var(--text-color);
  font-size: 0.95rem;
}

.student-email {
  font-size: 0.8rem;
  color: var(--text-color-muted);
}

.group-tag {
  background-color: var(--surface-subtle);
  color: var(--text-color);
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

.grade-text {
  font-size: 0.95rem;
  color: var(--text-color);
  font-weight: 500;
}

.empty-grade {
  color: var(--text-color-muted);
}

.late-tag {
  background-color: var(--color-danger-muted);
  color: var(--color-danger-strong);
  font-weight: 700;
}

/* Адаптив */
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  .toolbar-left {
    flex-direction: column;
  }
  .search-field,
  .filter-dropdown {
    width: 100%;
    max-width: none;
  }
}
</style>
