<script setup lang="ts">
import { ref } from 'vue'
import { useCourseParticipantStore } from '@/entities/course-participant'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Button from 'primevue/button'
import Select from 'primevue/select'

const participantStore = useCourseParticipantStore()
const searchQuery = ref('')

// Данные для формы добавления
const selectedInstitute = ref()
const selectedGroup = ref()
const institutes = [
  { label: 'Engineering', value: 'eng' },
  { label: 'Science', value: 'sci' }
]
const groups = [
  { label: 'CS-2023-A', value: 'csa' },
  { label: 'CS-2023-B', value: 'csb' }
]
</script>

<template>
  <div class="participants-manager">
    <!-- Верхние карточки статистики -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-header"><i class="pi pi-users"></i> Total Students</div>
        <div class="stat-value">{{ participantStore.totalStudents }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-header"><i class="pi pi-book"></i> Active Groups</div>
        <div class="stat-value">{{ participantStore.activeGroups }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-header"><i class="pi pi-chair"></i> Seats Available</div>
        <div class="stat-value">8</div>
      </div>
      <div class="stat-card">
        <div class="stat-header"><i class="pi pi-chart-line"></i> Avg. Attendance</div>
        <div class="stat-value">95%</div>
      </div>
    </div>

    <!-- Основная таблица студентов -->
    <div class="table-section">
      <div class="table-header-custom">
        <h3 class="section-title">Enrolled Students</h3>
        <IconField iconPosition="left" class="search-field">
          <InputIcon class="pi pi-search" />
          <InputText v-model="searchQuery" placeholder="Search by name or group..." />
        </IconField>
      </div>

      <DataTable
        :value="participantStore.participants"
        dataKey="id"
        paginator
        :rows="5"
        class="custom-table"
        pt:headerRow:style="background-color: var(--p-surface-50);"
      >
        <!-- Колонка: Студент -->
        <Column field="name" header="STUDENT NAME (F.I.O.)" style="width: 30%">
          <template #body="{ data }">
            <div class="student-cell">
              <div
                class="avatar"
                :style="{ backgroundColor: data.avatarColor, color: 'var(--p-text-color)' }"
              >
                <!-- Если есть фото, выводим img, иначе инициалы -->
                <span v-if="data.id !== '2'">{{ data.avatarInitials }}</span>
                <img
                  v-else
                  src="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
                  alt="avatar"
                />
              </div>
              <span class="student-name">{{ data.name }}</span>
            </div>
          </template>
        </Column>

        <!-- Колонка: Группа -->
        <Column field="group" header="GROUP" style="width: 20%">
          <template #body="{ data }">
            <span class="text-muted">{{ data.group }}</span>
          </template>
        </Column>

        <!-- Колонка: Институт -->
        <Column field="institute" header="INSTITUTE" style="width: 20%">
          <template #body="{ data }">
            <span class="text-muted">{{ data.institute }}</span>
          </template>
        </Column>

        <!-- Колонка: Дата зачисления -->
        <Column field="enrollmentDate" header="ENROLLMENT DATE" style="width: 20%">
          <template #body="{ data }">
            <span class="text-muted">{{ data.enrollmentDate }}</span>
          </template>
        </Column>

        <!-- Колонка: Действия -->
        <Column header="ACTIONS" style="width: 10%; text-align: center">
          <template #body="{ data }">
            <Button
              icon="pi pi-trash"
              text
              rounded
              severity="secondary"
              @click="participantStore.removeParticipant(data.id)"
              aria-label="Delete Student"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Блок добавления нового студента -->
    <div class="enroll-section">
      <h3 class="section-title mb-1">Enroll New Student</h3>
      <p class="section-subtitle">Manually add a student to the roster.</p>

      <div class="enroll-form">
        <div class="form-group">
          <label>INSTITUTE</label>
          <Select
            v-model="selectedInstitute"
            :options="institutes"
            optionLabel="label"
            placeholder="Select Institute"
            class="w-full"
          />
        </div>
        <div class="form-group">
          <label>GROUP</label>
          <Select
            v-model="selectedGroup"
            :options="groups"
            optionLabel="label"
            placeholder="Select Group"
            class="w-full"
          />
        </div>
        <div class="form-group flex-grow">
          <label>STUDENT NAME (F.I.O.)</label>
          <IconField iconPosition="left">
            <InputIcon class="pi pi-user" />
            <InputText placeholder="Type to search database..." class="w-full" />
          </IconField>
        </div>
        <div class="form-group submit-group">
          <Button label="Add" icon="pi pi-plus" class="w-full" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.participants-manager {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* --- STATS CARDS --- */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.stat-card {
  background-color: var(--p-surface-0);
  border: 1px solid var(--p-surface-200);
  border-radius: var(--p-border-radius);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--p-text-muted-color);
  font-size: 0.875rem;
  font-weight: 500;
}

.stat-header i {
  font-size: 1rem;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--p-text-color);
  line-height: 1;
}

/* --- TABLE SECTION --- */
.table-section {
  background-color: var(--p-surface-0);
  border: 1px solid var(--p-surface-200);
  border-radius: var(--p-border-radius);
  padding: 1.5rem;
}

.table-header-custom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--p-text-color);
}

.section-subtitle {
  margin: 0 0 1.5rem 0;
  color: var(--p-text-muted-color);
  font-size: 0.875rem;
}

.search-field {
  width: 300px;
}

.search-field :deep(input) {
  width: 100%;
}

.custom-table :deep(th) {
  font-size: 0.75rem;
  color: var(--p-text-muted-color);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background-color: transparent;
  border-bottom: 1px solid var(--p-surface-200);
}

.custom-table :deep(td) {
  border-bottom: 1px solid var(--p-surface-100);
  padding: 1rem 0.5rem;
}

.student-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.student-name {
  font-weight: 600;
  color: var(--p-text-color);
}

.text-muted {
  color: var(--p-text-muted-color);
}

/* --- ENROLL SECTION --- */
.enroll-section {
  background-color: var(--p-surface-0);
  border: 1px solid var(--p-surface-200);
  border-radius: var(--p-border-radius);
  padding: 1.5rem;
}

.mb-1 {
  margin-bottom: 0.25rem;
}

.enroll-form {
  display: flex;
  gap: 1.5rem;
  align-items: flex-end;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 250px;
}

.form-group label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--p-text-muted-color);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.flex-grow {
  flex-grow: 1;
  width: auto;
}

.submit-group {
  width: 150px;
}

.w-full {
  width: 100%;
}

/* Адаптив */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .enroll-form {
    flex-direction: column;
    align-items: stretch;
  }
  .form-group,
  .submit-group {
    width: 100%;
  }
}
</style>
