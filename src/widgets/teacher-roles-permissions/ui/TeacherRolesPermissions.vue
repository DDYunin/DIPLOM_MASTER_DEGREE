<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import Chip from 'primevue/chip'
import Skeleton from 'primevue/skeleton'
import Message from 'primevue/message'

import { fetchTeacherStudentGroups } from '@/entities/teacher-access'
import { AddPermissionScope } from '@/features/add-permission-scope'
import { WidgetCard } from '@/shared/ui/'

const props = defineProps<{
  teacherId: string
}>()

const { t } = useI18n()
const queryClient = useQueryClient()

const studentGroupsQuery = useQuery({
  queryKey: computed(() => ['teacher-student-groups', props.teacherId]),
  queryFn: () => fetchTeacherStudentGroups(),
  enabled: computed(() => !!props.teacherId)
})

const studentGroups = computed(() => studentGroupsQuery.data.value?.items ?? [])

const handleGranted = () => {
  queryClient.invalidateQueries({ queryKey: ['teacher-student-groups', props.teacherId] })
}
</script>

<template>
  <WidgetCard
    icon="pi-check-circle"
    :title="t('teacherRoles.title')"
    iconColorToken="var(--color-primary)"
    :subtitle="t('teacherRoles.subtitle')"
  >
    <template #header-actions>
      <AddPermissionScope :teacher-id="teacherId" @granted="handleGranted" />
    </template>

    <template #default>
      <div class="groups-section">
        <label class="section-label">{{ t('teacherRoles.assignedGroups') }}</label>

        <div v-if="studentGroupsQuery.isLoading.value" class="chips-container">
          <Skeleton width="120px" height="32px" borderRadius="999px" />
          <Skeleton width="160px" height="32px" borderRadius="999px" />
        </div>

        <Message v-else-if="studentGroupsQuery.isError.value" severity="error" :closable="false">
          {{ t('teacherRoles.loadScopesError') }}
        </Message>

        <p v-else-if="studentGroups.length === 0" class="empty-text">
          {{ t('teacherRoles.noAssignedGroups') }}
        </p>

        <div v-else class="chips-container">
          <Chip
            v-for="group in studentGroups"
            :key="group.id"
            :label="group.name"
            class="custom-chip"
          />
        </div>
      </div>
    </template>
  </WidgetCard>
</template>

<style scoped>
.groups-section {
  margin-bottom: 0;
}

.section-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
  display: block;
}

.chips-container {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.empty-text {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-color-secondary);
}

.custom-chip {
  background: var(--color-primary-subtle);
  color: var(--color-primary);
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.25rem 0.75rem;
}
</style>
