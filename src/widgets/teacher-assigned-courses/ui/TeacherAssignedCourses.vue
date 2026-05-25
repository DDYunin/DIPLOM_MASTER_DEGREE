<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import type { TeacherProfile } from '@/entities/user'

import { WidgetCard } from '@/shared/ui/'

defineProps<{ profile: TeacherProfile }>()

const getStatusSeverity = (status: string) => {
  if (status === 'Active') return 'success'
  if (status === 'Upcoming') return 'warning'
  return 'secondary'
}
</script>

<template>
  <WidgetCard icon="pi-book" title="Assigned Courses" iconColorToken="var(--color-primary)">
    <template #header-actions>
      <a href="#" class="history-link">View All History</a>
    </template>
    <template #default>
      <DataTable :value="profile.courses" class="courses-table">
        <Column field="code" header="Course Code"></Column>
        <Column field="name" header="Course Name"></Column>
        <Column field="semester" header="Semester"></Column>
        <Column field="status" header="Status">
          <template #body="slotProps">
            <Tag
              :value="slotProps.data.status"
              :severity="getStatusSeverity(slotProps.data.status)"
              rounded
            />
          </template>
        </Column>
      </DataTable>
    </template>
  </WidgetCard>
</template>

<style scoped>
.history-link {
  color: var(--color-primary);
  font-size: 0.875rem;
  text-decoration: none;
  font-weight: 500;
}
:deep(.p-datatable-thead > tr > th) {
  background: transparent;
  border-bottom: 1px solid var(--surface-border);
  color: var(--text-color-secondary);
  font-size: 0.875rem;
}
:deep(.p-datatable-tbody > tr > td) {
  font-size: 0.875rem;
  color: var(--text-color-emphasis);
  font-weight: 500;
}
</style>
