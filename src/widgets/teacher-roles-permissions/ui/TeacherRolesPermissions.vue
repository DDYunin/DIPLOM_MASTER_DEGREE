<script setup lang="ts">
import { ref } from 'vue'
import Chip from 'primevue/chip'
import ToggleSwitch from 'primevue/toggleswitch'
import type { TeacherProfile } from '@/entities/user'
import { AddPermissionScope } from '@/features/add-permission-scope'

import { WidgetCard } from '@/shared/ui/'

const props = defineProps<{ profile: TeacherProfile }>()

// Локальное состояние для переключателей (тогглов)
const permissions = ref({ ...props.profile.permissions })

const groups = ref([...props.profile.groups])

// Обработка события @add из нашего модального окна
const handleAddGroups = (newGroups: string[]) => {
  // Чтобы не добавлять дубликаты, отфильтруем те группы, которые уже есть у преподавателя
  const uniqueNewGroups = newGroups.filter((group) => !groups.value.includes(group))

  // Добавляем новые группы в реактивный массив профиля
  groups.value.push(...uniqueNewGroups)
}

// Функция для удаления группы (когда пользователь кликает на крестик в Chip)
const removeGroup = (groupToRemove: string) => {
  groups.value = groups.value.filter((g) => g !== groupToRemove)
}
</script>

<template>
  <WidgetCard
    icon="pi-check-circle"
    title="Roles & Permissions"
    iconColorToken="#3b82f6"
    subtitle="Access levels and administrative groups assigned to this user"
  >
    <template #header-actions>
      <AddPermissionScope @add="handleAddGroups" />
    </template>
    <template #default>
      <div class="groups-section">
        <label class="section-label">ASSIGNED GROUPS</label>
        <div class="chips-container">
          <!-- Отрисовываем группы. У Chip есть событие @remove для крестика -->
          <Chip
            v-for="group in groups"
            :key="group"
            :label="group"
            removable
            @remove="removeGroup(group)"
            class="custom-chip"
          />
        </div>
      </div>

      <div class="permissions-grid">
        <div class="permission-item">
          <div class="perm-text">
            <span class="perm-name">Publish Grades</span>
            <span class="perm-desc">Can finalize term grades</span>
          </div>
          <ToggleSwitch v-model="permissions.publishGrades" />
        </div>

        <div class="permission-item">
          <div class="perm-text">
            <span class="perm-name">Manage System Users</span>
            <span class="perm-desc">Can add new students</span>
          </div>
          <ToggleSwitch v-model="permissions.manageUsers" />
        </div>
      </div>
    </template>
  </WidgetCard>
</template>

<style scoped>
.groups-section {
  margin-bottom: 1.5rem;
}
.section-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
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

/* Стилизация Chip (наш бейджик с крестиком) */
.custom-chip {
  background: #eff6ff; /* Светло-синий фон, как на макете */
  color: #3b82f6;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.25rem 0.75rem;
}
/* Делаем крестик удаления чуть бледнее */
:deep(.p-chip-remove-icon) {
  color: #93c5fd;
  transition: color 0.2s;
}
:deep(.p-chip-remove-icon:hover) {
  color: #2563eb;
}

.permissions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.permission-item {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
}
.perm-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.perm-name {
  font-weight: 600;
  color: #0f172a;
  font-size: 0.875rem;
}
.perm-desc {
  font-size: 0.75rem;
  color: #64748b;
}
</style>
