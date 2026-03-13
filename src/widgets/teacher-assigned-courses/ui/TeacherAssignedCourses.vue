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
  <WidgetCard icon="pi-book" title="Assigned Courses" iconColorToken="#3b82f6">
    <template #header-actions>
      <a href="#" class="history-link">View All History</a>
    </template>
    <template #default>
      <DataTable :value="profile.courses" class="courses-table">
        <Column
          field="code"
          header="Course Code"
          headerStyle="color: #64748b; font-size: 0.875rem;"
        ></Column>
        <Column
          field="name"
          header="Course Name"
          headerStyle="color: #64748b; font-size: 0.875rem;"
        ></Column>
        <Column
          field="semester"
          header="Semester"
          headerStyle="color: #64748b; font-size: 0.875rem;"
        ></Column>
        <Column field="status" header="Status" headerStyle="color: #64748b; font-size: 0.875rem;">
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
  color: #3b82f6;
  font-size: 0.875rem;
  text-decoration: none;
  font-weight: 500;
}
:deep(.p-datatable-thead > tr > th) {
  background: transparent;
  border-bottom: 1px solid #e2e8f0;
}
:deep(.p-datatable-tbody > tr > td) {
  font-size: 0.875rem;
  color: #334155;
  font-weight: 500;
}
</style>
