<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import type { TeacherProfile } from '@/entities/user';

defineProps<{ profile: TeacherProfile }>()

const getStatusSeverity = (status: string) => {
  if (status === 'Active') return 'success'
  if (status === 'Upcoming') return 'warning'
  return 'secondary'
}
</script>

<template>
  <div class="widget-card">
    <div class="card-header">
      <h3 class="card-title"><i class="pi pi-book"></i> Assigned Courses</h3>
      <a href="#" class="history-link">View All History</a>
    </div>

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
  </div>
</template>

<style scoped>
.widget-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.card-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.card-title i {
  color: #3b82f6;
}
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
