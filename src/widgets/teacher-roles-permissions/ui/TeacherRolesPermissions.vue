<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import Chip from 'primevue/chip'
import Skeleton from 'primevue/skeleton'
import Message from 'primevue/message'

import {
  fetchTeacherGroupAccess,
  fetchTeacherStudentGroups,
  revokeTeacherGroupAccess,
  type TeacherGroupAccessScopeDetailsDto,
  type TeacherScopeType
} from '@/entities/teacher-access'
import { AddPermissionScope } from '@/features/add-permission-scope'
import { useNotifications } from '@/shared/model'
import { WidgetCard } from '@/shared/ui/'

const props = withDefaults(
  defineProps<{
    teacherId?: string
    readonly?: boolean
  }>(),
  {
    readonly: false
  }
)

const { t } = useI18n()
const notifications = useNotifications()
const queryClient = useQueryClient()

const groupAccessQuery = useQuery({
  queryKey: computed(() => ['teacher-group-access', props.teacherId]),
  queryFn: () => fetchTeacherGroupAccess(props.teacherId!),
  enabled: computed(() => !props.readonly && !!props.teacherId)
})

const studentGroupsQuery = useQuery({
  queryKey: ['teacher-student-groups', 'me'],
  queryFn: () => fetchTeacherStudentGroups(),
  enabled: computed(() => props.readonly)
})

const isLoading = computed(() =>
  props.readonly ? studentGroupsQuery.isLoading.value : groupAccessQuery.isLoading.value
)

const isError = computed(() =>
  props.readonly ? studentGroupsQuery.isError.value : groupAccessQuery.isError.value
)

const accessScopes = computed(() => groupAccessQuery.data.value ?? [])

const studentGroups = computed(() => studentGroupsQuery.data.value?.items ?? [])

const isEmpty = computed(() =>
  props.readonly ? studentGroups.value.length === 0 : accessScopes.value.length === 0
)

const scopeTypeLabel = (scopeType: TeacherScopeType) => {
  const key =
    scopeType === 'FIELD_OF_STUDY'
      ? 'fieldOfStudy'
      : scopeType === 'STUDENT_GROUP'
        ? 'studentGroup'
        : 'faculty'
  return t(`addPermission.scopeTypes.${key}`)
}

const revokeMutation = useMutation({
  mutationFn: (scope: TeacherGroupAccessScopeDetailsDto) =>
    revokeTeacherGroupAccess(props.teacherId!, scope.scopeType, scope.scopeId),
  onSuccess: () => {
    notifications.showToast('success', t('common.success'), t('teacherRoles.scopeRevoked'))
    queryClient.invalidateQueries({ queryKey: ['teacher-group-access', props.teacherId] })
  }
})

const handleGranted = () => {
  queryClient.invalidateQueries({ queryKey: ['teacher-group-access', props.teacherId] })
}

const handleRevoke = (scope: TeacherGroupAccessScopeDetailsDto) => {
  if (revokeMutation.isPending.value) {
    return
  }
  revokeMutation.mutate(scope)
}
</script>

<template>
  <WidgetCard
    icon="pi-check-circle"
    :title="t('teacherRoles.title')"
    iconColorToken="var(--color-primary)"
    :subtitle="readonly ? t('teacherRoles.subtitleReadonly') : t('teacherRoles.subtitle')"
  >
    <template v-if="!readonly" #header-actions>
      <AddPermissionScope :teacher-id="teacherId!" @granted="handleGranted" />
    </template>

    <template #default>
      <div class="groups-section">
        <label class="section-label">
          {{ readonly ? t('teacherRoles.assignedGroups') : t('teacherRoles.assignedScopes') }}
        </label>

        <div v-if="isLoading" class="chips-container">
          <Skeleton width="120px" height="32px" borderRadius="999px" />
          <Skeleton width="160px" height="32px" borderRadius="999px" />
        </div>

        <Message v-else-if="isError" severity="error" :closable="false">
          {{ t('teacherRoles.loadScopesError') }}
        </Message>

        <p v-else-if="isEmpty" class="empty-text">
          {{ t('teacherRoles.noAssignedGroups') }}
        </p>

        <div v-else-if="readonly" class="chips-container">
          <Chip
            v-for="group in studentGroups"
            :key="group.id"
            :label="group.name"
            class="custom-chip"
          />
        </div>

        <div v-else class="chips-container">
          <Chip
            v-for="scope in accessScopes"
            :key="`${scope.scopeType}-${scope.scopeId}`"
            :label="`${scope.scopeName} · ${scopeTypeLabel(scope.scopeType)}`"
            removable
            class="custom-chip"
            @remove="handleRevoke(scope)"
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

:deep(.p-chip-remove-icon) {
  color: var(--color-primary-icon-muted);
  transition: color 0.2s;
}

:deep(.p-chip-remove-icon:hover) {
  color: var(--color-primary-strong);
}
</style>
