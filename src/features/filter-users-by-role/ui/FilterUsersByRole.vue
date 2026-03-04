<script setup lang="ts">
// Выбранная роль ('All Users' по умолчанию)
const selectedRole = defineModel<string>({ default: 'All Users' })

const rolesTabs = ['All Users', 'Admin', 'Teacher', 'Student']
</script>

<template>
  <div class="tabs">
    <button
      v-for="role in rolesTabs"
      :key="role"
      @click="selectedRole = role"
      :class="['tab', { active: selectedRole === role }]"
    >
      {{ role }}
    </button>
    <div class="divider"></div>
    <button class="tab more-filters"><i class="pi pi-filter"></i> More Filters</button>
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.tab {
  background: none;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  padding: 0.5rem;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}
.tab:hover {
  color: #0f172a;
}
.tab.active {
  color: #0f172a;
  font-weight: 600;
  border-bottom: 2px solid var(--p-primary-color);
}
.divider {
  width: 1px;
  height: 1.5rem;
  background: #e2e8f0;
  margin: 0 0.5rem;
}
.more-filters {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #475569;
}
</style>
