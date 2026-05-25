<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { type usersTableFilters, USERS_TABLE_FILTERS } from '../model/const'

const { t } = useI18n()

const modelValue = defineModel<usersTableFilters>({ default: 'ALL' })

const roleTabs = computed<
  {
    label: string
    value: usersTableFilters
  }[]
>(() => [
  { label: t('roles.all'), value: USERS_TABLE_FILTERS.ALL },
  { label: t('roles.admin'), value: USERS_TABLE_FILTERS.ADMIN },
  { label: t('roles.teacher'), value: USERS_TABLE_FILTERS.TEACHER },
  { label: t('roles.student'), value: USERS_TABLE_FILTERS.STUDENT }
])
</script>

<template>
  <div class="tabs">
    <button
      v-for="tab in roleTabs"
      :key="tab.value"
      @click="modelValue = tab.value"
      :class="['tab-btn', { active: modelValue === tab.value }]"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.tab-btn {
  background: none;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-color-secondary);
  cursor: pointer;
  padding: 0.5rem 0.25rem;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}
.tab-btn:hover {
  color: var(--text-color);
}
.tab-btn.active {
  color: var(--color-primary);
  font-weight: 600;
  border-bottom: 2px solid var(--color-primary);
}
</style>
