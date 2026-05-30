<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import type { User } from '@/entities/user'

import { WidgetCard } from '@/shared/ui/'

const { t } = useI18n()

defineProps<{ profile: User }>()

const getStatusSeverity = (status: string) => {
  if (status === 'Active') return 'success'
  if (status === 'Upcoming') return 'warning'
  return 'secondary'
}
</script>

<template>
  <WidgetCard icon="pi-book" :title="t('teacherAssigned.title')" iconColorToken="var(--color-primary)">
    <template #header-actions>
      <a href="#" class="history-link">{{ t('teacherAssigned.viewHistory') }}</a>
    </template>
    <template #default>
      <DataTable :value="profile.courses ?? []" class="courses-table">
        <Column field="code" :header="t('teacherAssigned.courseCode')"></Column>
        <Column field="name" :header="t('teacherAssigned.courseName')"></Column>
        <Column field="semester" :header="t('teacherAssigned.semester')"></Column>
        <Column field="status" :header="t('common.status')">
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
